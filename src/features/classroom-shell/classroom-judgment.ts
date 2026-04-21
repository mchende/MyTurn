import { distance } from 'fastest-levenshtein';

import type { LessonItem } from '@/features/lesson-config/lesson-schema';

export type JudgmentStageId = 'repeat-after-teacher' | 'picture-talk';
export type JudgmentOutcome = 'pass' | 'retry' | 'fallback';

export type StudentAttemptJudgment = {
  outcome: JudgmentOutcome;
  normalizedTranscript: string;
  matchedAgainst: string | null;
};

export function normalizeStudentTranscript(text: string | null | undefined) {
  if (!text) {
    return '';
  }

  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildCanonicalManualTranscript(input: {
  currentItem: LessonItem;
  stageId: JudgmentStageId;
}) {
  if (input.stageId === 'picture-talk') {
    return input.currentItem.pictureTalk?.fallbackModel ?? input.currentItem.text;
  }

  return input.currentItem.repeatAccepts?.[0] ?? input.currentItem.text;
}

export function judgeStudentAttempt(input: {
  lessonItem: LessonItem;
  stageId: JudgmentStageId;
  transcript: string | null | undefined;
  attemptIndex: number;
}): StudentAttemptJudgment {
  const normalizedTranscript = normalizeStudentTranscript(input.transcript);

  if (input.stageId === 'picture-talk') {
    return judgePictureTalkAttempt({
      lessonItem: input.lessonItem,
      normalizedTranscript,
      attemptIndex: input.attemptIndex,
    });
  }

  return judgeRepeatAttempt({
    lessonItem: input.lessonItem,
    normalizedTranscript,
    attemptIndex: input.attemptIndex,
  });
}

function judgeRepeatAttempt(input: {
  lessonItem: LessonItem;
  normalizedTranscript: string;
  attemptIndex: number;
}): StudentAttemptJudgment {
  const repeatAccepts = input.lessonItem.repeatAccepts ?? [input.lessonItem.text];
  const normalizedAccepts = repeatAccepts.map((accept) => ({
    original: accept,
    normalized: normalizeStudentTranscript(accept),
  }));

  const closestMatch = normalizedAccepts.reduce<{
    matchedAgainst: string | null;
    bestDistance: number;
  }>(
    (best, accept) => {
      const currentDistance = distance(input.normalizedTranscript, accept.normalized);

      if (currentDistance < best.bestDistance) {
        return {
          matchedAgainst: accept.original,
          bestDistance: currentDistance,
        };
      }

      return best;
    },
    {
      matchedAgainst: null,
      bestDistance: Number.POSITIVE_INFINITY,
    },
  );

  const allowedDistance = getAllowedRepeatDistance(input.normalizedTranscript.length);

  if (
    input.normalizedTranscript.length > 0 &&
    closestMatch.matchedAgainst &&
    closestMatch.bestDistance <= allowedDistance
  ) {
    return {
      outcome: 'pass',
      normalizedTranscript: input.normalizedTranscript,
      matchedAgainst: closestMatch.matchedAgainst,
    };
  }

  return {
    outcome: input.attemptIndex >= 1 ? 'fallback' : 'retry',
    normalizedTranscript: input.normalizedTranscript,
    matchedAgainst: null,
  };
}

function judgePictureTalkAttempt(input: {
  lessonItem: LessonItem;
  normalizedTranscript: string;
  attemptIndex: number;
}): StudentAttemptJudgment {
  const semanticAccepts = input.lessonItem.pictureTalk?.semanticAccepts ?? [
    input.lessonItem.text,
  ];

  const matchedAgainst =
    semanticAccepts.find((accept) => {
      return normalizeStudentTranscript(accept) === input.normalizedTranscript;
    }) ?? null;

  if (matchedAgainst) {
    return {
      outcome: 'pass',
      normalizedTranscript: input.normalizedTranscript,
      matchedAgainst,
    };
  }

  return {
    outcome: input.attemptIndex >= 1 ? 'fallback' : 'retry',
    normalizedTranscript: input.normalizedTranscript,
    matchedAgainst: null,
  };
}

function getAllowedRepeatDistance(length: number) {
  if (length <= 4) {
    return 1;
  }

  if (length <= 8) {
    return 2;
  }

  return 3;
}
