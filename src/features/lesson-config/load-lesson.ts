import type { Lesson } from './lesson-schema';
import { lessonSchema } from './lesson-schema';

const lessonSeedMap: Record<string, unknown> = {};

export function loadLesson(lessonId: string): Lesson {
  const lesson = lessonSeedMap[lessonId];

  if (!lesson) {
    throw new Error(`Unknown lesson config: ${lessonId}`);
  }

  return lessonSchema.parse(lesson);
}
