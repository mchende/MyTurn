import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { lessonWeek01Lesson01 } from '../../content/lessons/week-01/lesson-01';
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

    state = classroomOrchestratorReducer(state, {
      type: 'student_participation_confirmed',
    });

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

      state = classroomOrchestratorReducer(state, {
        type: 'student_participation_confirmed',
      });
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

  it('requires an explicit participation confirmation instead of auto-passing the student turn', () => {
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
      type: 'student_participation_confirmed',
    });

    expect(state.phase).toBe('teacher_feedback');
    expect(state.participationState).toBe('spoke');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    expect(state.phase).toBe('move_next');
    expect(state.activeSpeaker).toBe('teacher');
    expect(state.activeSeat).toBe(null);
  });

  it('keeps reward gating explicit instead of making celebration mandatory', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, {
      type: 'student_participation_confirmed',
    });

    expect(state.phase).toBe('teacher_feedback');
    expect(state.rewardVisible).toBe(false);
    expect(state.participationState).toBe('spoke');

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('move_next');
    expect(state.rewardVisible).toBe(false);

    state = classroomOrchestratorReducer(state, { type: 'reward_visibility_changed', visible: true });

    expect(state.rewardVisible).toBe(true);
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
    expect(result.current.activeSeat).toBe(null);
    expect(result.current.activeSpeaker).toBe('teacher');
    expect(result.current.rewardVisible).toBe(false);
    expect(result.current.participationState).toBe('idle');
    expect(result.current.debugTargetText).toBe('APPLE');
  });

  it('only advances to teacher_feedback when confirmStudentParticipation is called during student_wait', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

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
      result.current.confirmStudentParticipation();
    });

    expect(result.current.phase).toBe('teacher_feedback');
    expect(result.current.attemptIndex).toBe(1);

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
    expect(vi.getTimerCount()).toBe(1);

    act(() => {
      result.current.confirmStudentParticipation();
    });
    expect(result.current.phase).toBe('teacher_feedback');
    expect(vi.getTimerCount()).toBe(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_feedback);
    });
    expect(result.current.phase).toBe('move_next');
    expect(vi.getTimerCount()).toBe(1);

    vi.useRealTimers();
  });
});
