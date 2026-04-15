import type { ScheduleTemplate } from './schedule-schema';
import { getSessionAccessState, type SessionAccessState } from '@/lib/time/session-access-state';

export type DaySession = {
  sessionId: string;
  lessonId: string;
  startsAt: Date;
  endsAt: Date;
  durationMinutes: number;
  entryOpensAt: Date;
  accessState: SessionAccessState;
};

type BuildDaySessionsInput = {
  template: ScheduleTemplate;
  date: Date;
  now: Date;
};

export function buildDaySessions({
  template,
  date,
  now,
}: BuildDaySessionsInput): DaySession[] {
  return template.slots.map((slot) => {
    const startsAt = createDateForTime(date, slot.startTime);
    const endsAt = new Date(startsAt.getTime() + slot.durationMinutes * 60_000);
    const entryOpensAt = new Date(
      startsAt.getTime() - slot.entryOpensMinutesBeforeStart * 60_000,
    );

    return {
      sessionId: slot.sessionId,
      lessonId: slot.lessonId,
      startsAt,
      endsAt,
      durationMinutes: slot.durationMinutes,
      entryOpensAt,
      accessState: getSessionAccessState({
        now,
        startTime: startsAt,
        durationMinutes: slot.durationMinutes,
        entryOpensMinutesBeforeStart: slot.entryOpensMinutesBeforeStart,
      }),
    };
  });
}

function createDateForTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const sessionDate = new Date(date);
  sessionDate.setHours(hours, minutes, 0, 0);
  return sessionDate;
}
