'use client';

import type {
  Lesson,
  LessonItem,
  LessonStage,
} from '@/features/lesson-config/lesson-schema';

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

export const GUIDED_STAGE_IDS = ['repeat-after-teacher', 'picture-talk'] as const;

export type GuidedStageId = (typeof GUIDED_STAGE_IDS)[number];

export type GuidedStageRun = {
  itemIds: LessonStage['itemIds'];
  stageId: GuidedStageId;
};

export type ClassroomOrchestratorState = {
  activeSeat: ClassroomActiveSeat;
  activeSpeaker: ClassroomSpeaker;
  attemptIndex: number;
  currentItem: LessonItem;
  currentItemIndex: number;
  currentStageId: GuidedStageId;
  currentStageIndex: number;
  currentStageItemIndex: number;
  debugTargetText: string;
  guidedStageRuns: GuidedStageRun[];
  lesson: Lesson;
  phase: ClassroomOrchestratorPhase;
  participationState: ParticipationState;
  rewardVisible: boolean;
};

export type ClassroomOrchestratorEvent =
  | { type: 'phase_timer_completed' }
  | { type: 'student_silent_timeout' }
  | { type: 'student_participation_confirmed' }
  | { type: 'teacher_echo_complete' }
  | { type: 'reward_visibility_changed'; visible: boolean };

export function buildGuidedStageRuns(lesson: Lesson): GuidedStageRun[] {
  return lesson.stages
    .filter(isGuidedLessonStage)
    .map((stage) => ({
      itemIds: [...stage.itemIds],
      stageId: stage.id,
    }));
}

export function createInitialClassroomState(
  lesson: Lesson,
): ClassroomOrchestratorState {
  const guidedStageRuns = buildGuidedStageRuns(lesson);
  const firstStageRun = guidedStageRuns[0];

  if (!firstStageRun) {
    throw new Error('Lesson must include at least one guided speaking stage.');
  }

  const firstItemRef = resolveLessonItemReference(lesson, firstStageRun.itemIds[0]);

  return {
    activeSeat: null,
    activeSpeaker: 'teacher',
    attemptIndex: 0,
    currentItem: firstItemRef.item,
    currentItemIndex: firstItemRef.itemIndex,
    currentStageId: firstStageRun.stageId,
    currentStageIndex: 0,
    currentStageItemIndex: 0,
    debugTargetText: firstItemRef.item.text.toUpperCase(),
    guidedStageRuns,
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
    case 'student_participation_confirmed':
      if (state.phase !== 'student_wait') {
        return state;
      }

      return {
        ...state,
        activeSeat: 'me',
        activeSpeaker: 'teacher',
        attemptIndex: state.attemptIndex + 1,
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
      if (state.currentStageId === 'picture-talk') {
        return {
          ...state,
          activeSeat: 'me',
          activeSpeaker: 'student',
          participationState: 'waiting',
          phase: 'student_wait',
        };
      }

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
  const currentStageRun = state.guidedStageRuns[state.currentStageIndex];

  if (!currentStageRun) {
    return toWrapUpState(state);
  }

  const nextStageItemId = currentStageRun.itemIds[state.currentStageItemIndex + 1];

  if (nextStageItemId) {
    const nextItemRef = resolveLessonItemReference(state.lesson, nextStageItemId);

    return resetForNextPrompt(state, {
      item: nextItemRef.item,
      itemIndex: nextItemRef.itemIndex,
      stageId: currentStageRun.stageId,
      stageIndex: state.currentStageIndex,
      stageItemIndex: state.currentStageItemIndex + 1,
    });
  }

  const nextStageRun = state.guidedStageRuns[state.currentStageIndex + 1];

  if (!nextStageRun) {
    return toWrapUpState(state);
  }

  const nextItemRef = resolveLessonItemReference(state.lesson, nextStageRun.itemIds[0]);

  return resetForNextPrompt(state, {
    item: nextItemRef.item,
    itemIndex: nextItemRef.itemIndex,
    stageId: nextStageRun.stageId,
    stageIndex: state.currentStageIndex + 1,
    stageItemIndex: 0,
  });
}

function isGuidedLessonStage(
  stage: LessonStage,
): stage is LessonStage & { id: GuidedStageId } {
  return GUIDED_STAGE_IDS.includes(stage.id as GuidedStageId);
}

function resolveLessonItemReference(lesson: Lesson, itemId: string) {
  const itemIndex = lesson.items.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    throw new Error(`Missing lesson item "${itemId}" in guided stage run.`);
  }

  return {
    item: lesson.items[itemIndex],
    itemIndex,
  };
}

function resetForNextPrompt(
  state: ClassroomOrchestratorState,
  nextStep: {
    item: LessonItem;
    itemIndex: number;
    stageId: GuidedStageId;
    stageIndex: number;
    stageItemIndex: number;
  },
): ClassroomOrchestratorState {
  return {
    ...state,
    activeSeat: null,
    activeSpeaker: 'teacher',
    attemptIndex: 0,
    currentItem: nextStep.item,
    currentItemIndex: nextStep.itemIndex,
    currentStageId: nextStep.stageId,
    currentStageIndex: nextStep.stageIndex,
    currentStageItemIndex: nextStep.stageItemIndex,
    debugTargetText: nextStep.item.text.toUpperCase(),
    participationState: 'idle',
    phase: 'teacher_prompt',
    rewardVisible: false,
  };
}

function toWrapUpState(
  state: ClassroomOrchestratorState,
): ClassroomOrchestratorState {
  return {
    ...state,
    activeSeat: null,
    activeSpeaker: 'teacher',
    phase: 'wrap_up',
  };
}
