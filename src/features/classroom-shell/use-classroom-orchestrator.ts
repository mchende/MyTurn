'use client';

import { useEffect, useReducer } from 'react';

import type { Lesson } from '@/features/lesson-config/lesson-schema';

import {
  CLASSROOM_TIMINGS,
  classroomOrchestratorReducer,
  createInitialClassroomState,
  type ClassroomOrchestratorEvent,
} from './classroom-orchestrator';

type UseClassroomOrchestratorOptions = {
  lesson: Lesson;
  showReward?: boolean;
};

export function useClassroomOrchestrator({
  lesson,
  showReward = false,
}: UseClassroomOrchestratorOptions) {
  const [state, dispatch] = useReducer(
    classroomOrchestratorReducer,
    lesson,
    createInitialClassroomState,
  );

  useEffect(() => {
    dispatch({
      type: 'reward_visibility_changed',
      visible: showReward,
    });
  }, [showReward]);

  useEffect(() => {
    if (state.phase === 'wrap_up') {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch(getScheduledEvent(state.phase));
    }, CLASSROOM_TIMINGS[state.phase]);

    return () => window.clearTimeout(timer);
  }, [state.phase]);

  return {
    ...state,
    showReward: () => {
      dispatch({ type: 'reward_visibility_changed', visible: true });
    },
    hideReward: () => {
      dispatch({ type: 'reward_visibility_changed', visible: false });
    },
    markStudentSpoke: () => {
      dispatch({ type: 'student_spoke' });
    },
  };
}

function getScheduledEvent(phase: keyof typeof CLASSROOM_TIMINGS): ClassroomOrchestratorEvent {
  if (phase === 'student_wait') {
    return { type: 'student_silent_timeout' };
  }

  if (phase === 'teacher_echo') {
    return { type: 'teacher_echo_complete' };
  }

  return { type: 'phase_timer_completed' };
}
