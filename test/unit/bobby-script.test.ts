import { describe, expect, it } from 'vitest';

import {
  BOBBY_RESPONSE_ENVELOPE,
  getBobbyScriptLine,
} from '@/features/classroom-shell/bobby-script';

describe('bobby-script', () => {
  it('adds a mild hesitation envelope while keeping the demo line complete', () => {
    const line = getBobbyScriptLine({
      currentItemIndex: 0,
      phase: 'ai_model',
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

  it('does not let Bobby rescue student silence phases', () => {
    expect(
      getBobbyScriptLine({
        currentItemIndex: 0,
        phase: 'student_wait',
        targetText: 'apple',
      }),
    ).toBeNull();

    expect(
      getBobbyScriptLine({
        currentItemIndex: 0,
        phase: 'teacher_encourage',
        targetText: 'apple',
      }),
    ).toBeNull();

    expect(
      getBobbyScriptLine({
        currentItemIndex: 0,
        phase: 'teacher_echo',
        targetText: 'apple',
      }),
    ).toBeNull();
  });
});
