import { describe, expect, it } from 'vitest';

import { lessonWeek01Lesson01 } from '../../content/lessons/week-01/lesson-01';
import {
  buildCanonicalManualTranscript,
  judgeStudentAttempt,
  normalizeStudentTranscript,
} from '@/features/classroom-shell/classroom-judgment';

const appleItem = lessonWeek01Lesson01.items.find((item) => item.id === 'apple');

if (!appleItem) {
  throw new Error('Expected apple item in seeded lesson.');
}

describe('classroom judgment', () => {
  it('normalizes child transcripts before matching', () => {
    expect(normalizeStudentTranscript('  Apple!!  ')).toBe('apple');
    expect(normalizeStudentTranscript(null)).toBe('');
  });

  it('passes repeat attempts when transcript is lexically close to the accepted phrase', () => {
    expect(
      judgeStudentAttempt({
        lessonItem: appleItem,
        stageId: 'repeat-after-teacher',
        transcript: 'apple',
        attemptIndex: 0,
      }),
    ).toEqual({
      outcome: 'pass',
      normalizedTranscript: 'apple',
      matchedAgainst: 'apple',
    });

    expect(
      judgeStudentAttempt({
        lessonItem: appleItem,
        stageId: 'repeat-after-teacher',
        transcript: 'aple',
        attemptIndex: 0,
      }),
    ).toEqual({
      outcome: 'pass',
      normalizedTranscript: 'aple',
      matchedAgainst: 'apple',
    });
  });

  it('returns retry first and fallback second when repeat transcript is not close enough', () => {
    expect(
      judgeStudentAttempt({
        lessonItem: appleItem,
        stageId: 'repeat-after-teacher',
        transcript: 'banana',
        attemptIndex: 0,
      }),
    ).toEqual({
      outcome: 'retry',
      normalizedTranscript: 'banana',
      matchedAgainst: null,
    });

    expect(
      judgeStudentAttempt({
        lessonItem: appleItem,
        stageId: 'repeat-after-teacher',
        transcript: 'banana',
        attemptIndex: 1,
      }),
    ).toEqual({
      outcome: 'fallback',
      normalizedTranscript: 'banana',
      matchedAgainst: null,
    });
  });

  it('matches picture-talk only through lesson metadata semanticAccepts and escalates to fallback on the second miss', () => {
    expect(
      judgeStudentAttempt({
        lessonItem: appleItem,
        stageId: 'picture-talk',
        transcript: 'an apple',
        attemptIndex: 0,
      }),
    ).toEqual({
      outcome: 'pass',
      normalizedTranscript: 'an apple',
      matchedAgainst: 'an apple',
    });

    expect(
      judgeStudentAttempt({
        lessonItem: appleItem,
        stageId: 'picture-talk',
        transcript: 'red apple',
        attemptIndex: 0,
      }),
    ).toEqual({
      outcome: 'pass',
      normalizedTranscript: 'red apple',
      matchedAgainst: 'red apple',
    });

    expect(
      judgeStudentAttempt({
        lessonItem: appleItem,
        stageId: 'picture-talk',
        transcript: 'banana',
        attemptIndex: 0,
      }),
    ).toEqual({
      outcome: 'retry',
      normalizedTranscript: 'banana',
      matchedAgainst: null,
    });

    expect(
      judgeStudentAttempt({
        lessonItem: appleItem,
        stageId: 'picture-talk',
        transcript: 'banana',
        attemptIndex: 1,
      }),
    ).toEqual({
      outcome: 'fallback',
      normalizedTranscript: 'banana',
      matchedAgainst: null,
    });

    expect(
      buildCanonicalManualTranscript({
        currentItem: appleItem,
        stageId: 'picture-talk',
      }),
    ).toBe(appleItem.pictureTalk?.semanticAccepts[0]);
  });

  it('builds a canonical manual transcript from lesson content for compatibility submits', () => {
    expect(
      buildCanonicalManualTranscript({
        currentItem: appleItem,
        stageId: 'repeat-after-teacher',
      }),
    ).toBe('apple');

    expect(
      buildCanonicalManualTranscript({
        currentItem: appleItem,
        stageId: 'picture-talk',
      }),
    ).toBe('apple');
  });
});
