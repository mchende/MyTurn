import { describe, expect, it } from 'vitest';

import {
  getTeacherHint,
  getTeacherScriptLine,
} from '@/features/classroom-shell/teacher-script';

describe('teacher-script', () => {
  const targetText = 'lion';

  it('returns English classroom lines across teacher-led phases', () => {
    const phases = [
      'teacher_prompt',
      'teacher_encourage',
      'teacher_echo',
      'teacher_feedback',
      'move_next',
    ] as const;

    const lines = phases.map((phase, index) =>
      getTeacherScriptLine({
        currentItemIndex: index,
        phase,
        targetText,
      }),
    );

    expect(lines.map((line) => line.spokenLine)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Let's say it together"),
        expect.stringContaining('Good job'),
        expect.stringContaining('Next one'),
      ]),
    );

    lines.forEach((line, index) => {
      expect(line.spokenLine).toMatch(/[A-Za-z]/);
      expect(line.hintLabel).toMatch(/[A-Za-z]/);
      expect(getTeacherHint(phases[index])).toMatch(/[A-Za-z]/);
    });
  });

  it('keeps target text out of child-facing copy and only exposes it in debug metadata', () => {
    const line = getTeacherScriptLine({
      currentItemIndex: 0,
      phase: 'teacher_prompt',
      targetText,
    });

    expect(line.spokenLine).not.toMatch(/lion/i);
    expect(line.hintLabel).not.toMatch(/lion/i);
    expect(getTeacherHint('teacher_prompt')).not.toMatch(/lion/i);
    expect(line.debugTargetText).toBe('LION');
  });
});
