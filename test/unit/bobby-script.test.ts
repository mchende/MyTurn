import { describe, expect, it } from 'vitest';

import {
  BOBBY_RESPONSE_ENVELOPE,
  getBobbyScriptLine,
} from '@/features/classroom-shell/bobby-script';

describe('bobby-script', () => {
  it('adds a mild hesitation envelope only for repeat-after-teacher demo turns', () => {
    const line = getBobbyScriptLine({
      currentItemIndex: 0,
      phase: 'ai_model',
      stageId: 'repeat-after-teacher',
      targetText: 'apple',
    });

    expect(line).not.toBeNull();
    expect(BOBBY_RESPONSE_ENVELOPE).toMatchObject({
      hesitationToken: expect.any(String),
      hesitationBeatMs: expect.any(Number),
      leadInPauseMs: expect.any(Number),
    });

    expect(line?.spokenLine).toMatch(/apple/i);
    expect(line?.spokenLine).toMatch(/uh|um/i);
    expect(line?.hintLabel).toMatch(/Bobby/i);
    expect(line?.hesitationBeatMs).toBeGreaterThan(0);
  });

  it('keeps Bobby out of picture-talk and non-demo phases', () => {
    expect(
      getBobbyScriptLine({
        currentItemIndex: 0,
        phase: 'student_wait',
        stageId: 'repeat-after-teacher',
        targetText: 'apple',
      }),
    ).toBeNull();

    expect(
      getBobbyScriptLine({
        currentItemIndex: 0,
        phase: 'teacher_encourage',
        stageId: 'repeat-after-teacher',
        targetText: 'apple',
      }),
    ).toBeNull();

    expect(
      getBobbyScriptLine({
        currentItemIndex: 0,
        phase: 'ai_model',
        stageId: 'picture-talk',
        targetText: 'apple',
      }),
    ).toBeNull();

    expect(
      getBobbyScriptLine({
        currentItemIndex: 0,
        phase: 'teacher_echo',
        stageId: 'picture-talk',
        targetText: 'apple',
      }),
    ).toBeNull();
  });
});
