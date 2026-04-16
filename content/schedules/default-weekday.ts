import { scheduleTemplateSchema } from '@/features/schedule/schedule-schema';

export const defaultWeekdayScheduleTemplate = scheduleTemplateSchema.parse({
  templateId: 'default-weekday',
  slots: [
    {
      sessionId: 'weekday-1600',
      startTime: '16:00',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-1700',
      startTime: '17:00',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
    {
      sessionId: 'weekday-1800',
      startTime: '18:00',
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
      lessonId: 'week-01-lesson-01',
    },
  ],
});
