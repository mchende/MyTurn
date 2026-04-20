import type {
  ClassroomActiveSeat,
  ClassroomOrchestratorPhase,
  GuidedStageId,
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
  confirmationButtonLabel: string | null;
  liveAvatarAlt: string;
  liveAvatarSrc: string;
  podiumCaption: string;
  podiumStatus: string;
  pulseDurationMs: number;
  seats: readonly StudentSeatViewModel[];
  showConfirmationButton: boolean;
  turnLabel: string;
};

type BuildPodiumViewModelOptions = {
  activeSeat: ClassroomActiveSeat;
  bobbyScriptLine: BobbyScriptLine | null;
  participationState: ParticipationState;
  phase: ClassroomOrchestratorPhase;
  rewardVisible: boolean;
  stageId: GuidedStageId;
};

export function buildPodiumViewModel({
  activeSeat,
  bobbyScriptLine,
  participationState,
  phase,
  rewardVisible,
  stageId,
}: BuildPodiumViewModelOptions): PodiumViewModel {
  const showConfirmationButton = activeSeat === 'me' && phase === 'student_wait';

  return {
    confirmationButtonLabel: showConfirmationButton
      ? getConfirmationButtonLabel(stageId)
      : null,
    liveAvatarAlt: getLiveAvatarAlt(activeSeat),
    liveAvatarSrc:
      activeSeat === 'ai'
        ? '/avatars/student-bobby.svg'
        : '/avatars/reward-student.svg',
    podiumCaption: getPodiumCaption(phase, rewardVisible, stageId),
    podiumStatus: getPodiumStatus({
      bobbyScriptLine,
      participationState,
      phase,
      rewardVisible,
      stageId,
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
    showConfirmationButton,
    turnLabel: showConfirmationButton ? 'Your turn' : 'Podium',
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
  stageId: GuidedStageId,
) {
  if (rewardVisible) {
    return 'Reward time';
  }

  switch (phase) {
    case 'teacher_prompt':
      return stageId === 'picture-talk'
        ? 'Look first. Answer next.'
        : 'Listen first. Bobby goes next.';
    case 'ai_model':
      return 'Bobby is modeling';
    case 'student_wait':
      return stageId === 'picture-talk' ? 'Look and answer' : 'Your turn to say it';
    case 'teacher_encourage':
      return stageId === 'picture-talk'
        ? 'Try one more answer'
        : 'Say it with Cora';
    case 'teacher_echo':
      return 'Teacher is helping';
    case 'teacher_feedback':
      return 'Cora is wrapping this turn';
    case 'move_next':
      return 'Next picture';
    case 'wrap_up':
      return 'Class closing';
    default:
      return 'Class in progress';
  }
}

function getPodiumStatus({
  bobbyScriptLine,
  participationState,
  phase,
  rewardVisible,
  stageId,
}: Omit<BuildPodiumViewModelOptions, 'activeSeat'>) {
  if (rewardVisible) {
    return 'Great job, brave voice.';
  }

  if (phase === 'ai_model' && bobbyScriptLine) {
    return bobbyScriptLine.hintLabel;
  }

  switch (phase) {
    case 'teacher_prompt':
      return stageId === 'picture-talk'
        ? 'Look carefully. A question is coming.'
        : 'Listen first. Your turn is coming.';
    case 'student_wait':
      return stageId === 'picture-talk'
        ? 'Look at the picture and answer.'
        : 'Listen and say it back.';
    case 'teacher_encourage':
      return stageId === 'picture-talk'
        ? 'Take a breath. Answer one more time.'
        : 'Cora is helping you start.';
    case 'teacher_echo':
      return stageId === 'picture-talk'
        ? 'Thanks for trying. Let us keep going.'
        : 'Say it together with Cora.';
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

function getConfirmationButtonLabel(stageId: GuidedStageId) {
  return stageId === 'picture-talk' ? 'I answered' : 'I said it';
}
