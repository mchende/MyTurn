import { describe, expect, it } from 'vitest';

import { lessonWeek01Lesson01 } from '../../content/lessons/week-01/lesson-01';
import { defaultWeekdayScheduleTemplate } from '../../content/schedules/default-weekday';
import { loadLesson } from '@/features/lesson-config/load-lesson';
import { lessonSchema } from '@/features/lesson-config/lesson-schema';
import { buildDaySessions } from '@/features/schedule/build-day-sessions';
import { scheduleTemplateSchema } from '@/features/schedule/schedule-schema';
import { getSessionAccessState } from '@/lib/time/session-access-state';

describe('lesson schema contracts', () => {
  it('accepts exactly five target items and fixed classroom stages', () => {
    const lesson = lessonSchema.parse({
      weekKey: 'week-01',
      lessonId: 'week-01-lesson-01',
      title: 'Week 1 · Everyday Nouns',
      items: [
        {
          id: 'apple',
          text: 'apple',
          imageSrc: '/lessons/week-01/apple.svg',
          imageAlt: 'A red apple.',
          imageWidth: 512,
          imageHeight: 512,
        },
        {
          id: 'banana',
          text: 'banana',
          imageSrc: '/lessons/week-01/banana.svg',
          imageAlt: 'A yellow banana.',
          imageWidth: 512,
          imageHeight: 512,
        },
        {
          id: 'cat',
          text: 'cat',
          imageSrc: '/lessons/week-01/cat.svg',
          imageAlt: 'A smiling cat.',
          imageWidth: 512,
          imageHeight: 512,
        },
        {
          id: 'dog',
          text: 'dog',
          imageSrc: '/lessons/week-01/dog.svg',
          imageAlt: 'A playful dog.',
          imageWidth: 512,
          imageHeight: 512,
        },
        {
          id: 'sun',
          text: 'sun',
          imageSrc: '/lessons/week-01/sun.svg',
          imageAlt: 'A bright sun.',
          imageWidth: 512,
          imageHeight: 512,
        },
      ],
      stages: [
        { id: 'warmup', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
        {
          id: 'repeat-after-teacher',
          itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'],
        },
        { id: 'picture-talk', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
        { id: 'wrap-up', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
      ],
    });

    expect(lesson.items).toHaveLength(5);
    expect(lesson.stages.map((stage) => stage.id)).toEqual([
      'warmup',
      'repeat-after-teacher',
      'picture-talk',
      'wrap-up',
    ]);
  });

  it('requires imageSrc and imageAlt for every lesson item', () => {
    expect(() =>
      lessonSchema.parse({
        weekKey: 'week-01',
        lessonId: 'week-01-lesson-01',
        title: 'Week 1 · Everyday Nouns',
        items: [
          {
            id: 'apple',
            text: 'apple',
            imageSrc: '/lessons/week-01/apple.svg',
            imageWidth: 512,
            imageHeight: 512,
          },
          {
            id: 'banana',
            text: 'banana',
            imageSrc: '/lessons/week-01/banana.svg',
            imageAlt: 'A yellow banana.',
            imageWidth: 512,
            imageHeight: 512,
          },
          {
            id: 'cat',
            text: 'cat',
            imageSrc: '/lessons/week-01/cat.svg',
            imageAlt: 'A smiling cat.',
            imageWidth: 512,
            imageHeight: 512,
          },
          {
            id: 'dog',
            text: 'dog',
            imageSrc: '/lessons/week-01/dog.svg',
            imageAlt: 'A playful dog.',
            imageWidth: 512,
            imageHeight: 512,
          },
          {
            id: 'sun',
            text: 'sun',
            imageSrc: '/lessons/week-01/sun.svg',
            imageAlt: 'A bright sun.',
            imageWidth: 512,
            imageHeight: 512,
          },
        ],
        stages: [
          { id: 'warmup', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
          {
            id: 'repeat-after-teacher',
            itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'],
          },
          { id: 'picture-talk', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
          { id: 'wrap-up', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
        ],
      }),
    ).toThrow();
  });

  it('accepts optional repeatAccepts and pictureTalk metadata without requiring all legacy lessons to provide them', () => {
    const lesson = lessonSchema.parse({
      weekKey: 'week-01',
      lessonId: 'week-01-lesson-judgment',
      title: 'Week 1 · Judgment Metadata',
      items: [
        {
          id: 'apple',
          text: 'apple',
          imageSrc: '/lessons/week-01/apple.svg',
          imageAlt: 'A red apple.',
          imageWidth: 512,
          imageHeight: 512,
          repeatAccepts: ['apple', 'an apple'],
          pictureTalk: {
            observeHint: 'Look at the fruit.',
            narrowedQuestion: 'Is it an apple or a banana?',
            semanticAccepts: ['apple', 'an apple', 'red apple'],
            fallbackModel: 'It is an apple.',
          },
        },
        {
          id: 'banana',
          text: 'banana',
          imageSrc: '/lessons/week-01/banana.svg',
          imageAlt: 'A yellow banana.',
          imageWidth: 512,
          imageHeight: 512,
        },
        {
          id: 'cat',
          text: 'cat',
          imageSrc: '/lessons/week-01/cat.svg',
          imageAlt: 'A smiling cat.',
          imageWidth: 512,
          imageHeight: 512,
        },
        {
          id: 'dog',
          text: 'dog',
          imageSrc: '/lessons/week-01/dog.svg',
          imageAlt: 'A playful dog.',
          imageWidth: 512,
          imageHeight: 512,
        },
        {
          id: 'sun',
          text: 'sun',
          imageSrc: '/lessons/week-01/sun.svg',
          imageAlt: 'A bright sun.',
          imageWidth: 512,
          imageHeight: 512,
        },
      ],
      stages: [
        { id: 'warmup', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
        {
          id: 'repeat-after-teacher',
          itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'],
        },
        { id: 'picture-talk', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
        { id: 'wrap-up', itemIds: ['apple', 'banana', 'cat', 'dog', 'sun'] },
      ],
    });

    expect(lesson.items[0]).toMatchObject({
      repeatAccepts: ['apple', 'an apple'],
      pictureTalk: {
        observeHint: 'Look at the fruit.',
        narrowedQuestion: 'Is it an apple or a banana?',
        semanticAccepts: ['apple', 'an apple', 'red apple'],
        fallbackModel: 'It is an apple.',
      },
    });
    expect(lesson.items[1]).not.toHaveProperty('repeatAccepts');
    expect(lesson.items[1]).not.toHaveProperty('pictureTalk');
  });

  it('builds session view models from a parsed schedule template', () => {
    const template = scheduleTemplateSchema.parse({
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
      ],
    });

    const sessions = buildDaySessions({
      template,
      date: new Date(2026, 3, 15),
      now: new Date(2026, 3, 15, 13, 57),
    });

    expect(sessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sessionId: 'weekday-1400',
          lessonId: 'week-01-lesson-01',
          accessState: 'open_for_entry',
          entryOpensAt: expect.any(Date),
          startsAt: expect.any(Date),
          endsAt: expect.any(Date),
          durationMinutes: 15,
        }),
      ]),
    );
  });

  it('computes upcoming, open_for_entry, in_progress_locked, and completed access states', () => {
    const startTime = new Date('2026-04-15T10:00:00.000Z');
    const baseInput = {
      startTime,
      durationMinutes: 15,
      entryOpensMinutesBeforeStart: 5,
    };

    expect(
      getSessionAccessState({
        now: new Date('2026-04-15T09:54:00.000Z'),
        ...baseInput,
      }),
    ).toBe('upcoming');

    expect(
      getSessionAccessState({
        now: new Date('2026-04-15T09:56:00.000Z'),
        ...baseInput,
      }),
    ).toBe('open_for_entry');

    expect(
      getSessionAccessState({
        now: new Date('2026-04-15T10:01:00.000Z'),
        ...baseInput,
      }),
    ).toBe('in_progress_locked');

    expect(
      getSessionAccessState({
        now: new Date('2026-04-15T10:16:00.000Z'),
        ...baseInput,
      }),
    ).toBe('completed');
  });

  it('loads the seeded week 01 lesson package with local image assets', () => {
    const lesson = loadLesson('week-01-lesson-01');

    expect(lesson).toEqual(lessonWeek01Lesson01);
    expect(lesson.items.map((item) => item.id)).toEqual([
      'apple',
      'banana',
      'cat',
      'dog',
      'sun',
    ]);
    expect(
      lesson.items.every((item) => {
        return (
          item.imageSrc.startsWith('/lessons/week-01/') &&
          item.imageSrc.endsWith('.svg') &&
          item.imageAlt.trim().length > 0
        );
      }),
    ).toBe(true);
    expect(
      lesson.items.map((item) => ({
        id: item.id,
        repeatAccepts: item.repeatAccepts,
        observeHint: item.pictureTalk?.observeHint,
        narrowedQuestion: item.pictureTalk?.narrowedQuestion,
        semanticAccepts: item.pictureTalk?.semanticAccepts,
        fallbackModel: item.pictureTalk?.fallbackModel,
      })),
    ).toEqual([
      {
        id: 'apple',
        repeatAccepts: expect.arrayContaining(['apple']),
        observeHint: expect.any(String),
        narrowedQuestion: expect.any(String),
        semanticAccepts: expect.arrayContaining(['apple', 'an apple', 'red apple']),
        fallbackModel: expect.any(String),
      },
      {
        id: 'banana',
        repeatAccepts: expect.arrayContaining(['banana']),
        observeHint: expect.any(String),
        narrowedQuestion: expect.any(String),
        semanticAccepts: expect.arrayContaining(['banana']),
        fallbackModel: expect.any(String),
      },
      {
        id: 'cat',
        repeatAccepts: expect.arrayContaining(['cat']),
        observeHint: expect.any(String),
        narrowedQuestion: expect.any(String),
        semanticAccepts: expect.arrayContaining(['cat']),
        fallbackModel: expect.any(String),
      },
      {
        id: 'dog',
        repeatAccepts: expect.arrayContaining(['dog']),
        observeHint: expect.any(String),
        narrowedQuestion: expect.any(String),
        semanticAccepts: expect.arrayContaining(['dog']),
        fallbackModel: expect.any(String),
      },
      {
        id: 'sun',
        repeatAccepts: expect.arrayContaining(['sun']),
        observeHint: expect.any(String),
        narrowedQuestion: expect.any(String),
        semanticAccepts: expect.arrayContaining(['sun']),
        fallbackModel: expect.any(String),
      },
    ]);
  });

  it('parses the default weekday schedule seed for 15-minute sessions', () => {
    expect(defaultWeekdayScheduleTemplate.slots).toHaveLength(3);
    expect(
      defaultWeekdayScheduleTemplate.slots.map((slot) => ({
        sessionId: slot.sessionId,
        durationMinutes: slot.durationMinutes,
        entryOpensMinutesBeforeStart: slot.entryOpensMinutesBeforeStart,
      })),
    ).toEqual([
      {
        sessionId: 'weekday-1600',
        durationMinutes: 15,
        entryOpensMinutesBeforeStart: 5,
      },
      {
        sessionId: 'weekday-1700',
        durationMinutes: 15,
        entryOpensMinutesBeforeStart: 5,
      },
      {
        sessionId: 'weekday-1800',
        durationMinutes: 15,
        entryOpensMinutesBeforeStart: 5,
      },
    ]);
  });
});
