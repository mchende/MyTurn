import type { Lesson } from './lesson-schema';
import { lessonSchema } from './lesson-schema';
import { lessonWeek01Lesson01 } from '../../../content/lessons/week-01/lesson-01';

const lessonSeedMap: Record<string, unknown> = {
  [lessonWeek01Lesson01.lessonId]: lessonWeek01Lesson01,
};

export function loadLesson(lessonId: string): Lesson {
  const lesson = lessonSeedMap[lessonId];

  if (!lesson) {
    throw new Error(`Unknown lesson config: ${lessonId}`);
  }

  return lessonSchema.parse(lesson);
}
