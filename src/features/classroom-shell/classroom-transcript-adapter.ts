import { normalizeStudentTranscript } from './classroom-judgment';

const FILLER_TOKENS = new Set(['um', 'uh', 'hmm', 'ah', 'er']);
const REPEATED_START_TOKENS = new Set(['i', 'it', 'a', 'the']);

export type RecognitionAttemptPayload = {
  cleanedTranscript: string;
  rawTranscript: string;
  source: 'future_asr';
};

export function adaptRecognizedTranscript(
  transcript: string | null | undefined,
) {
  const normalized = normalizeStudentTranscript(transcript);

  if (!normalized) {
    return '';
  }

  const filteredTokens = normalized
    .split(' ')
    .filter((token) => token.length > 0 && !FILLER_TOKENS.has(token));

  while (
    filteredTokens.length >= 2 &&
    filteredTokens[0] === filteredTokens[1] &&
    REPEATED_START_TOKENS.has(filteredTokens[0])
  ) {
    filteredTokens.shift();
  }

  return filteredTokens.join(' ');
}

export function buildRecognitionAttemptPayload(
  transcript: string | null | undefined,
): RecognitionAttemptPayload {
  return {
    cleanedTranscript: adaptRecognizedTranscript(transcript),
    rawTranscript: transcript ?? '',
    source: 'future_asr',
  };
}
