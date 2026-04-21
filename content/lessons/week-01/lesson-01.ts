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
      repeatAccepts: ['apple', 'an apple'],
      pictureTalk: {
        observeHint: 'Look at the fruit. What do you see?',
        narrowedQuestion: 'Is it an apple or a banana?',
        semanticAccepts: ['apple', 'an apple', 'red apple'],
        fallbackModel: 'It is an apple.',
      },
    },
    {
      id: 'banana',
      text: 'banana',
      imageSrc: '/lessons/week-01/banana.svg',
      imageAlt: 'A yellow banana with a curved shape.',
      imageWidth: 512,
      imageHeight: 512,
      repeatAccepts: ['banana', 'a banana'],
      pictureTalk: {
        observeHint: 'Look at the long yellow fruit. What is it?',
        narrowedQuestion: 'Is it a banana or an apple?',
        semanticAccepts: ['banana', 'a banana', 'yellow banana'],
        fallbackModel: 'It is a banana.',
      },
    },
    {
      id: 'cat',
      text: 'cat',
      imageSrc: '/lessons/week-01/cat.svg',
      imageAlt: 'A smiling orange cat sitting upright.',
      imageWidth: 512,
      imageHeight: 512,
      repeatAccepts: ['cat', 'a cat'],
      pictureTalk: {
        observeHint: 'Look at the animal. What do you see?',
        narrowedQuestion: 'Is it a cat or a dog?',
        semanticAccepts: ['cat', 'a cat', 'orange cat'],
        fallbackModel: 'It is a cat.',
      },
    },
    {
      id: 'dog',
      text: 'dog',
      imageSrc: '/lessons/week-01/dog.svg',
      imageAlt: 'A happy brown dog wagging its tail.',
      imageWidth: 512,
      imageHeight: 512,
      repeatAccepts: ['dog', 'a dog'],
      pictureTalk: {
        observeHint: 'Look at the pet. What is it?',
        narrowedQuestion: 'Is it a dog or a cat?',
        semanticAccepts: ['dog', 'a dog', 'brown dog'],
        fallbackModel: 'It is a dog.',
      },
    },
    {
      id: 'sun',
      text: 'sun',
      imageSrc: '/lessons/week-01/sun.svg',
      imageAlt: 'A bright yellow sun with long rays.',
      imageWidth: 512,
      imageHeight: 512,
      repeatAccepts: ['sun', 'the sun'],
      pictureTalk: {
        observeHint: 'Look up in the sky. What do you see?',
        narrowedQuestion: 'Is it the sun or the moon?',
        semanticAccepts: ['sun', 'the sun', 'yellow sun'],
        fallbackModel: 'It is the sun.',
      },
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
