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

  it('uses direct picture-talk questions and a light second prompt without leaking the answer', () => {
    const firstAttempt = getTeacherScriptLine({
      currentItemIndex: 1,
      attemptIndex: 0,
      participationState: 'idle',
      phase: 'teacher_prompt',
      stageId: 'picture-talk',
      targetText,
    });
    const secondAttempt = getTeacherScriptLine({
      currentItemIndex: 1,
      attemptIndex: 1,
      participationState: 'silent',
      phase: 'teacher_encourage',
      stageId: 'picture-talk',
      targetText,
    });

    expect(firstAttempt.spokenModel).toMatch(/\?$/);
    expect(firstAttempt.spokenModel).not.toMatch(/lion/i);
    expect(firstAttempt.spokenModel).not.toMatch(/first sound|starts with|in Chinese/i);
    expect(firstAttempt.visibleCaption).not.toMatch(/lion/i);

    expect(secondAttempt.spokenModel).toMatch(/[A-Za-z]/);
    expect(secondAttempt.spokenModel).not.toMatch(/lion/i);
    expect(secondAttempt.spokenModel).not.toMatch(/first sound|starts with|in Chinese/i);
    expect(secondAttempt.visibleCaption).not.toMatch(/lion/i);
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
