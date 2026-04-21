import type { LessonItem } from '@/features/lesson-config/lesson-schema';
import type {
  ClassroomOrchestratorPhase,
  GuidedStageId,
  ParticipationState,
} from './classroom-orchestrator';

type TeacherScriptVariant = {
  hintLabel: string;
  spokenModel: string;
  visibleCaption: string;
};

export type TeacherScriptRequest = {
  attemptIndex: number;
  currentItem?: LessonItem;
  currentItemIndex: number;
  phase: ClassroomOrchestratorPhase;
  participationState: ParticipationState;
  stageId: GuidedStageId;
  targetText: string;
};

export type TeacherScriptLine = TeacherScriptVariant & {
  debugTargetText: string;
};

const SHARED_VARIANTS: Record<
  Exclude<
    ClassroomOrchestratorPhase,
    | 'teacher_prompt'
    | 'student_wait'
    | 'teacher_encourage'
    | 'teacher_fallback_model'
    | 'teacher_echo'
  >,
  readonly TeacherScriptVariant[]
> = {
  ai_model: [
    {
      hintLabel: 'Listen to Bobby',
      spokenModel: 'Listen to Bobby first. Then it is your turn.',
      visibleCaption: 'Listen to Bobby first. Then it is your turn.',
    },
    {
      hintLabel: 'Hear the model',
      spokenModel: 'Bobby goes first. Use your listening ears.',
      visibleCaption: 'Bobby goes first. Use your listening ears.',
    },
  ],
  teacher_feedback: [
    {
      hintLabel: 'Celebrate',
      spokenModel: 'Good job. That was a strong try.',
      visibleCaption: 'Good job. That was a strong try.',
    },
    {
      hintLabel: 'Keep going',
      spokenModel: 'Nice work. Your voice sounded brave.',
      visibleCaption: 'Nice work. Your voice sounded brave.',
    },
    {
      hintLabel: 'Teacher smile',
      spokenModel: 'Yes. I heard you trying carefully.',
      visibleCaption: 'Yes. I heard you trying carefully.',
    },
  ],
  move_next: [
    {
      hintLabel: 'Move on',
      spokenModel: 'Next one. Eyes back to the board.',
      visibleCaption: 'Next one. Eyes back to the board.',
    },
    {
      hintLabel: 'Keep the rhythm',
      spokenModel: 'Next one. Stay with me and look.',
      visibleCaption: 'Next one. Stay with me and look.',
    },
  ],
  wrap_up: [
    {
      hintLabel: 'Class done',
      spokenModel: 'Class is all done. See you next time.',
      visibleCaption: 'Class is all done. See you next time.',
    },
    {
      hintLabel: 'Wave goodbye',
      spokenModel: 'You worked hard today. Wave goodbye.',
      visibleCaption: 'You worked hard today. Wave goodbye.',
    },
  ],
};

const PHASE_HINTS: Record<ClassroomOrchestratorPhase, readonly string[]> = {
  teacher_prompt: ['Look at the picture.', 'Get your voice ready.'],
  ai_model: ['Listen before you speak.', 'Bobby shows one first.'],
  student_wait: ['Your turn to talk.', 'Speak when you feel ready.'],
  teacher_encourage: ['We can try together.', 'Take one brave try.'],
  teacher_fallback_model: ['Listen once more.', 'Cora will model once more.'],
  teacher_echo: ['Listen and copy the sound.', 'Follow the teacher voice.'],
  teacher_feedback: ['The teacher is cheering for you.', 'Keep the class rhythm.'],
  move_next: ['The board is changing.', 'Get ready for the next picture.'],
  wrap_up: ['Class is closing now.', 'Time to wave goodbye.'],
};

export function getTeacherScriptLine({
  attemptIndex,
  currentItem,
  currentItemIndex,
  phase,
  participationState,
  stageId,
  targetText,
}: TeacherScriptRequest): TeacherScriptLine {
  const variant = resolveStageAwareVariant({
    attemptIndex,
    currentItem,
    currentItemIndex,
    phase,
    participationState,
    stageId,
    targetText,
  });

  return {
    ...variant,
    debugTargetText: formatDebugTargetText(targetText),
  };
}

export function getTeacherHint(
  phase: ClassroomOrchestratorPhase,
  currentItemIndex = 0,
) {
  return pickVariant(PHASE_HINTS[phase], currentItemIndex);
}

function pickVariant<T>(variants: readonly T[], currentItemIndex: number): T {
  return variants[currentItemIndex % variants.length];
}

function resolveStageAwareVariant({
  attemptIndex,
  currentItem,
  currentItemIndex,
  phase,
  participationState,
  stageId,
  targetText,
}: TeacherScriptRequest): TeacherScriptVariant {
  if (phase === 'teacher_prompt') {
    return stageId === 'repeat-after-teacher'
      ? getRepeatAfterTeacherPrompt(targetText)
      : getPictureTalkPrompt(currentItemIndex);
  }

  if (phase === 'student_wait') {
    return stageId === 'repeat-after-teacher'
      ? getRepeatAfterTeacherStudentWait(currentItemIndex)
      : getPictureTalkStudentWait(attemptIndex, currentItemIndex);
  }

  if (phase === 'teacher_encourage') {
    return stageId === 'repeat-after-teacher'
      ? getRepeatAfterTeacherEncourage(targetText, currentItemIndex)
      : getPictureTalkObserveOrCloseout(
          attemptIndex,
          currentItemIndex,
          participationState,
        );
  }

  if (phase === 'teacher_fallback_model') {
    return stageId === 'repeat-after-teacher'
      ? getRepeatFallbackModel(currentItem, targetText, currentItemIndex)
      : getPictureFallbackModel(currentItem, currentItemIndex);
  }

  if (phase === 'teacher_echo') {
    return getFinalFollowLine(currentItemIndex);
  }

  return pickVariant(SHARED_VARIANTS[phase], currentItemIndex);
}

function getRepeatAfterTeacherPrompt(targetText: string): TeacherScriptVariant {
  return {
    hintLabel: 'Listen and say',
    spokenModel: targetText.trim(),
    visibleCaption: 'Listen first. Then it is your turn.',
  };
}

function getPictureTalkPrompt(currentItemIndex: number): TeacherScriptVariant {
  return pickVariant(
    [
      {
        hintLabel: 'Look and answer',
        spokenModel: 'What is it?',
        visibleCaption: 'Look at the picture and answer.',
      },
      {
        hintLabel: 'Tell me',
        spokenModel: 'What do you see?',
        visibleCaption: 'Look at the picture and answer.',
      },
    ],
    currentItemIndex,
  );
}

function getRepeatAfterTeacherEncourage(
  targetText: string,
  currentItemIndex: number,
): TeacherScriptVariant {
  return pickVariant(
    [
      {
        hintLabel: 'Try with me',
        spokenModel: `Say it with me: ${targetText.trim()}.`,
        visibleCaption: 'Say it with me. Nice and slow.',
      },
      {
        hintLabel: 'One more try',
        spokenModel: `Come with me: ${targetText.trim()}.`,
        visibleCaption: 'One more try. Nice and slow.',
      },
    ],
    currentItemIndex,
  );
}

function getRepeatAfterTeacherStudentWait(
  currentItemIndex: number,
): TeacherScriptVariant {
  return pickVariant(
    [
      {
        hintLabel: 'Your voice now',
        spokenModel: 'Your voice is ready. I am listening.',
        visibleCaption: 'Your voice is ready. I am listening.',
      },
      {
        hintLabel: 'Say it now',
        spokenModel: 'Say it when you are ready.',
        visibleCaption: 'Say it when you are ready.',
      },
    ],
    currentItemIndex,
  );
}

function getPictureTalkObserveOrCloseout(
  attemptIndex: number,
  currentItemIndex: number,
  participationState: ParticipationState,
): TeacherScriptVariant {
  if (attemptIndex > 0 && participationState === 'silent') {
    return {
      hintLabel: 'Keep going',
      spokenModel: 'Thanks for trying. Let us keep going.',
      visibleCaption: 'Thanks for trying. Let us keep going.',
    };
  }

  return getPictureTalkObserveHint(currentItemIndex);
}

function getPictureTalkObserveHint(currentItemIndex: number): TeacherScriptVariant {
  return pickVariant(
    [
      {
        hintLabel: 'Look closely',
        spokenModel: 'Look closely. What do you notice?',
        visibleCaption: 'Look closely. What do you notice?',
      },
      {
        hintLabel: 'Look closely',
        spokenModel: 'Look closely. What do you notice?',
        visibleCaption: 'Look closely. What do you notice?',
      },
    ],
    currentItemIndex,
  );
}

function getPictureTalkStudentWait(
  attemptIndex: number,
  currentItemIndex: number,
): TeacherScriptVariant {
  if (attemptIndex > 0) {
    return getPictureTalkNarrowedPrompt(currentItemIndex);
  }

  return pickVariant(
    [
      {
        hintLabel: 'Your voice now',
        spokenModel: 'Your voice is ready. I am listening.',
        visibleCaption: 'Your voice is ready. I am listening.',
      },
      {
        hintLabel: 'Say it now',
        spokenModel: 'Say it when you are ready.',
        visibleCaption: 'Say it when you are ready.',
      },
    ],
    currentItemIndex,
  );
}

function getPictureTalkNarrowedPrompt(
  currentItemIndex: number,
): TeacherScriptVariant {
  return pickVariant(
    [
      {
        hintLabel: 'Smaller question',
        spokenModel: 'Look again and choose. What do you see now?',
        visibleCaption: 'Look again and choose.',
      },
      {
        hintLabel: 'Smaller question',
        spokenModel: 'Look again and choose. What do you see now?',
        visibleCaption: 'Look again and choose.',
      },
    ],
    currentItemIndex,
  );
}

function getRepeatAfterTeacherEcho(
  targetText: string,
  currentItemIndex: number,
): TeacherScriptVariant {
  return pickVariant(
    [
      {
        hintLabel: 'Hear the echo',
        spokenModel: `Listen and copy: ${targetText.trim()}.`,
        visibleCaption: 'Listen and copy the sound.',
      },
      {
        hintLabel: 'Copy the sound',
        spokenModel: `Match my voice: ${targetText.trim()}.`,
        visibleCaption: 'Copy the teacher voice.',
      },
    ],
    currentItemIndex,
  );
}

function getRepeatFallbackModel(
  currentItem: LessonItem | undefined,
  targetText: string,
  currentItemIndex: number,
): TeacherScriptVariant {
  const model = currentItem?.repeatAccepts?.[0] ?? targetText.trim();

  return pickVariant(
    [
      {
        hintLabel: 'Listen once more',
        spokenModel: `Listen once more: ${model}.`,
        visibleCaption: 'Listen once more. Then say it with me.',
      },
      {
        hintLabel: 'Hear it again',
        spokenModel: `Hear it again: ${model}.`,
        visibleCaption: 'Listen once more. Then say it with me.',
      },
    ],
    currentItemIndex,
  );
}

function getPictureFallbackModel(
  currentItem: LessonItem | undefined,
  currentItemIndex: number,
): TeacherScriptVariant {
  const fallbackModel =
    currentItem?.pictureTalk?.fallbackModel ?? `It is ${currentItem?.text ?? 'it'}.`;

  return pickVariant(
    [
      {
        hintLabel: 'Listen once more',
        spokenModel: fallbackModel,
        visibleCaption: 'Listen once more. Then say it with me.',
      },
      {
        hintLabel: 'Hear it again',
        spokenModel: fallbackModel,
        visibleCaption: 'Listen once more. Then say it with me.',
      },
    ],
    currentItemIndex,
  );
}

function getFinalFollowLine(currentItemIndex: number): TeacherScriptVariant {
  return pickVariant(
    [
      {
        hintLabel: 'Say it with Cora',
        spokenModel: 'Say it with Cora, then we go on.',
        visibleCaption: 'Say it with Cora, then we go on.',
      },
      {
        hintLabel: 'One last say',
        spokenModel: 'Say it with Cora, then we go on.',
        visibleCaption: 'Say it with Cora, then we go on.',
      },
    ],
    currentItemIndex,
  );
}

function formatDebugTargetText(targetText: string) {
  return targetText.trim().toUpperCase();
}
