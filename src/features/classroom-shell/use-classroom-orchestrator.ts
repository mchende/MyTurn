'use client';

import { useEffect, useReducer } from 'react';

import type { Lesson } from '@/features/lesson-config/lesson-schema';

import { getBobbyScriptLine } from './bobby-script';
import {
  CLASSROOM_TIMINGS,
  classroomOrchestratorReducer,
  createInitialClassroomState,
  type GuidedStageId,
  type ClassroomOrchestratorEvent,
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
      currentItemIndex: state.currentItemIndex,
      progressCount: state.lesson.items.length,
      rewardVisible: state.rewardVisible,
      phase: state.phase,
      stageId: state.currentStageId,
    }),
    stagePrompt: getStagePrompt({
      phase: state.phase,
      stageId: state.currentStageId,
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
  currentItemIndex,
  progressCount,
  rewardVisible,
  phase,
  stageId,
}: {
  currentItemIndex: number;
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

  return `${
    stageId === 'picture-talk' ? 'Picture talk' : 'Repeat'
  } ${currentItemIndex + 1}/${progressCount}`;
}

function getStagePrompt({
  phase,
  stageId,
}: {
  phase: keyof typeof CLASSROOM_TIMINGS | 'wrap_up';
  stageId: GuidedStageId;
}) {
  switch (phase) {
    case 'teacher_prompt':
      return stageId === 'picture-talk'
        ? 'Look at the picture. A question is coming.'
        : 'Listen first. Bobby will model one.';
    case 'ai_model':
      return 'Listen to Bobby once, then you speak.';
    case 'student_wait':
      return stageId === 'picture-talk'
        ? 'Look at the picture and answer.'
        : 'Say it after the model.';
    case 'teacher_encourage':
      return stageId === 'picture-talk'
        ? 'Try one more answer.'
        : 'Cora is helping you start again.';
    case 'teacher_echo':
      return stageId === 'picture-talk'
        ? 'Cora is keeping the class moving.'
        : 'Say it once more with Cora.';
    case 'teacher_feedback':
      return 'Cora gives a short feedback.';
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
