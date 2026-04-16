import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { lessonWeek01Lesson01 } from '../../content/lessons/week-01/lesson-01';
import {
  CLASSROOM_TIMINGS,
  classroomOrchestratorReducer,
  createInitialClassroomState,
} from '@/features/classroom-shell/classroom-orchestrator';
import { useClassroomOrchestrator } from '@/features/classroom-shell/use-classroom-orchestrator';

describe('classroomOrchestratorReducer', () => {
  it('advances one item through teacher_prompt, ai_model, and student_wait with one active speaker', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

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
    expect(state.activeSpeaker).toBe('student');
    expect(state.activeSeat).toBe('me');
  });

  it('routes silence through student_wait, teacher_encourage, teacher_echo, and move_next without Bobby rescue', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });

    expect(state.phase).toBe('student_wait');

    state = classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });
    expect(state.phase).toBe('teacher_encourage');
    expect(state.activeSpeaker).toBe('teacher');
    expect(state.activeSeat).toBe(null);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    expect(state.phase).toBe('teacher_echo');

    state = classroomOrchestratorReducer(state, { type: 'teacher_echo_complete' });
    expect(state.phase).toBe('move_next');
    expect(state.activeSpeaker).toBe('teacher');
    expect(state.activeSeat).toBe(null);
  });

  it('keeps reward gating explicit instead of making celebration mandatory', () => {
    const lesson = lessonWeek01Lesson01;
    let state = createInitialClassroomState(lesson);

    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'phase_timer_completed' });
    state = classroomOrchestratorReducer(state, { type: 'student_spoke' });

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
    expect(result.current.activeSeat).toBe(null);
    expect(result.current.activeSpeaker).toBe('teacher');
    expect(result.current.rewardVisible).toBe(false);
    expect(result.current.participationState).toBe('idle');
    expect(result.current.debugTargetText).toBe('APPLE');
  });

  it('uses timer dispatches to move through the scripted order without component-level timeout chains', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useClassroomOrchestrator({
        lesson: lessonWeek01Lesson01,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.teacher_prompt);
    });
    expect(result.current.phase).toBe('ai_model');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.ai_model);
    });
    expect(result.current.phase).toBe('student_wait');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CLASSROOM_TIMINGS.student_wait);
    });
    expect(result.current.phase).toBe('teacher_encourage');

    vi.useRealTimers();
  });
});
