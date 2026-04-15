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
        sessionId: 'weekday-1000',
        durationMinutes: 15,
        entryOpensMinutesBeforeStart: 5,
      },
      {
        sessionId: 'weekday-1400',
        durationMinutes: 15,
        entryOpensMinutesBeforeStart: 5,
      },
      {
        sessionId: 'weekday-1930',
        durationMinutes: 15,
        entryOpensMinutesBeforeStart: 5,
      },
    ]);
  });
});
