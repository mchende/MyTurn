import type {
  ClassroomActiveSeat,
  ClassroomOrchestratorPhase,
  ParticipationState,
} from './classroom-orchestrator';
import type { BobbyScriptLine } from './bobby-script';

export type StudentSeatViewModel = {
  id: 'me' | 'ai' | 'empty';
  imageAlt?: string;
  imageSrc?: string;
  isEmpty: boolean;
  isOnStage: boolean;
  label: string;
  testId: string;
};

export type PodiumViewModel = {
  liveAvatarAlt: string;
  liveAvatarSrc: string;
  podiumCaption: string;
  podiumStatus: string;
  pulseDurationMs: number;
  seats: readonly StudentSeatViewModel[];
};

type BuildPodiumViewModelOptions = {
  activeSeat: ClassroomActiveSeat;
  bobbyScriptLine: BobbyScriptLine | null;
  participationState: ParticipationState;
  phase: ClassroomOrchestratorPhase;
  rewardVisible: boolean;
};

export function buildPodiumViewModel({
  activeSeat,
  bobbyScriptLine,
  participationState,
  phase,
  rewardVisible,
}: BuildPodiumViewModelOptions): PodiumViewModel {
  return {
    liveAvatarAlt: getLiveAvatarAlt(activeSeat),
    liveAvatarSrc:
      activeSeat === 'ai'
        ? '/avatars/student-bobby.svg'
        : '/avatars/reward-student.svg',
    podiumCaption: getPodiumCaption(phase, rewardVisible),
    podiumStatus: getPodiumStatus({
      bobbyScriptLine,
      participationState,
      phase,
      rewardVisible,
    }),
    pulseDurationMs:
      phase === 'ai_model' && bobbyScriptLine
        ? bobbyScriptLine.leadInPauseMs + bobbyScriptLine.hesitationBeatMs + 620
        : 900,
    seats: [
      {
        id: 'me',
        imageAlt: '我的席位',
        imageSrc: '/avatars/reward-student.svg',
        isEmpty: false,
        isOnStage: activeSeat === 'me',
        label: '我',
        testId: 'seat-me',
      },
      {
        id: 'ai',
        imageAlt: 'AI 同学 Bobby',
        imageSrc: '/avatars/student-bobby.svg',
        isEmpty: false,
        isOnStage: activeSeat === 'ai',
        label: 'AI',
        testId: 'seat-ai',
      },
      {
        id: 'empty',
        isEmpty: true,
        isOnStage: false,
        label: '空位',
        testId: 'seat-empty',
      },
    ],
  };
}

function getLiveAvatarAlt(activeSeat: ClassroomActiveSeat) {
  if (activeSeat === 'ai') {
    return 'Bobby 讲台画面';
  }

  if (activeSeat === 'me') {
    return '我的讲台画面';
  }

  return '我的摄像头占位';
}

function getPodiumCaption(
  phase: ClassroomOrchestratorPhase,
  rewardVisible: boolean,
) {
  if (rewardVisible) {
    return '奖励时刻';
  }

  switch (phase) {
    case 'teacher_prompt':
      return '先看图，马上轮到 Bobby';
    case 'ai_model':
      return 'Bobby 在讲台示范';
    case 'student_wait':
      return '轮到你上讲台';
    case 'teacher_encourage':
      return 'Cora 在台下接住你';
    case 'teacher_echo':
      return 'Cora 带你一起说';
    case 'teacher_feedback':
      return 'Cora 正在收束这一轮';
    case 'move_next':
      return '准备切到下一题';
    case 'wrap_up':
      return '课堂收尾';
    default:
      return '课堂进行中';
  }
}

function getPodiumStatus({
  bobbyScriptLine,
  participationState,
  phase,
  rewardVisible,
}: Omit<BuildPodiumViewModelOptions, 'activeSeat'>) {
  if (rewardVisible) {
    return 'Great job, brave voice.';
  }

  if (phase === 'ai_model' && bobbyScriptLine) {
    return bobbyScriptLine.hintLabel;
  }

  switch (phase) {
    case 'teacher_prompt':
      return 'Watch first. Your turn is coming.';
    case 'student_wait':
      return 'Take a breath. Your voice is ready.';
    case 'teacher_encourage':
      return 'Cora is helping you start.';
    case 'teacher_echo':
      return 'Say it together with Cora.';
    case 'teacher_feedback':
      return participationState === 'spoke'
        ? 'Cora heard your brave try.'
        : 'Cora is wrapping this turn.';
    case 'move_next':
      return 'Next picture is loading.';
    case 'wrap_up':
      return 'Class is all done.';
    default:
      return 'Stay with the class rhythm.';
  }
}
