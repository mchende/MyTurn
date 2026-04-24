import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { lessonWeek01Lesson01 } from '../../content/lessons/week-01/lesson-01';
import { buildCanonicalManualTranscript } from '@/features/classroom-shell/classroom-judgment';
import {
  CLASSROOM_TIMINGS,
  CLASSROOM_TIMING_PROFILES,
  GUIDED_STAGE_IDS,
  LESSON_COMPLETE_HOLD_MS,
  buildGuidedStageRuns,
  classroomOrchestratorReducer,
  createInitialClassroomState,
} from '@/features/classroom-shell/classroom-orchestrator';
import {
  LESSON_COMPLETE_HOLD_MS as HOOK_LESSON_COMPLETE_HOLD_MS,
  useClassroomOrchestrator,
} from '@/features/classroom-shell/use-classroom-orchestrator';

describe('classroomOrchestratorReducer', () => {
  it('builds the guided speaking queue from repeat-after-teacher and picture-talk only', () => {
    const stageRuns = buildGuidedStageRuns(lessonWeek01Lesson01);

    expect(GUIDED_STAGE_IDS).toEqual(['repeat-after-teacher', 'picture-talk']);
    expect(stageRuns).toHaveLength(2);
    expect(stageRuns.map((stageRun) => stageRun.stageId)).toEqual([
      'repeat-after-teacher',
      'picture-talk',
    ]);
    expect(stageRuns.map((stageRun) => stageRun.itemIds)).toEqual([
      ['apple', 'banana', 'cat', 'dog', 'sun'],
      ['apple', 'banana', 'cat', 'dog', 'sun'],
    ]);
  });

  it('runs the full repeat-after-teacher stage before switching to picture-talk for the same lesson items', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

    expect(state.currentStageId).toBe('repeat-after-teacher');
    expect(state.currentStageIndex).toBe(0);
    expect(state.currentStageItemIndex).toBe(0);
    expect(state.phase).toBe('warmup');
    expect(state.currentItemIndex).toBe(0);
    expect(state.activeSpeaker).toBe('teacher');
    expect(state.activeSeat).toBe(null);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('teacher_prompt');
    expect(state.currentItem.id).toBe('apple');
    expect(state.activeSpeaker).toBe('teacher');
    expect(state.activeSeat).toBe(null);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('ai_model');
    expect(state.currentItem.id).toBe('apple');
    expect(state.activeSpeaker).toBe('ai');
    expect(state.activeSeat).toBe('ai');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');
    expect(state.currentItem.id).toBe('apple');
    expect(state.currentStageId).toBe('repeat-after-teacher');
    expect(state.activeSpeaker).toBe('student');
    expect(state.activeSeat).toBe('me');

    state = submitCanonicalAttempt(state);

    expect(state.phase).toBe('teacher_feedback');
    expect(state.participationState).toBe('spoke');

    for (let index = 0; index < lesson.items.length - 1; index += 1) {
      state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
      expect(state.phase).toBe('move_next');

      state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
      expect(state.currentStageId).toBe('repeat-after-teacher');
      expect(state.currentStageIndex).toBe(0);
      expect(state.currentStageItemIndex).toBe(index + 1);
      expect(state.currentItem.id).toBe(lesson.items[index + 1].id);
      expect(state.phase).toBe('teacher_prompt');

      state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
      expect(state.phase).toBe('ai_model');

      state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
      expect(state.phase).toBe('student_wait');

      state = submitCanonicalAttempt(state);
      expect(state.phase).toBe('teacher_feedback');
    }

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    expect(state.phase).toBe('move_next');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.currentStageId).toBe('picture-talk');
    expect(state.currentStageIndex).toBe(1);
    expect(state.currentStageItemIndex).toBe(0);
    expect(state.currentItem.id).toBe('apple');
    expect(state.currentItemIndex).toBe(0);
    expect(state.phase).toBe('teacher_prompt');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.currentStageId).toBe('picture-talk');
    expect(state.phase).toBe('student_wait');
    expect(state.activeSpeaker).toBe('student');
    expect(state.activeSeat).toBe('me');
  });

  it('requires a judged student attempt instead of auto-passing the student turn', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });
    expect(state.phase).toBe('teacher_encourage');
    expect(state.activeSpeaker).toBe('teacher');
    expect(state.activeSeat).toBe(null);

    state = createInitialClassroomState(lesson);
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: 'banana',
      source: 'mock_transcript',
    });

    expect(state.phase).toBe('teacher_encourage');
    expect(state.participationState).toBe('spoke');
    expect(state.turnResolution).toBe('retry');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    expect(state.phase).toBe('student_wait');
    expect(state.attemptIndex).toBe(1);

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: 'banana',
      source: 'mock_transcript',
    });

    expect(state.phase).toBe('teacher_fallback_model');
    expect(state.turnResolution).toBe('fallback');
  });

  it('accepts repeat transcripts from future_asr and keeps the existing lexical judgment path', () => {
    let state = createInitialClassroomState(lessonWeek01Lesson01);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');
    expect(state.currentStageId).toBe('repeat-after-teacher');

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: 'apple',
      source: 'future_asr',
    });

    expect(state.phase).toBe('teacher_feedback');
    expect(state.turnResolution).toBe('pass');
    expect(state.participationState).toBe('spoke');
  });

  it('routes failed repeat transcripts from future_asr into teacher encourage then fallback', () => {
    let state = createInitialClassroomState(lessonWeek01Lesson01);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: null,
      source: 'future_asr',
    });

    expect(state.phase).toBe('teacher_encourage');
    expect(state.turnResolution).toBe('retry');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');
    expect(state.attemptIndex).toBe(1);

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: null,
      source: 'future_asr',
    });

    expect(state.phase).toBe('teacher_fallback_model');
    expect(state.turnResolution).toBe('fallback');
  });

  it('keeps reward hidden during turn feedback and only shows it in the end-of-lesson completion chain', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = submitCanonicalAttempt(state);

    expect(state.phase).toBe('teacher_feedback');
    expect(state.rewardVisible).toBe(false);
    expect(state.participationState).toBe('spoke');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('move_next');
    expect(state.rewardVisible).toBe(false);

    state = createInitialClassroomState(lesson);
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = completeLessonThroughFinalPictureItem(state);
    expect(state.phase).toBe('wrap_up');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('completion_reward');
    expect(state.rewardVisible).toBe(true);
  });

  it('runs warmup, both guided stages, and the closing chain without adding warmup or wrap-up into the judged queue', () => {
    let state = createInitialClassroomState(lessonWeek01Lesson01);

    expect(state.phase).toBe('warmup');
    expect(state.guidedStageRuns).toHaveLength(2);
    expect(state.guidedStageRuns.map((stageRun) => stageRun.stageId)).toEqual([
      'repeat-after-teacher',
      'picture-talk',
    ]);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    expect(state.phase).toBe('teacher_prompt');

    state = completeLessonThroughFinalPictureItem(state);

    expect(state.currentStageId).toBe('picture-talk');
    expect(state.phase).toBe('wrap_up');
    expect(state.rewardVisible).toBe(false);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('completion_reward');
    expect(state.rewardVisible).toBe(true);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('lesson_complete');
    expect(state.rewardVisible).toBe(false);
    expect(LESSON_COMPLETE_HOLD_MS).toBe(3000);

    const settledState = classroomOrchestratorReducer(state, {
      type: 'phase_timer_completed',
    });

    expect(settledState).toEqual(state);
  });

  it('derives demo and test pacing from one central timing profile source', () => {
    expect(CLASSROOM_TIMINGS).toEqual(CLASSROOM_TIMING_PROFILES.demo);
    expect(CLASSROOM_TIMING_PROFILES.demo).toMatchObject({
      warmup: 2400,
      wrap_up: 2200,
      completion_reward: 1400,
    });
    expect(CLASSROOM_TIMING_PROFILES.test.warmup).toBeLessThan(
      CLASSROOM_TIMING_PROFILES.demo.warmup,
    );
    expect(CLASSROOM_TIMING_PROFILES.test.completion_reward).toBeLessThan(
      CLASSROOM_TIMING_PROFILES.demo.completion_reward,
    );
  });

  it('gives picture-talk one retry before returning to a second student attempt', () => {
    let state = moveToPictureTalkStudentWait();

    expect(state.currentStageId).toBe('picture-talk');
    expect(state.phase).toBe('student_wait');
    expect(state.attemptIndex).toBe(0);
    expect(state.hintLevel).toBe('none');
    expect(state.turnResolution).toBe('idle');

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });

    expect(state.phase).toBe('teacher_encourage');
    expect(state.participationState).toBe('silent');
    expect(state.attemptIndex).toBe(0);
    expect(state.hintLevel).toBe('light');
    expect(state.turnResolution).toBe('retry');
    expect(state.activeSeat).toBe(null);
    expect(state.activeSpeaker).toBe('teacher');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');
    expect(state.attemptIndex).toBe(1);
    expect(state.hintLevel).toBe('light');
    expect(state.turnResolution).toBe('retry');
    expect(state.participationState).toBe('waiting');
    expect(state.activeSeat).toBe('me');
    expect(state.activeSpeaker).toBe('student');
  });

  it('accepts picture future_asr transcripts through the existing semantic judgment path', () => {
    let state = moveToPictureTalkStudentWait();

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: 'red apple',
      source: 'future_asr',
    });

    expect(state.phase).toBe('teacher_feedback');
    expect(state.turnResolution).toBe('pass');
    expect(state.participationState).toBe('spoke');
  });

  it('routes failed picture future_asr transcripts back into retry and fallback', () => {
    let state = moveToPictureTalkStudentWait();

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: null,
      source: 'future_asr',
    });

    expect(state.phase).toBe('teacher_encourage');
    expect(state.turnResolution).toBe('retry');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');
    expect(state.attemptIndex).toBe(1);

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: null,
      source: 'future_asr',
    });

    expect(state.phase).toBe('teacher_fallback_model');
    expect(state.turnResolution).toBe('fallback');
  });

  it('routes the first repeat timeout into a light co-speak hint before giving a second student attempt', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.currentStageId).toBe('repeat-after-teacher');
    expect(state.phase).toBe('student_wait');
    expect(state.attemptIndex).toBe(0);
    expect(state.hintLevel).toBe('none');
    expect(state.turnResolution).toBe('idle');

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });

    expect(state.phase).toBe('teacher_encourage');
    expect(state.participationState).toBe('silent');
    expect(state.attemptIndex).toBe(0);
    expect(state.hintLevel).toBe('light');
    expect(state.turnResolution).toBe('retry');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');
    expect(state.participationState).toBe('waiting');
    expect(state.attemptIndex).toBe(1);
    expect(state.hintLevel).toBe('light');
    expect(state.turnResolution).toBe('retry');
    expect(state.activeSeat).toBe('me');
    expect(state.activeSpeaker).toBe('student');
  });

  it('routes second picture-talk failure into fallback model and one final follow CTA before moving on', () => {
    let state = moveToPictureTalkStudentWait();

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');
    expect(state.attemptIndex).toBe(1);

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });

    expect(state.phase).toBe('teacher_fallback_model');
    expect(state.participationState).toBe('silent');
    expect(state.currentItem.id).toBe('apple');
    expect(state.activeSeat).toBe(null);
    expect(state.activeSpeaker).toBe('teacher');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('teacher_echo');
    expect(state.activeSeat).toBe('me');
    expect(state.activeSpeaker).toBe('student');

    state = submitCanonicalAttempt(state);

    expect(state.phase).toBe('move_next');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('teacher_prompt');
    expect(state.currentStageId).toBe('picture-talk');
    expect(state.currentStageItemIndex).toBe(1);
    expect(state.currentItem.id).toBe('banana');
  });

  it('routes second repeat failure into teacher_fallback_model and then final follow before moving next', () => {
    let state = createInitialClassroomState(lessonWeek01Lesson01);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: 'banana',
      source: 'mock_transcript',
    });
    expect(state.phase).toBe('teacher_encourage');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    expect(state.phase).toBe('student_wait');

    state = classroomOrchestratorReducer(state, {
      type: 'student_attempt_submitted',
      transcript: 'banana',
      source: 'mock_transcript',
    });

    expect(state.phase).toBe('teacher_fallback_model');
    expect(state.activeSeat).toBe(null);
    expect(state.activeSpeaker).toBe('teacher');
    expect(state.turnResolution).toBe('fallback');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('teacher_echo');
    expect(state.activeSeat).toBe('me');
    expect(state.activeSpeaker).toBe('student');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('move_next');
  });

  it('lets picture-talk complete on either the first or second confirmed attempt', () => {
    let firstAttemptState = moveToPictureTalkStudentWait();

    firstAttemptState = submitCanonicalAttempt(firstAttemptState);

    expect(firstAttemptState.phase).toBe('teacher_feedback');
    expect(firstAttemptState.participationState).toBe('spoke');
    expect(firstAttemptState.attemptIndex).toBe(1);
    expect(firstAttemptState.hintLevel).toBe('none');
    expect(firstAttemptState.turnResolution).toBe('pass');

    let secondAttemptState = moveToPictureTalkStudentWait();

    secondAttemptState = classroomOrchestratorReducer(secondAttemptState, {
      type: 'student_silent_timeout',
    });
    secondAttemptState = classroomOrchestratorReducer(secondAttemptState, {
      type: 'phase_timer_completed',
    });

    expect(secondAttemptState.phase).toBe('student_wait');
    expect(secondAttemptState.attemptIndex).toBe(1);

    secondAttemptState = submitCanonicalAttempt(secondAttemptState);

    expect(secondAttemptState.phase).toBe('teacher_feedback');
    expect(secondAttemptState.participationState).toBe('spoke');
    expect(secondAttemptState.attemptIndex).toBe(2);
    expect(secondAttemptState.hintLevel).toBe('light');
    expect(secondAttemptState.turnResolution).toBe('pass');
  });
});

describe('useClassroomOrchestrator', () => {
  it('starts on item 0 teacher_prompt and exposes the derived view model', () => {
    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

    expect(result.current.phase).toBe('warmup');
    expect(result.current.currentItemIndex).toBe(0);
    expect(result.current.currentItem.id).toBe('apple');
    expect(result.current.currentStageId).toBe('repeat-after-teacher');
    expect(result.current.currentStageIndex).toBe(0);
    expect(result.current.currentStageItemIndex).toBe(0);
    expect(result.current.attemptIndex).toBe(0);
    expect(result.current.hintLevel).toBe('none');
    expect(result.current.turnResolution).toBe('idle');
    expect(result.current.activeSeat).toBe(null);
    expect(result.current.activeSpeaker).toBe('teacher');
    expect(result.current.rewardVisible).toBe(false);
    expect(result.current.participationState).toBe('idle');
    expect(result.current.debugTargetText).toBe('APPLE');
  });

  it('exposes warmup and lesson completion contracts directly from the hook surface', () => {
    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

    expect(HOOK_LESSON_COMPLETE_HOLD_MS).toBe(LESSON_COMPLETE_HOLD_MS);
    expect(result.current.completionHoldMs).toBe(LESSON_COMPLETE_HOLD_MS);
    expect(result.current.isLessonComplete).toBe(false);
    expect(result.current.stageBadge).toBe('Class warmup');
    expect(result.current.stagePrompt).toBe('Say hello. Class is starting.');
  });

  it('only advances to teacher_feedback when submitStudentAttempt or the compatibility alias is called during student_wait', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

    act(() => {
      result.current.submitStudentAttempt({
        transcript: 'apple',
        source: 'mock_transcript',
      });
    });
    expect(result.current.phase).toBe('warmup');
    expect(result.current.attemptIndex).toBe(0);

    act(() => {
      result.current.confirmStudentParticipation();
    });
    expect(result.current.phase).toBe('warmup');
    expect(result.current.attemptIndex).toBe(0);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.warmup);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_prompt);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.ai_model);
    });

    expect(result.current.phase).toBe('student_wait');
    expect(result.current.currentStageId).toBe('repeat-after-teacher');
    expect(result.current.currentStageItemIndex).toBe(0);

    act(() => {
      result.current.submitStudentAttempt({
        transcript: 'banana',
        source: 'mock_transcript',
      });
    });

    expect(result.current.phase).toBe('teacher_encourage');
    expect(result.current.turnResolution).toBe('retry');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_encourage);
    });
    expect(result.current.phase).toBe('student_wait');
    expect(result.current.attemptIndex).toBe(1);

    act(() => {
      result.current.confirmStudentParticipation();
    });

    expect(result.current.phase).toBe('teacher_feedback');
    expect(result.current.attemptIndex).toBe(2);
    expect(result.current.turnResolution).toBe('pass');

    vi.useRealTimers();
  });

  it('exposes the final follow CTA label after fallback and keeps the timer chain centralized', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.warmup);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_prompt);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.ai_model);
    });

    act(() => {
      result.current.submitStudentAttempt({
        transcript: 'banana',
        source: 'mock_transcript',
      });
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_encourage);
    });

    act(() => {
      result.current.submitStudentAttempt({
        transcript: 'banana',
        source: 'mock_transcript',
      });
    });

    expect(result.current.phase).toBe('teacher_fallback_model');
    expect(result.current.podiumViewModel.showConfirmationButton).toBe(false);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_fallback_model);
    });

    expect(result.current.phase).toBe('teacher_echo');
    expect(result.current.podiumViewModel.showConfirmationButton).toBe(true);
    expect(result.current.podiumViewModel.confirmationButtonLabel).toBe(
      'I said it with Cora',
    );

    vi.useRealTimers();
  });

  it('uses timer dispatches to move through the scripted order without component-level timeout chains', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

    expect(vi.getTimerCount()).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.warmup);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_prompt);
    });
    expect(result.current.phase).toBe('ai_model');
    expect(vi.getTimerCount()).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.ai_model);
    });
    expect(result.current.phase).toBe('student_wait');
    expect(result.current.hintLevel).toBe('none');
    expect(result.current.turnResolution).toBe('idle');
    expect(vi.getTimerCount()).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.student_wait);
    });
    expect(result.current.phase).toBe('teacher_encourage');
    expect(result.current.hintLevel).toBe('light');
    expect(result.current.turnResolution).toBe('retry');
    expect(vi.getTimerCount()).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_encourage);
    });
    expect(result.current.phase).toBe('student_wait');
    expect(result.current.attemptIndex).toBe(1);
    expect(result.current.hintLevel).toBe('light');
    expect(result.current.turnResolution).toBe('retry');
    expect(vi.getTimerCount()).toBe(1);

    vi.useRealTimers();
  });

  it('stops scheduling timers after lesson_complete and keeps closing badges/prompts stable for shell consumers', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.warmup);
    });

    for (let index = 0; index < lessonWeek01Lesson01.items.length; index += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_prompt);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.ai_model);
      });
      act(() => {
        result.current.confirmStudentParticipation();
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_feedback);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.move_next);
      });
    }

    for (let index = 0; index < lessonWeek01Lesson01.items.length; index += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_prompt);
      });
      act(() => {
        result.current.confirmStudentParticipation();
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_feedback);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.move_next);
      });
    }

    expect(result.current.phase).toBe('wrap_up');
    expect(result.current.stageBadge).toBe('Class closing');
    expect(result.current.stagePrompt).toBe('Cora is saying goodbye.');
    expect(vi.getTimerCount()).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.wrap_up);
    });

    expect(result.current.phase).toBe('completion_reward');
    expect(result.current.stageBadge).toBe('Reward time');
    expect(result.current.stagePrompt).toBe('Celebrate this brave lesson.');
    expect(result.current.rewardVisible).toBe(true);
    expect(vi.getTimerCount()).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.completion_reward);
    });

    expect(result.current.phase).toBe('lesson_complete');
    expect(result.current.isLessonComplete).toBe(true);
    expect(result.current.stageBadge).toBe('Class complete');
    expect(result.current.stagePrompt).toBe('See you next time.');
    expect(result.current.rewardVisible).toBe(false);
    expect(result.current.completionHoldMs).toBe(LESSON_COMPLETE_HOLD_MS);
    expect(vi.getTimerCount()).toBe(0);

    vi.useRealTimers();
  });

  it('keeps picture-talk success feedback short before moving directly to the next item', () => {
    let state = moveToPictureTalkStudentWait();

    state = submitCanonicalAttempt(state);

    expect(state.phase).toBe('teacher_feedback');
    expect(state.currentStageId).toBe('picture-talk');
    expect(state.turnResolution).toBe('pass');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('move_next');
  });
});

function moveToPictureTalkStudentWait() {
  const lesson = lessonWeek01Lesson01;
  let state = createInitialClassroomState(lesson);

  state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

  for (let index = 0; index < lesson.items.length; index += 1) {
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = submitCanonicalAttempt(state);
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
  }

  state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

  return state;
}

function completeLessonThroughFinalPictureItem(
  state: ReturnType<typeof createInitialClassroomState>,
) {
  let currentState = state;
  const totalTurns = lessonWeek01Lesson01.items.length * 2;

  for (let index = 0; index < totalTurns; index += 1) {
    currentState = classroomOrchestratorReducer(currentState, {
      type: 'phase_timer_completed',
    });

    if (currentState.phase === 'ai_model') {
      currentState = classroomOrchestratorReducer(currentState, {
        type: 'phase_timer_completed',
      });
    }

    currentState = submitCanonicalAttempt(currentState);
    currentState = classroomOrchestratorReducer(currentState, {
      type: 'phase_timer_completed',
    });
    currentState = classroomOrchestratorReducer(currentState, {
      type: 'phase_timer_completed',
    });
  }

  return currentState;
}

function submitCanonicalAttempt(
  state: ReturnType<typeof createInitialClassroomState>,
) {
  return classroomOrchestratorReducer(state, {
    type: 'student_attempt_submitted',
    transcript: buildCanonicalManualTranscript({
      currentItem: state.currentItem,
      stageId: state.currentStageId,
    }),
    source: 'manual',
  });
}
