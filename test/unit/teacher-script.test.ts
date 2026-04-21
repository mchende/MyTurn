import { describe, expect, it } from 'vitest';

import {
  getTeacherHint,
  getTeacherScriptLine,
} from '@/features/classroom-shell/teacher-script';

describe('teacher-script', () => {
  const targetText = 'lion';

  it('keeps child-facing captions safe while allowing a spoken model in repeat-after-teacher', () => {
    const line = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 0,
      participationState: 'idle',
      phase: 'teacher_prompt',
      stageId: 'repeat-after-teacher',
      targetText,
    });

    expect(line.visibleCaption).toMatch(/[A-Za-z]/);
    expect(line.visibleCaption).not.toMatch(/lion/i);
    expect(line.hintLabel).not.toMatch(/lion/i);
    expect(line.spokenModel).toMatch(/lion/i);
    expect(line.debugTargetText).toBe('LION');
  });

  it('uses a co-speak line for repeat teacher_encourage without leaking the target into child-facing copy', () => {
    const line = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 0,
      participationState: 'silent',
      phase: 'teacher_encourage',
      stageId: 'repeat-after-teacher',
      targetText,
    });

    expect(line.visibleCaption).toBe('Say it with me. Nice and slow.');
    expect(line.visibleCaption).not.toMatch(/lion/i);
    expect(line.hintLabel).not.toMatch(/lion/i);
    expect(line.spokenModel).toMatch(/say it with me/i);
    expect(line.spokenModel).toMatch(/lion/i);
  });

  it('uses an observe hint first and then a narrowed re-ask for picture-talk without leaking the answer', () => {
    const firstAttempt = getTeacherScriptLine({
      currentItemIndex: 1,
      attemptIndex: 0,
      participationState: 'idle',
      phase: 'teacher_prompt',
      stageId: 'picture-talk',
      targetText,
    });
    const observeHint = getTeacherScriptLine({
      currentItemIndex: 1,
      attemptIndex: 0,
      participationState: 'silent',
      phase: 'teacher_encourage',
      stageId: 'picture-talk',
      targetText,
    });
    const narrowedRetry = getTeacherScriptLine({
      currentItemIndex: 1,
      attemptIndex: 1,
      participationState: 'waiting',
      phase: 'student_wait',
      stageId: 'picture-talk',
      targetText,
    });

    expect(firstAttempt.spokenModel).toMatch(/\?$/);
    expect(firstAttempt.spokenModel).not.toMatch(/lion/i);
    expect(firstAttempt.spokenModel).not.toMatch(/first sound|starts with|in Chinese/i);
    expect(firstAttempt.visibleCaption).not.toMatch(/lion/i);

    expect(observeHint.visibleCaption).toBe('Look closely. What do you notice?');
    expect(observeHint.spokenModel).toBe('Look closely. What do you notice?');
    expect(observeHint.spokenModel).not.toMatch(/lion/i);
    expect(observeHint.spokenModel).not.toMatch(/first sound|starts with|in Chinese|it is|say/i);

    expect(narrowedRetry.visibleCaption).toBe('Look again and choose.');
    expect(narrowedRetry.spokenModel).toBe('Look again and choose. What do you see now?');
    expect(narrowedRetry.spokenModel).not.toMatch(/lion/i);
    expect(narrowedRetry.spokenModel).not.toMatch(/first sound|starts with|in Chinese|it is|say/i);
    expect(narrowedRetry.visibleCaption).not.toBe(firstAttempt.visibleCaption);
  });

  it('returns English hints for the stage-aware teacher flow', () => {
    const phases = [
      'teacher_prompt',
      'teacher_encourage',
      'teacher_feedback',
      'move_next',
    ] as const;

    phases.forEach((phase, index) => {
      const line = getTeacherScriptLine({
        currentItemIndex: index,
        attemptIndex: 0,
        participationState: 'idle',
        phase,
        stageId: 'picture-talk',
        targetText,
      });

      expect(line.visibleCaption).toMatch(/[A-Za-z]/);
      expect(line.hintLabel).toMatch(/[A-Za-z]/);
      expect(getTeacherHint(phase)).toMatch(/[A-Za-z]/);
    });
  });
});
