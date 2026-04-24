import { describe, expect, it, vi } from 'vitest';

import {
  createClassroomAudioRuntime,
  type ClassroomAudioCue,
} from '@/features/classroom-shell/classroom-audio-runtime';

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

function createPlaybackCue(
  speaker: ClassroomAudioCue['speaker'],
  text: string,
): ClassroomAudioCue {
  return {
    cueKey: `${speaker}-${text}`,
    speaker,
    text,
  };
}

function createFakeStream() {
  const track = {
    stop: vi.fn(),
  };

  return {
    stream: {
      getTracks: () => [track],
    } as unknown as MediaStream,
    track,
  };
}

class FakeMediaRecorder {
  static supportedMimeTypes = new Set<string>(['audio/webm;codecs=opus']);
  static instances: FakeMediaRecorder[] = [];

  static isTypeSupported(type: string) {
    return FakeMediaRecorder.supportedMimeTypes.has(type);
  }

  readonly mimeType: string;
  readonly stream: MediaStream;
  state: 'inactive' | 'recording' | 'paused' = 'inactive';

  private listeners = new Map<string, Set<(event?: unknown) => void>>();

  constructor(stream: MediaStream, options?: { mimeType?: string }) {
    this.stream = stream;
    this.mimeType = options?.mimeType ?? 'audio/webm;codecs=opus';
    FakeMediaRecorder.instances.push(this);
  }

  addEventListener(name: string, listener: (event?: unknown) => void) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Set());
    }

    this.listeners.get(name)?.add(listener);
  }

  removeEventListener(name: string, listener: (event?: unknown) => void) {
    this.listeners.get(name)?.delete(listener);
  }

  start() {
    this.state = 'recording';
  }

  stop() {
    this.state = 'inactive';
  }

  emit(name: string, event?: unknown) {
    this.listeners.get(name)?.forEach((listener) => listener(event));
  }
}

describe('classroom-audio-runtime', () => {
  it('keeps recording blocked while scripted playback is still active', async () => {
    const playback = createDeferred<void>();
    const fakeStream = createFakeStream();
    const runtime = createClassroomAudioRuntime({
      audioService: {
        playCue: vi.fn(() => playback.promise),
      },
      getUserMedia: vi.fn(async () => fakeStream.stream),
      MediaRecorderCtor: FakeMediaRecorder as unknown as typeof MediaRecorder,
    });

    const playPromise = runtime.playCue(createPlaybackCue('teacher', 'Hello, class.'));

    expect(runtime.getSnapshot().status).toBe('playing_teacher');
    expect(runtime.getSnapshot().canStartRecording).toBe(false);
    await expect(runtime.startStudentRecording()).rejects.toThrow(
      /playback/i,
    );

    playback.resolve();
    await playPromise;

    expect(runtime.getSnapshot().status).toBe('ready');
    expect(runtime.getSnapshot().canStartRecording).toBe(true);
  });

  it('maps blocked scripted playback into a retryable playback failure state', async () => {
    const runtime = createClassroomAudioRuntime({
      audioService: {
        playCue: vi.fn(async () => {
          const error = new DOMException('Playback blocked', 'NotAllowedError');
          throw error;
        }),
      },
      getUserMedia: vi.fn(),
      MediaRecorderCtor: FakeMediaRecorder as unknown as typeof MediaRecorder,
    });

    await expect(
      runtime.playCue(createPlaybackCue('teacher', 'Hello, class.')),
    ).rejects.toThrow(/blocked/i);

    expect(runtime.getSnapshot().status).toBe('playback_failed');
    expect(runtime.getSnapshot().lastError?.reason).toBe('playback_blocked');
    expect(runtime.getSnapshot().retryableStep).toBe('playback');
  });

  it('maps microphone permission denial into a gentle preflight failure state', async () => {
    const runtime = createClassroomAudioRuntime({
      audioService: {
        playCue: vi.fn(async () => {}),
      },
      getUserMedia: vi.fn(async () => {
        throw new DOMException('Denied', 'NotAllowedError');
      }),
      MediaRecorderCtor: FakeMediaRecorder as unknown as typeof MediaRecorder,
    });

    await expect(runtime.runMicrophoneCheck()).rejects.toThrow(/Denied/);

    expect(runtime.getSnapshot().status).toBe('preflight_failed');
    expect(runtime.getSnapshot().preflight.microphoneReady).toBe(false);
    expect(runtime.getSnapshot().lastError?.reason).toBe('microphone_denied');
    expect(runtime.getSnapshot().retryableStep).toBe('microphone-check');
  });

  it('records audio with a supported MIME type and cleans up tracks after stop', async () => {
    FakeMediaRecorder.instances = [];
    FakeMediaRecorder.supportedMimeTypes = new Set(['audio/webm;codecs=opus']);

    const fakeStream = createFakeStream();
    const runtime = createClassroomAudioRuntime({
      audioService: {
        playCue: vi.fn(async () => {}),
      },
      getUserMedia: vi.fn(async () => fakeStream.stream),
      MediaRecorderCtor: FakeMediaRecorder as unknown as typeof MediaRecorder,
    });

    await runtime.startStudentRecording();

    const recorder = FakeMediaRecorder.instances.at(-1);
    expect(recorder?.mimeType).toBe('audio/webm;codecs=opus');
    expect(runtime.getSnapshot().status).toBe('recording_student');

    const stopPromise = runtime.stopStudentRecording();
    recorder?.emit('dataavailable', {
      data: new Blob(['hello'], { type: 'audio/webm;codecs=opus' }),
    });
    recorder?.emit('stop');

    const artifact = await stopPromise;

    expect(artifact.mimeType).toBe('audio/webm;codecs=opus');
    expect(artifact.blob.size).toBeGreaterThan(0);
    expect(fakeStream.track.stop).toHaveBeenCalledTimes(1);
    expect(runtime.getSnapshot().status).toBe('awaiting_transcript');
    expect(runtime.getSnapshot().transcriptStatus).toBe('waiting');
    expect(runtime.getSnapshot().transcriptFailureReason).toBeNull();
    expect(runtime.getSnapshot().transcriptLatencyMs).toBeNull();
  });

  it('times out transcript waiting with explicit telemetry instead of staying stuck', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    FakeMediaRecorder.instances = [];

    try {
      const fakeStream = createFakeStream();
      const runtime = createClassroomAudioRuntime({
        audioService: {
          playCue: vi.fn(async () => {}),
        },
        getUserMedia: vi.fn(async () => fakeStream.stream),
        MediaRecorderCtor: FakeMediaRecorder as unknown as typeof MediaRecorder,
        transcriptTimeoutMs: 3500,
      });

      await runtime.startStudentRecording();

      const recorder = FakeMediaRecorder.instances.at(-1);
      const stopPromise = runtime.stopStudentRecording();
      recorder?.emit('dataavailable', {
        data: new Blob(['hello'], { type: 'audio/webm;codecs=opus' }),
      });
      recorder?.emit('stop');

      await stopPromise;

      expect(runtime.getSnapshot().status).toBe('awaiting_transcript');
      expect(runtime.getSnapshot().transcriptStatus).toBe('waiting');

      await vi.advanceTimersByTimeAsync(3500);

      expect(runtime.getSnapshot().status).toBe('ready');
      expect(runtime.getSnapshot().retryableStep).toBe('recording');
      expect(runtime.getSnapshot().transcriptStatus).toBe('failed');
      expect(runtime.getSnapshot().transcriptFailureReason).toBe('timeout');
      expect(runtime.getSnapshot().transcriptLatencyMs).toBe(3500);
    } finally {
      vi.useRealTimers();
    }
  });

  it('treats empty recordings as retryable student-audio failures', async () => {
    FakeMediaRecorder.instances = [];

    const fakeStream = createFakeStream();
    const runtime = createClassroomAudioRuntime({
      audioService: {
        playCue: vi.fn(async () => {}),
      },
      getUserMedia: vi.fn(async () => fakeStream.stream),
      MediaRecorderCtor: FakeMediaRecorder as unknown as typeof MediaRecorder,
    });

    await runtime.startStudentRecording();

    const recorder = FakeMediaRecorder.instances.at(-1);
    const stopPromise = runtime.stopStudentRecording();
    recorder?.emit('dataavailable', {
      data: new Blob([], { type: 'audio/webm;codecs=opus' }),
    });
    recorder?.emit('stop');

    await expect(stopPromise).rejects.toThrow(/empty/i);

    expect(runtime.getSnapshot().status).toBe('recording_failed');
    expect(runtime.getSnapshot().lastError?.reason).toBe('recording_empty');
    expect(runtime.getSnapshot().retryableStep).toBe('recording');
  });
});
