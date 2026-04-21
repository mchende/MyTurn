import { z } from 'zod';

const lessonItemPictureTalkSchema = z.object({
  observeHint: z.string().min(1),
  narrowedQuestion: z.string().min(1),
  semanticAccepts: z.array(z.string().min(1)).min(1),
  fallbackModel: z.string().min(1),
});

export const lessonItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  imageSrc: z.string().min(1),
  imageAlt: z.string().min(1),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  repeatAccepts: z.array(z.string().min(1)).min(1).optional(),
  pictureTalk: lessonItemPictureTalkSchema.optional(),
});

export const lessonStageSchema = z.object({
  id: z.enum(['warmup', 'repeat-after-teacher', 'picture-talk', 'wrap-up']),
  itemIds: z.array(z.string().min(1)).min(1),
});

export const lessonSchema = z.object({
  weekKey: z.string().min(1),
  lessonId: z.string().min(1),
  title: z.string().min(1),
  items: z.array(lessonItemSchema).length(5),
  stages: z.array(lessonStageSchema).min(1),
});

export type LessonItem = z.infer<typeof lessonItemSchema>;
export type LessonStage = z.infer<typeof lessonStageSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
