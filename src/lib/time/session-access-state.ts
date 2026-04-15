export type SessionAccessState =
  | 'upcoming'
  | 'open_for_entry'
  | 'in_progress_locked'
  | 'completed';

type GetSessionAccessStateInput = {
  now: Date;
  startTime: Date;
  durationMinutes: number;
  entryOpensMinutesBeforeStart: number;
};

export function getSessionAccessState({
  now,
  startTime,
  durationMinutes,
  entryOpensMinutesBeforeStart,
}: GetSessionAccessStateInput): SessionAccessState {
  const startMs = startTime.getTime();
  const nowMs = now.getTime();
  const entryOpensMs = startMs - entryOpensMinutesBeforeStart * 60_000;
  const endsAtMs = startMs + durationMinutes * 60_000;

  if (nowMs < entryOpensMs) {
    return 'upcoming';
  }

  if (nowMs < startMs) {
    return 'open_for_entry';
  }

  if (nowMs < endsAtMs) {
    return 'in_progress_locked';
  }

  return 'completed';
}
