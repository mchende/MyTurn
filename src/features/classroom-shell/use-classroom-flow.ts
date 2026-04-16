'use client';

import { useEffect, useState } from 'react';

import type { Lesson, LessonItem } from '@/features/lesson-config/lesson-schema';

export type ClassroomFlowPhase =
  | 'teacher_prompt'
  | 'ai_model'
  | 'student_turn'
  | 'teacher_feedback'
  | 'celebration'
  | 'wrap_up';

type ActiveSeat = 'me' | 'ai' | null;

const FLOW_SEQUENCE: ClassroomFlowPhase[] = [
  'teacher_prompt',
  'ai_model',
  'student_turn',
  'teacher_feedback',
  'celebration',
];

export const CLASSROOM_FLOW_DURATIONS: Record<Exclude<ClassroomFlowPhase, 'wrap_up'>, number> = {
  teacher_prompt: 1800,
  ai_model: 1800,
  student_turn: 2200,
  teacher_feedback: 1600,
  celebration: 1400,
};

export type ClassroomFlowState = {
  activeSeat: ActiveSeat;
  currentItem: LessonItem;
  currentItemIndex: number;
  phase: ClassroomFlowPhase;
  podiumCaption: string;
  progressCount: number;
  rewardVisible: boolean;
  stageBadge: string;
  stagePrompt: string;
  teacherHint: string;
  teacherMessage: string;
};

type UseClassroomFlowOptions = {
  lesson: Lesson;
  forceReward?: boolean;
};

export function useClassroomFlow({
  lesson,
  forceReward = false,
}: UseClassroomFlowOptions): ClassroomFlowState {
  const [itemIndex, setItemIndex] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [hasWrappedUp, setHasWrappedUp] = useState(false);

  const totalItems = lesson.items.length;
  const sequencePhase = FLOW_SEQUENCE[phaseIndex] ?? 'teacher_prompt';
  const phase = forceReward ? 'celebration' : hasWrappedUp ? 'wrap_up' : sequencePhase;
  const currentItem = lesson.items[itemIndex] ?? lesson.items[0];

  useEffect(() => {
    if (forceReward || hasWrappedUp) {
      return;
    }

    const duration = CLASSROOM_FLOW_DURATIONS[sequencePhase];
    const timer = window.setTimeout(() => {
      if (phaseIndex < FLOW_SEQUENCE.length - 1) {
        setPhaseIndex(phaseIndex + 1);
        return;
      }

      if (itemIndex < totalItems - 1) {
        setItemIndex(itemIndex + 1);
        setPhaseIndex(0);
        return;
      }

      setHasWrappedUp(true);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [forceReward, hasWrappedUp, itemIndex, phaseIndex, sequencePhase, totalItems]);

  return {
    activeSeat: getActiveSeat(phase),
    currentItem,
    currentItemIndex: itemIndex,
    phase,
    podiumCaption: getPodiumCaption(phase, currentItem),
    progressCount: totalItems,
    rewardVisible: forceReward || phase === 'celebration',
    stageBadge: getStageBadge(phase, itemIndex, totalItems),
    stagePrompt: getStagePrompt(phase, currentItem),
    teacherHint: getTeacherHint(phase),
    teacherMessage: getTeacherMessage(phase, currentItem),
  };
}

function getActiveSeat(phase: ClassroomFlowPhase): ActiveSeat {
  if (phase === 'ai_model') {
    return 'ai';
  }

  if (phase === 'student_turn' || phase === 'teacher_feedback' || phase === 'celebration') {
    return 'me';
  }

  return null;
}

function getStageBadge(phase: ClassroomFlowPhase, itemIndex: number, totalItems: number) {
  if (phase === 'wrap_up') {
    return '课堂收尾';
  }

  return `第 ${itemIndex + 1}/${totalItems} 轮`;
}

function getTeacherHint(phase: ClassroomFlowPhase) {
  switch (phase) {
    case 'teacher_prompt':
      return '老师点名中';
    case 'ai_model':
      return 'Bobby 示范中';
    case 'student_turn':
      return '轮到你开口';
    case 'teacher_feedback':
      return '老师鼓励中';
    case 'celebration':
      return '奖励时刻';
    case 'wrap_up':
      return '课堂小结';
    default:
      return '课堂进行中';
  }
}

function getTeacherMessage(phase: ClassroomFlowPhase, item: LessonItem) {
  const word = item.text.toUpperCase();

  switch (phase) {
    case 'teacher_prompt':
      return `Look carefully. Can you find the ${word}?`;
    case 'ai_model':
      return `Listen to Bobby first: "${word}!"`;
    case 'student_turn':
      return `Now it's your turn. Say "${word}!"`;
    case 'teacher_feedback':
      return `Excellent! You said "${word}" so clearly!`;
    case 'celebration':
      return 'Excellent!';
    case 'wrap_up':
      return 'Wonderful work today. See you next class!';
    default:
      return `Let's say ${word}!`;
  }
}

function getStagePrompt(phase: ClassroomFlowPhase, item: LessonItem) {
  const word = item.text.toUpperCase();

  switch (phase) {
    case 'teacher_prompt':
      return `老师正在引导你观察图片，马上进入 ${word} 发音练习。`;
    case 'ai_model':
      return `Bobby 先做一次示范，你可以先听清楚再开口。`;
    case 'student_turn':
      return `看图大胆说出 ${word}，不用着急，先开口最重要。`;
    case 'teacher_feedback':
      return `Cora 正在即时反馈，给你一个非常正向的鼓励。`;
    case 'celebration':
      return `回答完成，奖励反馈正在触发，课堂节奏继续推进。`;
    case 'wrap_up':
      return '这一轮课堂已经完成，准备进入下一次上课体验。';
    default:
      return '';
  }
}

function getPodiumCaption(phase: ClassroomFlowPhase, item: LessonItem) {
  const word = item.text.toUpperCase();

  switch (phase) {
    case 'teacher_prompt':
      return `准备上讲台：目标词 ${word}`;
    case 'ai_model':
      return `Bobby 正在示范 ${word}`;
    case 'student_turn':
      return `现在轮到你说 ${word}`;
    case 'teacher_feedback':
      return `老师刚刚表扬了你的 ${word}`;
    case 'celebration':
      return '奖励反馈播放中';
    case 'wrap_up':
      return '本节课堂已完成';
    default:
      return '';
  }
}
