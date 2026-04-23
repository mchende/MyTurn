export type ClassroomAudioSpeaker = 'teacher' | 'bobby';

export type ClassroomAudioCue = {
  cueKey: string;
  lang?: string;
  pitch?: number;
  rate?: number;
  speaker: ClassroomAudioSpeaker;
  text: string;
  voiceName?: string | null;
  volume?: number;
};

export interface ClassroomAudioService {
  playCue(cue: ClassroomAudioCue): Promise<void>;
  stop?(): void;
}

type SpeechSynthesisLike = Pick<
  SpeechSynthesis,
  'cancel' | 'getVoices' | 'speak'
>;

type SpeechSynthesisUtteranceCtor = typeof SpeechSynthesisUtterance;

const FALLBACK_RECORDING_MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
] as const;

export function playScriptedAudio(
  audioService: ClassroomAudioService,
  cue: ClassroomAudioCue,
) {
  return audioService.playCue(cue);
}

export function resolveRecordingMimeType(
  MediaRecorderCtor: Pick<typeof MediaRecorder, 'isTypeSupported'> | null | undefined,
) {
  if (!MediaRecorderCtor?.isTypeSupported) {
    return FALLBACK_RECORDING_MIME_TYPES[0];
  }

  return (
    FALLBACK_RECORDING_MIME_TYPES.find((candidate) =>
      MediaRecorderCtor.isTypeSupported(candidate),
    ) ?? FALLBACK_RECORDING_MIME_TYPES[0]
  );
}

export function createSpeechSynthesisAudioService({
  synth = globalThis.speechSynthesis,
  SpeechSynthesisUtteranceCtor = globalThis.SpeechSynthesisUtterance,
}: {
  synth?: SpeechSynthesisLike | null;
  SpeechSynthesisUtteranceCtor?: SpeechSynthesisUtteranceCtor | null;
} = {}): ClassroomAudioService {
  return {
    playCue(cue) {
      if (!synth || !SpeechSynthesisUtteranceCtor) {
        return Promise.reject(new Error('Speech synthesis is unavailable.'));
      }

      return new Promise<void>((resolve, reject) => {
        const utterance = new SpeechSynthesisUtteranceCtor(cue.text);
        const voices = synth.getVoices();
        const matchedVoice =
          cue.voiceName == null
            ? null
            : voices.find((voice) => voice.name === cue.voiceName) ?? null;

        utterance.lang = cue.lang ?? 'en-US';
        utterance.pitch = cue.pitch ?? (cue.speaker === 'bobby' ? 1.2 : 1);
        utterance.rate = cue.rate ?? (cue.speaker === 'bobby' ? 0.95 : 0.92);
        utterance.volume = cue.volume ?? 1;

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.addEventListener('end', () => resolve(), { once: true });
        utterance.addEventListener(
          'error',
          (event) => {
            const message =
              event instanceof SpeechSynthesisErrorEvent
                ? event.error
                : 'Speech synthesis playback failed.';
            reject(new Error(message));
          },
          { once: true },
        );

        synth.cancel();
        synth.speak(utterance);
      });
    },
    stop() {
      synth?.cancel();
    },
  };
}
