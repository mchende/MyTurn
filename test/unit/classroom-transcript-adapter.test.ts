import { describe, expect, it } from 'vitest';

import {
  adaptRecognizedTranscript,
  buildRecognitionAttemptPayload,
} from '@/features/classroom-shell/classroom-transcript-adapter';

describe('classroom transcript adapter', () => {
  it('keeps core words while removing bounded filler and repeated starts', () => {
    expect(adaptRecognizedTranscript('Um, I I see an APPLE.')).toBe('i see an apple');
    expect(adaptRecognizedTranscript('uh it it is yellow')).toBe('it is yellow');
    expect(adaptRecognizedTranscript('hmm a a banana ah')).toBe('a banana');
    expect(adaptRecognizedTranscript('er the the apple')).toBe('the apple');
  });

  it('does not rewrite wrong answers into correct answers', () => {
    expect(adaptRecognizedTranscript('banana')).toBe('banana');
    expect(adaptRecognizedTranscript('uh banana')).not.toBe('apple');
    expect(adaptRecognizedTranscript('red banana')).not.toBe('red apple');
  });

  it('does not fabricate an answer from empty recognition text', () => {
    expect(adaptRecognizedTranscript('um uh hmm ah er')).toBe('');
    expect(adaptRecognizedTranscript(null)).toBe('');
    expect(adaptRecognizedTranscript(undefined)).toBe('');
  });

  it('builds the future ASR attempt payload with raw and cleaned transcript', () => {
    expect(buildRecognitionAttemptPayload('Um, I I see APPLE.')).toEqual({
      cleanedTranscript: 'i see apple',
      rawTranscript: 'Um, I I see APPLE.',
      source: 'future_asr',
    });
  });
});
