import type { BrowserContext, Page } from '@playwright/test';

export async function installFakeBrowserAudio(
  page: Page,
  context: BrowserContext,
) {
  await context.grantPermissions(['microphone']);

  await page.addInitScript(() => {
    class FakeSpeechSynthesisUtterance extends EventTarget {
      lang = 'en-US';
      pitch = 1;
      rate = 1;
      text: string;
      voice: SpeechSynthesisVoice | null = null;
      volume = 1;

      constructor(text: string) {
        super();
        this.text = text;
      }
    }

    class FakeMediaRecorder {
      static isTypeSupported(type: string) {
        return type === 'audio/webm;codecs=opus';
      }

      mimeType: string;
      state: 'inactive' | 'recording' = 'inactive';

      private listeners = new Map<string, Set<(event?: unknown) => void>>();

      constructor(
        _stream: MediaStream,
        options?: {
          mimeType?: string;
        },
      ) {
        this.mimeType = options?.mimeType ?? 'audio/webm;codecs=opus';
      }

      addEventListener(name: string, listener: (event?: unknown) => void) {
        if (!this.listeners.has(name)) {
          this.listeners.set(name, new Set());
        }

        this.listeners.get(name)?.add(listener);
      }

      start() {
        this.state = 'recording';
      }

      stop() {
        this.state = 'inactive';

        setTimeout(() => {
          const blob = new Blob(['voice'], { type: this.mimeType });

          this.listeners.get('dataavailable')?.forEach((listener) => {
            listener({ data: blob });
          });
          this.listeners.get('stop')?.forEach((listener) => {
            listener();
          });
        }, 0);
      }
    }

    const fakeSpeechSynthesis = {
      cancel() {},
      getVoices() {
        return [];
      },
      speak(utterance: EventTarget) {
        setTimeout(() => {
          utterance.dispatchEvent(new Event('end'));
        }, 0);
      },
    };

    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: FakeSpeechSynthesisUtterance,
    });
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: fakeSpeechSynthesis,
    });
    Object.defineProperty(window, 'MediaRecorder', {
      configurable: true,
      value: FakeMediaRecorder,
    });

    const originalMediaDevices = navigator.mediaDevices;

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        ...originalMediaDevices,
        getUserMedia: async () => new MediaStream(),
      },
    });

    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: {
        query: async () => ({
          name: 'microphone',
          onchange: null,
          state: 'granted',
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return true;
          },
        }),
      },
    });
  });
}
