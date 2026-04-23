import { describe, expect, it } from 'vitest';

import { lessonWeek01Lesson01 } from '../../content/lessons/week-01/lesson-01';
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

  it('locks warmup, wrap-up, and lesson-complete copy to the closeout contract', () => {
    const warmupLine = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 0,
      participationState: 'idle',
      phase: 'warmup',
      stageId: 'repeat-after-teacher',
      targetText,
    });
    const wrapUpLine = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 0,
      participationState: 'idle',
      phase: 'wrap_up',
      stageId: 'picture-talk',
      targetText,
    });
    const completeLine = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 0,
      participationState: 'idle',
      phase: 'lesson_complete',
      stageId: 'picture-talk',
      targetText,
    });

    expect(warmupLine.hintLabel).toBe('Class hello');
    expect(warmupLine.visibleCaption).toBe('Hello, class. Cora is here.');
    expect(warmupLine.audioSpeaker).toBe('teacher');
    expect(warmupLine.audioCueKey).toBe('teacher:warmup:repeat-after-teacher:0:0');
    expect(wrapUpLine.hintLabel).toBe('Class closing');
    expect(wrapUpLine.visibleCaption).toBe('Great work today. Class is all done.');
    expect(wrapUpLine.audioSpeaker).toBe('teacher');
    expect(wrapUpLine.audioCueKey).toBe('teacher:wrap_up:picture-talk:0:0');
    expect(completeLine.hintLabel).toBe('Class complete');
    expect(completeLine.visibleCaption).toBe('You finished class. See you next time.');
    expect(completeLine.audioSpeaker).toBe('teacher');
    expect(completeLine.audioCueKey).toBe('teacher:lesson_complete:picture-talk:0:0');
  });

  it('keeps reward-stage spoken contracts audio-ready without changing child-facing copy', () => {
    const rewardLine = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 0,
      participationState: 'idle',
      phase: 'completion_reward',
      stageId: 'picture-talk',
      targetText,
    });

    expect(rewardLine.audioSpeaker).toBe('teacher');
    expect(rewardLine.audioCueKey).toBe('teacher:completion_reward:picture-talk:0:0');
    expect(rewardLine.spokenModel).toBe('Great job today. Class is complete.');
    expect(rewardLine.visibleCaption).toBe('Great job today. Class is complete.');
  });

  it('uses one short Nice answer line for picture-talk success feedback', () => {
    const line = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 1,
      participationState: 'spoke',
      phase: 'teacher_feedback',
      stageId: 'picture-talk',
      targetText,
    });

    expect(line.visibleCaption).toBe('Nice answer.');
    expect(line.spokenModel).toBe('Nice answer.');
    expect(line.hintLabel).toBe('Short praise');
  });

  it('keeps repeat fallback targets in spokenModel only and never in visibleCaption', () => {
    const appleItem = lessonWeek01Lesson01.items[0];
    const line = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 2,
      participationState: 'spoke',
      phase: 'teacher_fallback_model',
      stageId: 'repeat-after-teacher',
      targetText: appleItem.text,
      currentItem: appleItem,
    });

    expect(line.spokenModel).toMatch(/apple/i);
    expect(line.visibleCaption).toBe('Listen once more. Then say it with me.');
    expect(line.visibleCaption).not.toMatch(/apple/i);
    expect(line.hintLabel).not.toMatch(/apple/i);
  });

  it('keeps picture fallback answers in spokenModel only and child-facing copy answer-free', () => {
    const appleItem = lessonWeek01Lesson01.items[0];
    const line = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 2,
      participationState: 'silent',
      phase: 'teacher_fallback_model',
      stageId: 'picture-talk',
      targetText: appleItem.text,
      currentItem: appleItem,
    });

    expect(line.spokenModel).toBe('It is an apple.');
    expect(line.visibleCaption).toBe('Listen once more. Then say it with me.');
    expect(line.visibleCaption).not.toMatch(/apple/i);
    expect(line.hintLabel).not.toMatch(/apple/i);
  });

  it('uses a child-safe final follow line after fallback without exposing the answer', () => {
    const appleItem = lessonWeek01Lesson01.items[0];
    const line = getTeacherScriptLine({
      currentItemIndex: 0,
      attemptIndex: 2,
      participationState: 'waiting',
      phase: 'teacher_echo',
      stageId: 'picture-talk',
      targetText: appleItem.text,
      currentItem: appleItem,
    });

    expect(line.visibleCaption).toBe('Say it with Cora, then we go on.');
    expect(line.visibleCaption).not.toMatch(/apple/i);
    expect(line.spokenModel).not.toMatch(/apple/i);
  });
});
