'use client';

import type { Lesson, LessonItem } from '@/features/lesson-config/lesson-schema';

export type ClassroomOrchestratorPhase =
  | 'teacher_prompt'
  | 'ai_model'
  | 'student_wait'
  | 'teacher_encourage'
  | 'teacher_echo'
  | 'teacher_feedback'
  | 'move_next'
  | 'wrap_up';

export type ClassroomActiveSeat = 'me' | 'ai' | null;
export type ClassroomSpeaker = 'teacher' | 'ai' | 'student' | null;
export type ParticipationState =
  | 'idle'
  | 'waiting'
  | 'spoke'
  | 'silent'
  | 'encouraged'
  | 'echoed';

export const CLASSROOM_TIMINGS: Record<
  Exclude<ClassroomOrchestratorPhase, 'wrap_up'>,
  number
> = {
  teacher_prompt: 1800,
  ai_model: 1800,
  student_wait: 2200,
  teacher_encourage: 1600,
  teacher_echo: 1400,
  teacher_feedback: 1600,
  move_next: 600,
};

export type ClassroomOrchestratorState = {
  activeSeat: ClassroomActiveSeat;
  activeSpeaker: ClassroomSpeaker;
  currentItem: LessonItem;
  currentItemIndex: number;
  debugTargetText: string;
  lesson: Lesson;
  phase: ClassroomOrchestratorPhase;
  participationState: ParticipationState;
  rewardVisible: boolean;
};

export type ClassroomOrchestratorEvent =
  | { type: 'phase_timer_completed' }
  | { type: 'student_silent_timeout' }
  | { type: 'student_spoke' }
  | { type: 'teacher_echo_complete' }
  | { type: 'reward_visibility_changed'; visible: boolean };

export function createInitialClassroomState(
  lesson: Lesson,
): ClassroomOrchestratorState {
  const currentItem = lesson.items[0];

  return {
    activeSeat: null,
    activeSpeaker: 'teacher',
    currentItem,
    currentItemIndex: 0,
    debugTargetText: currentItem.text.toUpperCase(),
    lesson,
    phase: 'teacher_prompt',
    participationState: 'idle',
    rewardVisible: false,
  };
}

export function classroomOrchestratorReducer(
  state: ClassroomOrchestratorState,
  event: ClassroomOrchestratorEvent,
): ClassroomOrchestratorState {
  switch (event.type) {
    case 'reward_visibility_changed':
      return {
        ...state,
        rewardVisible: event.visible,
      };
    case 'student_spoke':
      if (state.phase !== 'student_wait') {
        return state;
      }

      return {
        ...state,
        activeSeat: 'me',
        activeSpeaker: 'teacher',
        participationState: 'spoke',
        phase: 'teacher_feedback',
      };
    case 'student_silent_timeout':
      if (state.phase !== 'student_wait') {
        return state;
      }

      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        participationState: 'silent',
        phase: 'teacher_encourage',
      };
    case 'teacher_echo_complete':
      if (state.phase !== 'teacher_echo') {
        return state;
      }

      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        participationState: 'echoed',
        phase: 'move_next',
      };
    case 'phase_timer_completed':
      return advanceTimedPhase(state);
    default:
      return state;
  }
}

function advanceTimedPhase(
  state: ClassroomOrchestratorState,
): ClassroomOrchestratorState {
  switch (state.phase) {
    case 'teacher_prompt':
      return {
        ...state,
        activeSeat: 'ai',
        activeSpeaker: 'ai',
        phase: 'ai_model',
      };
    case 'ai_model':
      return {
        ...state,
        activeSeat: 'me',
        activeSpeaker: 'student',
        participationState: 'waiting',
        phase: 'student_wait',
      };
    case 'student_wait':
      return classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });
    case 'teacher_encourage':
      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        participationState: 'encouraged',
        phase: 'teacher_echo',
      };
    case 'teacher_echo':
      return classroomOrchestratorReducer(state, { type: 'teacher_echo_complete' });
    case 'teacher_feedback':
      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        phase: 'move_next',
      };
    case 'move_next':
      return moveToNextItem(state);
    case 'wrap_up':
      return state;
    default:
      return state;
  }
}

function moveToNextItem(
  state: ClassroomOrchestratorState,
): ClassroomOrchestratorState {
  const nextItemIndex = state.currentItemIndex + 1;
  const nextItem = state.lesson.items[nextItemIndex];

  if (!nextItem) {
    return {
      ...state,
      activeSeat: null,
      activeSpeaker: 'teacher',
      phase: 'wrap_up',
    };
  }

  return {
    ...state,
    activeSeat: null,
    activeSpeaker: 'teacher',
    currentItem: nextItem,
    currentItemIndex: nextItemIndex,
    debugTargetText: nextItem.text.toUpperCase(),
    participationState: 'idle',
    phase: 'teacher_prompt',
    rewardVisible: false,
  };
}
