import { z } from 'zod';

export const timeSlotTemplateSchema = z.object({
  sessionId: z.string().min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  durationMinutes: z.number().int().positive(),
  entryOpensMinutesBeforeStart: z.number().int().nonnegative(),
  lessonId: z.string().min(1),
});

export const scheduleTemplateSchema = z.object({
  templateId: z.string().min(1),
  slots: z.array(timeSlotTemplateSchema).min(1),
});

export type TimeSlotTemplate = z.infer<typeof timeSlotTemplateSchema>;
export type ScheduleTemplate = z.infer<typeof scheduleTemplateSchema>;
