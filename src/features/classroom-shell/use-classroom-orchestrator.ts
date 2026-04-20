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
    currentItemIndex: state.currentItemIndex,
    phase: state.phase,
    targetText: state.currentItem.text,
  });
  const bobbyScriptLine = getBobbyScriptLine({
    currentItemIndex: state.currentItemIndex,
    phase: state.phase,
    targetText: state.currentItem.text,
  });
  const podiumViewModel = buildPodiumViewModel({
    activeSeat: state.activeSeat,
    bobbyScriptLine,
    participationState: state.participationState,
    phase: state.phase,
    rewardVisible: state.rewardVisible,
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
    }),
    stagePrompt: getStagePrompt({
      phase: state.phase,
      stageId: state.currentStageId,
    }),
    teacherHint: teacherScriptLine.hintLabel,
    teacherMessage: teacherScriptLine.spokenLine,
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
}: {
  currentItemIndex: number;
  progressCount: number;
  rewardVisible: boolean;
  phase: keyof typeof CLASSROOM_TIMINGS | 'wrap_up';
}) {
  if (rewardVisible) {
    return '奖励时刻';
  }

  if (phase === 'wrap_up') {
    return '课堂收尾';
  }

  return `第 ${currentItemIndex + 1}/${progressCount} 轮`;
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
        ? '老师正在看图提问，马上就轮到你自己回答。'
        : '老师正在带你观察图片，马上会先听到 Bobby 的示范。';
    case 'ai_model':
      return '先听 Bobby 一次，再轮到你开口。';
    case 'student_wait':
      return stageId === 'picture-talk'
        ? '看着图片自己回答，慢一点也没关系。'
        : '听完示范后跟着说一次，慢一点也没关系。';
    case 'teacher_encourage':
      return 'Cora 正在接住停顿，帮你把这一轮继续下去。';
    case 'teacher_echo':
      return '跟着 Cora 再说一次，课堂节奏会继续往前走。';
    case 'teacher_feedback':
      return 'Cora 正在给一个短反馈，然后准备切到下一张图。';
    case 'move_next':
      return '眼睛回到主屏幕，下一张图片要来了。';
    case 'wrap_up':
      return '这一节短课已经结束，准备挥手说再见。';
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
