import { scheduleTemplateSchema } from '@/features/schedule/schedule-schema';

export const defaultWeekdayScheduleTemplate = scheduleTemplateSchema.parse({
  templateId: 'default-weekday',
  slots: [
    {
      sessionId: 'weekday-1000',
      startTime: '10:00',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-1400',
      startTime: '14:00',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-1930',
      startTime: '19:30',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
  ],
});
