'use client';

import { useEffect, useReducer } from 'react';

import type { Lesson } from '@/features/lesson-config/lesson-schema';

import { getBobbyScriptLine } from './bobby-script';
import {
  LESSON_COMPLETE_HOLD_MS,
  CLASSROOM_TIMINGS,
  classroomOrchestratorReducer,
  createInitialClassroomState,
  type ClassroomOrchestratorEvent,
  type GuidedStageId,
  type ParticipationState,
  type StudentAttemptSource,
} from './classroom-orchestrator';
import { buildCanonicalManualTranscript } from './classroom-judgment';
import { buildPodiumViewModel } from './podium-view-model';
import { getTeacherScriptLine } from './teacher-script';

type UseClassroomOrchestratorOptions = {
  lesson: Lesson;
  showReward?: boolean;
};

type SubmitStudentAttemptInput = {
  transcript?: string | null;
  source?: StudentAttemptSource;
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
    if (state.phase === 'lesson_complete') {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch(getScheduledEvent(state.phase));
    }, CLASSROOM_TIMINGS[state.phase]);

    return () => window.clearTimeout(timer);
  }, [state.phase]);

  const teacherScriptLine = getTeacherScriptLine({
    attemptIndex: state.attemptIndex,
    currentItem: state.currentItem,
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
    attemptIndex: state.attemptIndex,
    bobbyScriptLine,
    participationState: state.participationState,
    phase: state.phase,
    rewardVisible: state.rewardVisible,
    stageId: state.currentStageId,
  });

  const submitStudentAttempt = (input: SubmitStudentAttemptInput = {}) => {
    dispatch({
      type: 'student_attempt_submitted',
      transcript: input.transcript ?? null,
      source: input.source ?? 'manual',
    });
  };

  return {
    ...state,
    bobbyScriptLine,
    completionHoldMs: LESSON_COMPLETE_HOLD_MS,
    isLessonComplete: state.phase === 'lesson_complete',
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
      if (showReward) {
        dispatch({ type: 'reward_visibility_changed', visible: true });
      }
    },
    hideReward: () => {
      if (showReward) {
        dispatch({ type: 'reward_visibility_changed', visible: false });
      }
    },
    submitStudentAttempt,
    confirmStudentParticipation: () => {
      submitStudentAttempt({
        source: 'manual',
        transcript: buildCanonicalManualTranscript({
          currentItem: state.currentItem,
          stageId: state.currentStageId,
        }),
      });
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
  phase: keyof typeof CLASSROOM_TIMINGS | 'lesson_complete';
  stageId: GuidedStageId;
}) {
  if (phase === 'lesson_complete') {
    return 'Class complete';
  }

  if (phase === 'completion_reward') {
    return rewardVisible ? 'Reward time' : 'Class complete';
  }

  if (phase === 'warmup') {
    return 'Class warmup';
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
  phase: keyof typeof CLASSROOM_TIMINGS | 'lesson_complete';
  participationState: ParticipationState;
  stageId: GuidedStageId;
  turnResolution: 'idle' | 'retry' | 'pass' | 'fallback';
}) {
  switch (phase) {
    case 'warmup':
      return 'Class warmup. Cora is getting everyone ready.';
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
        return 'Look again. I will make it smaller.';
      }

      return 'Cora is helping you start again.';
    case 'teacher_fallback_model':
      return 'Listen once more. Then say it with Cora.';
    case 'teacher_echo':
      return 'Say it with Cora, then we go on.';
    case 'teacher_feedback':
      return turnResolution === 'pass'
        ? 'Cora gives a short feedback.'
        : 'Cora keeps the class moving.';
    case 'move_next':
      return 'Eyes on the next picture.';
    case 'wrap_up':
      return 'Class is done. Time to wave goodbye.';
    case 'completion_reward':
      return 'Great job. Class is wrapping up.';
    case 'lesson_complete':
      return 'Class complete. See you next time.';
    default:
      return '';
  }
}

function getScheduledEvent(
  phase: keyof typeof CLASSROOM_TIMINGS,
): ClassroomOrchestratorEvent {
  if (phase === 'student_wait') {
    return { type: 'student_silent_timeout' };
  }

  if (phase === 'teacher_echo') {
    return { type: 'teacher_echo_complete' };
  }

  return { type: 'phase_timer_completed' };
}
