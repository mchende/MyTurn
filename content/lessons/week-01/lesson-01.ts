import { lessonSchema } from '@/features/lesson-config/lesson-schema';

export const lessonWeek01Lesson01 = lessonSchema.parse({
  weekKey: 'week-01',
  lessonId: 'week-01-lesson-01',
  title: 'Week 1 · Everyday Nouns',
  items: [
    {
      id: 'apple',
      text: 'apple',
      imageSrc: '/lessons/week-01/apple.svg',
      imageAlt: 'A red apple with a green leaf.',
      imageWidth: 512,
      imageHeight: 512,
    },
    {
      id: 'banana',
      text: 'banana',
      imageSrc: '/lessons/week-01/banana.svg',
      imageAlt: 'A yellow banana with a curved shape.',
      imageWidth: 512,
      imageHeight: 512,
    },
    {
      id: 'cat',
      text: 'cat',
      imageSrc: '/lessons/week-01/cat.svg',
      imageAlt: 'A smiling orange cat sitting upright.',
      imageWidth: 512,
      imageHeight: 512,
    },
    {
      id: 'dog',
      text: 'dog',
      imageSrc: '/lessons/week-01/dog.svg',
      imageAlt: 'A happy brown dog wagging its tail.',
      imageWidth: 512,
      imageHeight: 512,
    },
    {
      id: 'sun',
      text: 'sun',
      imageSrc: '/lessons/week-01/sun.svg',
      imageAlt: 'A bright yellow sun with long rays.',
      imageWidth: 512,
      imageHeight: 512,
    },
  ],
  stages: [
    {
      id: 'warmup',
      itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'],
    },
    {
      id: 'repeat-after-teacher',
      itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'],
    },
    {
      id: 'picture-talk',
      itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'],
    },
    {
      id: 'wrap-up',
      itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'],
    },
  ],
});
