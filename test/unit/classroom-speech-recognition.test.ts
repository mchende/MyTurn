import { describe, expect, it, vi } from 'vitest';

import {
  createBrowserSpeechRecognitionService,
  type ClassroomSpeechRecognitionService,
} from '@/features/classroom-shell/classroom-speech-recognition';

describe('classroom speech recognition service', () => {
  it('supports a controlled fake service contract for timeout, empty, unavailable, and error reasons', async () => {
    const fakeService: ClassroomSpeechRecognitionService = {
      cancel: vi.fn(),
      getFinalResult: vi
        .fn()
        .mockResolvedValueOnce({ transcript: null, reason: 'timeout' })
        .mockResolvedValueOnce({ transcript: null, reason: 'empty' })
        .mockResolvedValueOnce({ transcript: null, reason: 'unavailable' })
        .mockResolvedValueOnce({ transcript: null, reason: 'error' }),
      start: vi.fn(async () => {}),
      stop: vi.fn(async () => {}),
    };

    await fakeService.start();
    await fakeService.stop();

    await expect(fakeService.getFinalResult()).resolves.toEqual({
      transcript: null,
      reason: 'timeout',
    });
    await expect(fakeService.getFinalResult()).resolves.toEqual({
      transcript: null,
      reason: 'empty',
    });
    await expect(fakeService.getFinalResult()).resolves.toEqual({
      transcript: null,
      reason: 'unavailable',
    });
    await expect(fakeService.getFinalResult()).resolves.toEqual({
      transcript: null,
      reason: 'error',
    });
  });

  it('returns unavailable when no browser recognition provider exists', async () => {
    const service = createBrowserSpeechRecognitionService({
      globalScope: {},
    });

    await expect(service.getFinalResult()).resolves.toEqual({
      transcript: null,
      reason: 'unavailable',
    });
  });

  it('maps final browser results and empty stop results into explicit outcomes', async () => {
    const first = createBrowserSpeechRecognitionService({
      globalScope: {
        SpeechRecognition: createFakeRecognitionConstructor({
          resultText: 'Apple',
        }),
      },
      timeoutMs: 3000,
    });

    await first.start();
    await first.stop();

    await expect(first.getFinalResult()).resolves.toEqual({
      transcript: 'Apple',
      confidence: 0.86,
    });

    const empty = createBrowserSpeechRecognitionService({
      globalScope: {
        SpeechRecognition: createFakeRecognitionConstructor({
          resultText: '',
        }),
      },
      timeoutMs: 3000,
    });

    await empty.start();
    await empty.stop();

    await expect(empty.getFinalResult()).resolves.toEqual({
      transcript: null,
      reason: 'empty',
    });
  });

  it('maps browser error and timeout paths into explicit failure reasons', async () => {
    const failed = createBrowserSpeechRecognitionService({
      globalScope: {
        webkitSpeechRecognition: createFakeRecognitionConstructor({
          error: 'network',
        }),
      },
      timeoutMs: 3000,
    });

    await failed.start();
    await failed.stop();

    await expect(failed.getFinalResult()).resolves.toEqual({
      transcript: null,
      reason: 'error',
    });

    vi.useFakeTimers();

    try {
      const timedOut = createBrowserSpeechRecognitionService({
        globalScope: {
          SpeechRecognition: createFakeRecognitionConstructor({}),
        },
        timeoutMs: 3000,
      });

      await timedOut.start();
      await timedOut.stop();

      const resultPromise = timedOut.getFinalResult();
      await vi.advanceTimersByTimeAsync(3000);

      await expect(resultPromise).resolves.toEqual({
        transcript: null,
        reason: 'timeout',
      });
    } finally {
      vi.useRealTimers();
    }
  });
});

type FakeRecognitionOptions = {
  error?: string;
  resultText?: string;
};

function createFakeRecognitionConstructor(options: FakeRecognitionOptions) {
  return class FakeRecognition {
    continuous = true;
    interimResults = true;
    lang = '';
    maxAlternatives = 5;

    private listeners = new Map<string, Set<(event?: unknown) => void>>();

    addEventListener(name: string, listener: (event?: unknown) => void) {
      if (!this.listeners.has(name)) {
        this.listeners.set(name, new Set());
      }

      this.listeners.get(name)?.add(listener);
    }

    start() {}

    stop() {
      if (options.error) {
        this.emit('error', { error: options.error });
        return;
      }

      if (typeof options.resultText === 'string') {
        this.emit('result', {
          resultIndex: 0,
          results: [
            [
              {
                confidence: 0.86,
                transcript: options.resultText,
              },
            ],
          ],
        });
      }
    }

    abort() {
      this.emit('end');
    }

    private emit(name: string, event?: unknown) {
      this.listeners.get(name)?.forEach((listener) => listener(event));
    }
  };
}
