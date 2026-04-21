import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { lessonWeek01Lesson01 } from '../../content/lessons/week-01/lesson-01';
import { buildCanonicalManualTranscript } from '@/features/classroom-shell/classroom-judgment';
import {
  CLASSROOM_TIMINGS,
  GUIDED_STAGE_IDS,
  buildGuidedStageRuns,
  classroomOrchestratorReducer,
  createInitialClassroomState,
} from '@/features/classroom-shell/classroom-orchestrator';
import { useClassroomOrchestrator } from '@/features/classroom-shell/use-classroom-orchestrator';

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
    expect(state.phase).toBe('teacher_prompt');
    expect(state.currentItemIndex).toBe(0);
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

    expect(state.phase).toBe('student_wait');

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });
    expect(state.phase).toBe('teacher_encourage');
    expect(state.activeSpeaker).toBe('teacher');
    expect(state.activeSeat).toBe(null);

    state = createInitialClassroomState(lesson);
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

    expect(state.phase).toBe('teacher_encourage');
    expect(state.turnResolution).toBe('fallback');
  });

  it('keeps reward gating explicit instead of making celebration mandatory', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = submitCanonicalAttempt(state);

    expect(state.phase).toBe('teacher_feedback');
    expect(state.rewardVisible).toBe(false);
    expect(state.participationState).toBe('spoke');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('move_next');
    expect(state.rewardVisible).toBe(false);

    state = classroomOrchestratorReducer(state, { type: 'reward_visibility_changed', visible: true });

    expect(state.rewardVisible).toBe(true);
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

  it('routes the first repeat timeout into a light co-speak hint before giving a second student attempt', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

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

  it('closes picture-talk after a second timeout instead of routing through teacher_echo', () => {
    let state = moveToPictureTalkStudentWait();

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');
    expect(state.attemptIndex).toBe(1);

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });

    expect(state.phase).toBe('teacher_encourage');
    expect(state.participationState).toBe('silent');
    expect(state.currentItem.id).toBe('apple');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('move_next');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('teacher_prompt');
    expect(state.currentStageId).toBe('picture-talk');
    expect(state.currentStageItemIndex).toBe(1);
    expect(state.currentItem.id).toBe('banana');
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

    expect(result.current.phase).toBe('teacher_prompt');
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
    expect(result.current.phase).toBe('teacher_prompt');
    expect(result.current.attemptIndex).toBe(0);

    act(() => {
      result.current.confirmStudentParticipation();
    });
    expect(result.current.phase).toBe('teacher_prompt');
    expect(result.current.attemptIndex).toBe(0);

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

  it('uses timer dispatches to move through the scripted order without component-level timeout chains', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

    expect(vi.getTimerCount()).toBe(1);

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
});

function moveToPictureTalkStudentWait() {
  const lesson = lessonWeek01Lesson01;
  let state = createInitialClassroomState(lesson);

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
