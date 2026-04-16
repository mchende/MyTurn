import { scheduleTemplateSchema } from '@/features/schedule/schedule-schema';

export const defaultWeekdayScheduleTemplate = scheduleTemplateSchema.parse({
  templateId: 'default-weekday',
  slots: [
    {
      sessionId: 'weekday-1835',
      startTime: '18:35',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-1900',
      startTime: '19:00',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-1935',
      startTime: '19:35',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-2000',
      startTime: '20:00',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-2035',
      startTime: '20:35',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-2105',
      startTime: '21:05',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
  ],
});
