import {
  playScriptedAudio,
  resolveRecordingMimeType,
  type ClassroomAudioCue,
  type ClassroomAudioService,
} from './classroom-audio-service';

export type ClassroomAudioErrorReason =
  | 'playback_blocked'
  | 'playback_failed'
  | 'microphone_denied'
  | 'microphone_unavailable'
  | 'microphone_insecure'
  | 'recording_unavailable'
  | 'recording_failed'
  | 'recording_empty';

export type ClassroomTranscriptFailureReason =
  | 'timeout'
  | 'empty'
  | 'unavailable'
  | 'error'
  | 'low_confidence';

export type ClassroomTranscriptStatus = 'idle' | 'waiting' | 'resolved' | 'failed';

export type ClassroomAudioRetryableStep =
  | 'playback'
  | 'microphone-check'
  | 'recording'
  | null;

export type ClassroomAudioStatus =
  | 'idle'
  | 'ready'
  | 'preflight_failed'
  | 'playing_teacher'
  | 'playing_bobby'
  | 'playback_failed'
  | 'recording_student'
  | 'recording_failed'
  | 'awaiting_transcript';

export type ClassroomRecordingArtifact = {
  blob: Blob;
  durationMs: number;
  mimeType: string;
};

export type ClassroomAudioSnapshot = {
  canStartRecording: boolean;
  currentCue: ClassroomAudioCue | null;
  currentSpeaker: ClassroomAudioCue['speaker'] | null;
  lastError: {
    message: string;
    reason: ClassroomAudioErrorReason;
  } | null;
  lastRecording: ClassroomRecordingArtifact | null;
  lastTranscript: string | null;
  preflight: {
    microphonePermission: 'unknown' | 'prompt' | 'granted' | 'denied';
    microphoneReady: boolean;
    skipped: boolean;
    speakerReady: boolean;
  };
  retryableStep: ClassroomAudioRetryableStep;
  status: ClassroomAudioStatus;
  transcriptFailureReason: ClassroomTranscriptFailureReason | null;
  transcriptLatencyMs: number | null;
  transcriptStatus: ClassroomTranscriptStatus;
};

type MediaRecorderCtor = typeof MediaRecorder;
type PermissionQuery = (
  descriptor: PermissionDescriptor & { name: 'microphone' },
) => Promise<{ state: 'prompt' | 'granted' | 'denied' }>;

type CreateClassroomAudioRuntimeOptions = {
  MediaRecorderCtor?: MediaRecorderCtor | null;
  audioService: ClassroomAudioService;
  getUserMedia?: ((constraints: MediaStreamConstraints) => Promise<MediaStream>) | null;
  now?: () => number;
  queryPermission?: PermissionQuery | null;
  transcriptTimeoutMs?: number;
};

type Listener = (snapshot: ClassroomAudioSnapshot) => void;

export type ClassroomAudioRuntime = ReturnType<typeof createClassroomAudioRuntime>;

export function createClassroomAudioRuntime({
  MediaRecorderCtor = typeof MediaRecorder === 'undefined' ? null : MediaRecorder,
  audioService,
  getUserMedia = defaultGetUserMedia,
  now = () => Date.now(),
  queryPermission = defaultQueryPermission,
  transcriptTimeoutMs = 3500,
}: CreateClassroomAudioRuntimeOptions) {
  const listeners = new Set<Listener>();

  let snapshot: ClassroomAudioSnapshot = {
    canStartRecording: true,
    currentCue: null,
    currentSpeaker: null,
    lastError: null,
    lastRecording: null,
    lastTranscript: null,
    preflight: {
      microphonePermission: 'unknown',
      microphoneReady: false,
      skipped: false,
      speakerReady: false,
    },
    retryableStep: null,
    status: 'idle',
    transcriptFailureReason: null,
    transcriptLatencyMs: null,
    transcriptStatus: 'idle',
  };
  let currentRecorder:
    | {
        chunks: Blob[];
        mimeType: string;
        recorder: MediaRecorder;
        startMs: number;
        stopPromise: Promise<ClassroomRecordingArtifact> | null;
        stream: MediaStream;
      }
    | null = null;
  let retryAction: (() => Promise<unknown>) | null = null;
  let transcriptTimeoutHandle: ReturnType<typeof setTimeout> | null = null;
  let transcriptWaitStartedAt: number | null = null;

  function emit(nextSnapshot: ClassroomAudioSnapshot) {
    snapshot = nextSnapshot;
    listeners.forEach((listener) => listener(snapshot));
  }

  function patchSnapshot(
    updater: (current: ClassroomAudioSnapshot) => ClassroomAudioSnapshot,
  ) {
    emit(updater(snapshot));
  }

  function clearTranscriptTimeout() {
    if (transcriptTimeoutHandle) {
      clearTimeout(transcriptTimeoutHandle);
      transcriptTimeoutHandle = null;
    }
  }

  function resetTranscriptTelemetry() {
    clearTranscriptTimeout();
    transcriptWaitStartedAt = null;
    patchSnapshot((current) => ({
      ...current,
      lastTranscript: null,
      transcriptFailureReason: null,
      transcriptLatencyMs: null,
      transcriptStatus: 'idle',
    }));
  }

  function markReady() {
    patchSnapshot((current) => ({
      ...current,
      canStartRecording: true,
      currentCue: null,
      currentSpeaker: null,
      retryableStep: null,
      status: 'ready',
    }));
  }

  function setFailure(
    reason: ClassroomAudioErrorReason,
    message: string,
    retryableStep: ClassroomAudioRetryableStep,
    status: Extract<
      ClassroomAudioStatus,
      'preflight_failed' | 'playback_failed' | 'recording_failed'
    >,
  ) {
    patchSnapshot((current) => ({
      ...current,
      canStartRecording: false,
      currentCue: null,
      currentSpeaker: null,
      lastError: { message, reason },
      retryableStep,
      status,
    }));
  }

  function beginTranscriptWait(artifact: ClassroomRecordingArtifact) {
    clearTranscriptTimeout();
    transcriptWaitStartedAt = now();
    patchSnapshot((current) => ({
      ...current,
      canStartRecording: false,
      currentCue: null,
      currentSpeaker: null,
      lastError: null,
      lastRecording: artifact,
      retryableStep: null,
      status: 'awaiting_transcript',
      transcriptFailureReason: null,
      transcriptLatencyMs: null,
      transcriptStatus: 'waiting',
    }));

    transcriptTimeoutHandle = setTimeout(() => {
      failTranscript('timeout');
    }, transcriptTimeoutMs);
  }

  function resolveTranscript(transcript: string) {
    clearTranscriptTimeout();
    const latencyMs =
      transcriptWaitStartedAt === null ? null : Math.max(0, now() - transcriptWaitStartedAt);
    transcriptWaitStartedAt = null;
    patchSnapshot((current) => ({
      ...current,
      canStartRecording: true,
      currentCue: null,
      currentSpeaker: null,
      retryableStep: null,
      status: 'ready',
      lastTranscript: transcript,
      transcriptFailureReason: null,
      transcriptLatencyMs: latencyMs,
      transcriptStatus: 'resolved',
    }));
  }

  function failTranscript(reason: ClassroomTranscriptFailureReason) {
    clearTranscriptTimeout();
    const latencyMs =
      transcriptWaitStartedAt === null ? null : Math.max(0, now() - transcriptWaitStartedAt);
    transcriptWaitStartedAt = null;
    patchSnapshot((current) => ({
      ...current,
      canStartRecording: true,
      currentCue: null,
      currentSpeaker: null,
      retryableStep: 'recording',
      status: 'ready',
      transcriptFailureReason: reason,
      transcriptLatencyMs: latencyMs,
      transcriptStatus: 'failed',
    }));
  }

  async function playCue(cue: ClassroomAudioCue) {
    retryAction = () => playCue(cue);
    patchSnapshot((current) => ({
      ...current,
      canStartRecording: false,
      currentCue: cue,
      currentSpeaker: cue.speaker,
      lastError: null,
      retryableStep: null,
      status:
        cue.speaker === 'teacher' ? 'playing_teacher' : 'playing_bobby',
    }));

    try {
      await playScriptedAudio(audioService, cue);
      patchSnapshot((current) => ({
        ...current,
        preflight: {
          ...current.preflight,
          speakerReady: true,
        },
      }));
      markReady();
    } catch (error) {
      const domException =
        error instanceof DOMException ? error : null;
      const reason =
        domException?.name === 'NotAllowedError'
          ? 'playback_blocked'
          : 'playback_failed';
      const message =
        error instanceof Error ? error.message : 'Audio playback failed.';
      setFailure(reason, message, 'playback', 'playback_failed');
      throw error;
    }
  }

  async function syncPermissionState() {
    if (!queryPermission) {
      return snapshot.preflight.microphonePermission;
    }

    try {
      const permission = await queryPermission({ name: 'microphone' });
      patchSnapshot((current) => ({
        ...current,
        preflight: {
          ...current.preflight,
          microphonePermission: permission.state,
        },
      }));

      return permission.state;
    } catch {
      return snapshot.preflight.microphonePermission;
    }
  }

  async function runMicrophoneCheck() {
    retryAction = () => runMicrophoneCheck();
    await syncPermissionState();

    if (!getUserMedia) {
      const error = new Error('Microphone capture is unavailable.');
      setFailure(
        'recording_unavailable',
        error.message,
        'microphone-check',
        'preflight_failed',
      );
      throw error;
    }

    try {
      const stream = await getUserMedia({ audio: true, video: false });
      stopStream(stream);
      patchSnapshot((current) => ({
        ...current,
        canStartRecording: true,
        lastError: null,
        preflight: {
          ...current.preflight,
          microphonePermission:
            current.preflight.microphonePermission === 'unknown'
              ? 'granted'
              : current.preflight.microphonePermission,
          microphoneReady: true,
        },
        retryableStep: null,
        status: current.preflight.speakerReady ? 'ready' : 'idle',
      }));
      return true;
    } catch (error) {
      const mapped = mapMediaError(error);
      patchSnapshot((current) => ({
        ...current,
        preflight: {
          ...current.preflight,
          microphonePermission:
            mapped.reason === 'microphone_denied'
              ? 'denied'
              : current.preflight.microphonePermission,
          microphoneReady: false,
        },
      }));
      setFailure(
        mapped.reason,
        mapped.message,
        'microphone-check',
        'preflight_failed',
      );
      throw error;
    }
  }

  async function startStudentRecording() {
    if (snapshot.status === 'playing_teacher' || snapshot.status === 'playing_bobby') {
      throw new Error('Cannot start recording while scripted playback is active.');
    }

    retryAction = () => startStudentRecording();
    resetTranscriptTelemetry();

    if (!getUserMedia || !MediaRecorderCtor) {
      const error = new Error('Recording is unavailable in this browser.');
      setFailure(
        'recording_unavailable',
        error.message,
        'recording',
        'recording_failed',
      );
      throw error;
    }

    await syncPermissionState();

    try {
      const stream = await getUserMedia({ audio: true, video: false });
      const mimeType = resolveRecordingMimeType(MediaRecorderCtor);
      const recorder = new MediaRecorderCtor(stream, { mimeType });

      currentRecorder = {
        chunks: [],
        mimeType,
        recorder,
        startMs: now(),
        stopPromise: null,
        stream,
      };

      recorder.addEventListener('dataavailable', (event) => {
        const blobEvent = event as BlobEvent | undefined;
        if (blobEvent?.data && blobEvent.data.size > 0) {
          currentRecorder?.chunks.push(blobEvent.data);
        }
      });

      recorder.addEventListener('error', () => {
        const error = new Error('Recording failed before the class could hear you.');
        cleanupRecorder();
        setFailure('recording_failed', error.message, 'recording', 'recording_failed');
      });

      recorder.start();
      patchSnapshot((current) => ({
        ...current,
        canStartRecording: false,
        currentCue: null,
        currentSpeaker: 'student',
        lastError: null,
        retryableStep: null,
        status: 'recording_student',
      }));
    } catch (error) {
      const mapped = mapMediaError(error);
      setFailure(mapped.reason, mapped.message, 'recording', 'recording_failed');
      throw error;
    }
  }

  async function stopStudentRecording() {
    if (!currentRecorder) {
      throw new Error('No classroom recording is active.');
    }

    if (currentRecorder.stopPromise) {
      return currentRecorder.stopPromise;
    }

    const recordingContext = currentRecorder;

    const stopPromise = new Promise<ClassroomRecordingArtifact>(
      (resolve, reject) => {
        const handleStop = () => {
          const durationMs = Math.max(1, now() - recordingContext.startMs);
          const blob = new Blob(recordingContext.chunks, {
            type: recordingContext.mimeType,
          });

          cleanupRecorder();

          if (blob.size === 0) {
            const error = new Error('The recording was empty. Please try again.');
            setFailure('recording_empty', error.message, 'recording', 'recording_failed');
            reject(error);
            return;
          }

          const artifact = {
            blob,
            durationMs,
            mimeType: recordingContext.mimeType,
          };

          beginTranscriptWait(artifact);
          resolve(artifact);
        };

        recordingContext.recorder.addEventListener('stop', handleStop, { once: true });
        recordingContext.recorder.stop();
      },
    );
    currentRecorder.stopPromise = stopPromise;

    return stopPromise;
  }

  async function retryLastStep() {
    if (!retryAction) {
      return;
    }

    await retryAction();
  }

  function skipPreflight() {
    patchSnapshot((current) => ({
      ...current,
      canStartRecording: true,
      preflight: {
        ...current.preflight,
        skipped: true,
      },
      retryableStep: null,
      status: current.status === 'idle' ? 'ready' : current.status,
    }));
  }

  function cleanupRecorder() {
    if (!currentRecorder) {
      return;
    }

    stopStream(currentRecorder.stream);
    currentRecorder = null;
  }

  function dispose() {
    cleanupRecorder();
    clearTranscriptTimeout();
    audioService.stop?.();
    listeners.clear();
  }

  return {
    dispose,
    getSnapshot() {
      return snapshot;
    },
    playCue,
    retryLastStep,
    runMicrophoneCheck,
    skipPreflight,
    startStudentRecording,
    stopStudentRecording,
    failTranscript,
    resolveTranscript,
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    syncPermissionState,
  };
}

function defaultGetUserMedia(constraints: MediaStreamConstraints) {
  return navigator.mediaDevices.getUserMedia(constraints);
}

async function defaultQueryPermission(
  descriptor: PermissionDescriptor & { name: 'microphone' },
) {
  if (!navigator.permissions?.query) {
    throw new Error('Permissions API is unavailable.');
  }

  return navigator.permissions.query(descriptor) as ReturnType<PermissionQuery>;
}

function stopStream(stream: MediaStream) {
  stream.getTracks().forEach((track) => track.stop());
}

function mapMediaError(error: unknown) {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
        return {
          message: error.message,
          reason: 'microphone_denied' as const,
        };
      case 'NotFoundError':
        return {
          message: error.message,
          reason: 'microphone_unavailable' as const,
        };
      case 'TypeError':
        return {
          message: error.message,
          reason: 'microphone_insecure' as const,
        };
      default:
        return {
          message: error.message,
          reason: 'recording_failed' as const,
        };
    }
  }

  return {
    message:
      error instanceof Error ? error.message : 'Unknown media capture failure.',
    reason: 'recording_failed' as const,
  };
}

export type { ClassroomAudioCue } from './classroom-audio-service';
