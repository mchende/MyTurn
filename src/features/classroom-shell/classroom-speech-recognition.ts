export type ClassroomSpeechRecognitionFailureReason =
  | 'timeout'
  | 'empty'
  | 'unavailable'
  | 'error'
  | 'low_confidence';

export type ClassroomSpeechRecognitionResult = {
  confidence?: number | null;
  reason?: ClassroomSpeechRecognitionFailureReason;
  transcript: string | null;
};

export interface ClassroomSpeechRecognitionService {
  start(): Promise<void>;
  stop(): Promise<void>;
  cancel(): void;
  getFinalResult(): Promise<ClassroomSpeechRecognitionResult>;
}

type RecognitionEventListener = (event?: unknown) => void;

type RecognitionInstance = {
  abort?: () => void;
  addEventListener?: (name: string, listener: RecognitionEventListener) => void;
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxAlternatives?: number;
  start?: () => void;
  stop?: () => void;
};

type RecognitionConstructor = new () => RecognitionInstance;

type BrowserRecognitionGlobalScope = {
  SpeechRecognition?: RecognitionConstructor;
  webkitSpeechRecognition?: RecognitionConstructor;
};

type CreateBrowserSpeechRecognitionServiceOptions = {
  globalScope?: BrowserRecognitionGlobalScope | null;
  timeoutMs?: number;
};

function createDeferredResult() {
  let resolve!: (value: ClassroomSpeechRecognitionResult) => void;

  return {
    promise: new Promise<ClassroomSpeechRecognitionResult>((nextResolve) => {
      resolve = nextResolve;
    }),
    resolve,
  };
}

export function createBrowserSpeechRecognitionService({
  globalScope = typeof window === 'undefined' ? null : (window as BrowserRecognitionGlobalScope),
  timeoutMs = 3500,
}: CreateBrowserSpeechRecognitionServiceOptions = {}): ClassroomSpeechRecognitionService {
  let deferred = createDeferredResult();
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  let recognition: RecognitionInstance | null = null;
  let settled = false;

  const RecognitionCtor =
    globalScope?.SpeechRecognition ?? globalScope?.webkitSpeechRecognition ?? null;

  const clearTimeoutHandle = () => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }
  };

  const settle = (result: ClassroomSpeechRecognitionResult) => {
    if (settled) {
      return;
    }

    settled = true;
    clearTimeoutHandle();
    deferred.resolve(result);
  };

  const resetDeferred = () => {
    clearTimeoutHandle();
    deferred = createDeferredResult();
    settled = false;
  };

  const bindRecognitionListeners = (instance: RecognitionInstance) => {
    instance.addEventListener?.('result', (event?: unknown) => {
      const transcript = readTranscriptFromResultEvent(event);

      if (!transcript.transcript) {
        settle({
          transcript: null,
          reason: 'empty',
        });
        return;
      }

      settle(transcript);
    });

    instance.addEventListener?.('error', () => {
      settle({
        transcript: null,
        reason: 'error',
      });
    });
  };

  return {
    async getFinalResult() {
      if (!RecognitionCtor) {
        return {
          transcript: null,
          reason: 'unavailable',
        };
      }

      return deferred.promise;
    },
    cancel() {
      clearTimeoutHandle();
      recognition?.abort?.();
      settle({
        transcript: null,
        reason: 'error',
      });
    },
    async start() {
      resetDeferred();

      if (!RecognitionCtor) {
        settle({
          transcript: null,
          reason: 'unavailable',
        });
        return;
      }

      recognition = new RecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      bindRecognitionListeners(recognition);
      recognition.start?.();
    },
    async stop() {
      if (!RecognitionCtor) {
        settle({
          transcript: null,
          reason: 'unavailable',
        });
        return;
      }

      recognition?.stop?.();
      timeoutHandle = setTimeout(() => {
        settle({
          transcript: null,
          reason: 'timeout',
        });
      }, timeoutMs);
    },
  };
}

function readTranscriptFromResultEvent(
  event: unknown,
): ClassroomSpeechRecognitionResult {
  const results = (event as { results?: unknown[] } | undefined)?.results;
  const firstResult = Array.isArray(results) ? results[0] : null;
  const firstAlternative = Array.isArray(firstResult)
    ? firstResult[0]
    : (firstResult as { 0?: { confidence?: number; transcript?: string } } | null)?.[0];
  const transcript =
    typeof firstAlternative?.transcript === 'string'
      ? firstAlternative.transcript.trim()
      : '';

  if (!transcript) {
    return {
      transcript: null,
      reason: 'empty',
    };
  }

  return {
    confidence:
      typeof firstAlternative?.confidence === 'number'
        ? firstAlternative.confidence
        : null,
    transcript,
  };
}
