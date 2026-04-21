'use client';

import { useEffect, useReducer } from 'react';

import type { Lesson } from '@/features/lesson-config/lesson-schema';

import { getBobbyScriptLine } from './bobby-script';
import {
  CLASSROOM_TIMINGS,
  classroomOrchestratorReducer,
  createInitialClassroomState,
  type ClassroomOrchestratorEvent,
  type GuidedStageId,
  type ParticipationState,
} from './classroom-orchestrator';
import { buildPodiumViewModel } from './podium-view-model';
import { getTeacherScriptLine } from './teacher-script';

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

  const teacherScriptLine = getTeacherScriptLine({
    attemptIndex: state.attemptIndex,
    currentItemIndex: state.currentItemIndex,
    phase: state.phase,
    participationState: state.participationState,
    stageId: state.currentStageId,
    targetText: state.currentItem.text,
  });
  const bobbyScriptLine = getBobbyScriptLine({
    currentItemIndex: state.currentItemIndex,
    phase: state.phase,
    stageId: state.currentStageId,
    targetText: state.currentItem.text,
  });
  const podiumViewModel = buildPodiumViewModel({
    activeSeat: state.activeSeat,
    bobbyScriptLine,
    participationState: state.participationState,
    phase: state.phase,
    rewardVisible: state.rewardVisible,
    stageId: state.currentStageId,
  });

  return {
    ...state,
    bobbyScriptLine,
    podiumViewModel,
    progressCount: state.lesson.items.length,
    stageBadge: getStageBadge({
      currentStageItemIndex: state.currentStageItemIndex,
      progressCount:
        state.guidedStageRuns[state.currentStageIndex]?.itemIds.length ??
        state.lesson.items.length,
      rewardVisible: state.rewardVisible,
      phase: state.phase,
      stageId: state.currentStageId,
    }),
    stagePrompt: getStagePrompt({
      attemptIndex: state.attemptIndex,
      hintLevel: state.hintLevel,
      phase: state.phase,
      participationState: state.participationState,
      stageId: state.currentStageId,
      turnResolution: state.turnResolution,
    }),
    teacherHint: teacherScriptLine.hintLabel,
    teacherMessage: teacherScriptLine.visibleCaption,
    teacherScriptLine,
    showReward: () => {
      dispatch({ type: 'reward_visibility_changed', visible: true });
    },
    hideReward: () => {
      dispatch({ type: 'reward_visibility_changed', visible: false });
    },
    confirmStudentParticipation: () => {
      dispatch({ type: 'student_participation_confirmed' });
    },
  };
}

function getStageBadge({
  currentStageItemIndex,
  progressCount,
  rewardVisible,
  phase,
  stageId,
}: {
  currentStageItemIndex: number;
  progressCount: number;
  rewardVisible: boolean;
  phase: keyof typeof CLASSROOM_TIMINGS | 'wrap_up';
  stageId: GuidedStageId;
}) {
  if (rewardVisible) {
    return 'Reward time';
  }

  if (phase === 'wrap_up') {
    return 'Class closing';
  }

  const stageLabel =
    stageId === 'picture-talk' ? 'Picture talk' : 'Repeat after Cora';

  return `${stageLabel} · ${currentStageItemIndex + 1}/${progressCount}`;
}

function getStagePrompt({
  attemptIndex,
  hintLevel,
  phase,
  participationState,
  stageId,
  turnResolution,
}: {
  attemptIndex: number;
  hintLevel: 'none' | 'light' | 'fallback';
  phase: keyof typeof CLASSROOM_TIMINGS | 'wrap_up';
  participationState: ParticipationState;
  stageId: GuidedStageId;
  turnResolution: 'idle' | 'retry' | 'pass' | 'fallback';
}) {
  switch (phase) {
    case 'teacher_prompt':
      return stageId === 'picture-talk'
        ? 'Look at the picture. A question is coming.'
        : 'Listen first. Bobby will model one.';
    case 'ai_model':
      return 'Listen to Bobby once, then you speak.';
    case 'student_wait':
      if (stageId === 'picture-talk') {
        return hintLevel === 'light'
          ? 'Look again. Answer the smaller question.'
          : 'Look at the picture and answer.';
      }

      return hintLevel === 'light' ? 'Say it once more with Cora.' : 'Say it after the model.';
    case 'teacher_encourage':
      if (stageId === 'picture-talk') {
        return attemptIndex > 0 && participationState === 'silent'
          ? 'Thanks for trying. Let us keep going.'
          : 'Look again. I will make it smaller.';
      }

      return 'Cora is helping you start again.';
    case 'teacher_echo':
      return stageId === 'picture-talk'
        ? 'Cora is keeping the class moving.'
        : 'Say it once more with Cora.';
    case 'teacher_feedback':
      return turnResolution === 'pass'
        ? 'Cora gives a short feedback.'
        : 'Cora keeps the class moving.';
    case 'move_next':
      return 'Eyes on the next picture.';
    case 'wrap_up':
      return 'Class is done. Time to wave goodbye.';
    default:
      return '';
  }
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
