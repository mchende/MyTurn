'use client';

import type {
  Lesson,
  LessonItem,
  LessonStage,
} from '@/features/lesson-config/lesson-schema';
import {
  judgeStudentAttempt,
  type JudgmentStageId,
} from '@/features/classroom-shell/classroom-judgment';

export type ClassroomOrchestratorPhase =
  | 'warmup'
  | 'teacher_prompt'
  | 'ai_model'
  | 'student_wait'
  | 'teacher_encourage'
  | 'teacher_fallback_model'
  | 'teacher_echo'
  | 'teacher_feedback'
  | 'move_next'
  | 'wrap_up'
  | 'completion_reward'
  | 'lesson_complete';

export type ClassroomActiveSeat = 'me' | 'ai' | null;
export type ClassroomSpeaker = 'teacher' | 'ai' | 'student' | null;
export type ParticipationState =
  | 'idle'
  | 'waiting'
  | 'spoke'
  | 'silent'
  | 'encouraged'
  | 'echoed';
export type HintLevel = 'none' | 'light' | 'fallback';
export type TurnResolution = 'idle' | 'retry' | 'pass' | 'fallback';
export type StudentAttemptSource = 'manual' | 'mock_transcript' | 'future_asr';

export const LESSON_COMPLETE_HOLD_MS = 3000;

type ClassroomTimedPhase = Exclude<ClassroomOrchestratorPhase, 'lesson_complete'>;
type ClassroomTimingProfile = Record<ClassroomTimedPhase, number>;

const CLASSROOM_TIMING_SCALE = {
  demo: 1,
  test: 0.2,
} as const;

function scaleClassroomTimings(
  timings: ClassroomTimingProfile,
  scale: number,
): ClassroomTimingProfile {
  return Object.fromEntries(
    Object.entries(timings).map(([phase, duration]) => [
      phase,
      Math.max(1, Math.round(duration * scale)),
    ]),
  ) as ClassroomTimingProfile;
}

const CLASSROOM_TIMING_BASE: ClassroomTimingProfile = {
  warmup: 2400,
  teacher_prompt: 1800,
  ai_model: 1800,
  student_wait: 2200,
  teacher_encourage: 1600,
  teacher_fallback_model: 1800,
  teacher_echo: 1400,
  teacher_feedback: 1600,
  move_next: 600,
  wrap_up: 2200,
  completion_reward: 1400,
};

export const CLASSROOM_TIMING_PROFILES: Record<
  keyof typeof CLASSROOM_TIMING_SCALE,
  ClassroomTimingProfile
> = {
  demo: CLASSROOM_TIMING_BASE,
  test: scaleClassroomTimings(
    CLASSROOM_TIMING_BASE,
    CLASSROOM_TIMING_SCALE.test,
  ),
};

export const CLASSROOM_TIMINGS = CLASSROOM_TIMING_PROFILES.demo;

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
  hintLevel: HintLevel;
  lesson: Lesson;
  phase: ClassroomOrchestratorPhase;
  participationState: ParticipationState;
  rewardVisible: boolean;
  turnResolution: TurnResolution;
};

export type ClassroomOrchestratorEvent =
  | { type: 'phase_timer_completed' }
  | { type: 'student_silent_timeout' }
  | {
      type: 'student_attempt_submitted';
      transcript: string | null;
      source: StudentAttemptSource;
    }
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
    hintLevel: 'none',
    lesson,
    phase: 'warmup',
    participationState: 'idle',
    rewardVisible: false,
    turnResolution: 'idle',
  };
}

export function classroomOrchestratorReducer(
  state: ClassroomOrchestratorState,
  event: ClassroomOrchestratorEvent,
): ClassroomOrchestratorState {
  switch (event.type) {
    case 'reward_visibility_changed':
      return state.phase === 'completion_reward'
        ? {
            ...state,
            rewardVisible: event.visible,
          }
        : state;
    case 'student_attempt_submitted':
      if (state.phase === 'teacher_echo') {
        return {
          ...state,
          activeSeat: null,
          activeSpeaker: 'teacher',
          participationState: 'echoed',
          phase: 'move_next',
        };
      }

      if (state.phase !== 'student_wait') {
        return state;
      }

      const judgment = judgeStudentAttempt({
        lessonItem: state.currentItem,
        stageId: state.currentStageId as JudgmentStageId,
        transcript: event.transcript,
        attemptIndex: state.attemptIndex,
      });

      if (judgment.outcome === 'pass') {
        return {
          ...state,
          activeSeat: 'me',
          activeSpeaker: 'teacher',
          attemptIndex: state.attemptIndex + 1,
          hintLevel: state.hintLevel,
          participationState: 'spoke',
          phase: 'teacher_feedback',
          turnResolution: 'pass',
        };
      }

      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        attemptIndex: state.attemptIndex + 1,
        hintLevel: judgment.outcome === 'fallback' ? 'fallback' : 'light',
        participationState: 'spoke',
        phase:
          judgment.outcome === 'fallback'
            ? 'teacher_fallback_model'
            : 'teacher_encourage',
        turnResolution: judgment.outcome,
      };
    case 'student_silent_timeout':
      if (state.phase !== 'student_wait') {
        return state;
      }

      const silentOutcome = state.attemptIndex >= 1 ? 'fallback' : 'retry';

      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        hintLevel: silentOutcome === 'fallback' ? 'fallback' : 'light',
        participationState: 'silent',
        phase:
          silentOutcome === 'fallback'
            ? 'teacher_fallback_model'
            : 'teacher_encourage',
        turnResolution: silentOutcome,
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
    case 'warmup':
      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        hintLevel: 'none',
        phase: 'teacher_prompt',
        rewardVisible: false,
        turnResolution: 'idle',
      };
    case 'teacher_prompt':
      if (state.currentStageId === 'picture-talk') {
        return {
          ...state,
          activeSeat: 'me',
          activeSpeaker: 'student',
          hintLevel: state.hintLevel,
          participationState: 'waiting',
          phase: 'student_wait',
          turnResolution: 'idle',
        };
      }

      return {
        ...state,
        activeSeat: 'ai',
        activeSpeaker: 'ai',
        hintLevel: 'none',
        phase: 'ai_model',
        turnResolution: 'idle',
      };
    case 'ai_model':
      return {
        ...state,
        activeSeat: 'me',
        activeSpeaker: 'student',
        hintLevel: 'none',
        participationState: 'waiting',
        phase: 'student_wait',
        turnResolution: 'idle',
      };
    case 'student_wait':
      return classroomOrchestratorReducer(state, { type: 'student_silent_timeout' });
    case 'teacher_encourage':
      if (state.turnResolution === 'retry') {
        return {
          ...state,
          activeSeat: 'me',
          activeSpeaker: 'student',
          attemptIndex: Math.max(state.attemptIndex, 1),
          hintLevel: state.hintLevel,
          participationState: 'waiting',
          phase: 'student_wait',
          turnResolution: 'retry',
        };
      }
      return state;
    case 'teacher_fallback_model':
      return {
        ...state,
        activeSeat: 'me',
        activeSpeaker: 'student',
        participationState: 'waiting',
        phase: 'teacher_echo',
        turnResolution: state.turnResolution,
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
      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        participationState: 'idle',
        phase: 'completion_reward',
        rewardVisible: true,
      };
    case 'completion_reward':
      return {
        ...state,
        activeSeat: null,
        activeSpeaker: 'teacher',
        participationState: 'idle',
        phase: 'lesson_complete',
        rewardVisible: false,
      };
    case 'lesson_complete':
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
    hintLevel: 'none',
    participationState: 'idle',
    phase: 'teacher_prompt',
    rewardVisible: false,
    turnResolution: 'idle',
  };
}

function toWrapUpState(
  state: ClassroomOrchestratorState,
): ClassroomOrchestratorState {
  return {
    ...state,
    activeSeat: null,
    activeSpeaker: 'teacher',
    hintLevel: 'none',
    participationState: 'idle',
    phase: 'wrap_up',
    rewardVisible: false,
    turnResolution: 'idle',
  };
}
