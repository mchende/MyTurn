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
  Exclude<ClassroomOrchestratorPhase, 'teacher_prompt' | 'teacher_encourage' | 'teacher_echo'>,
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
  student_wait: [
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
  teacher_echo: ['Listen and copy the sound.', 'Follow the teacher voice.'],
  teacher_feedback: ['The teacher is cheering for you.', 'Keep the class rhythm.'],
  move_next: ['The board is changing.', 'Get ready for the next picture.'],
  wrap_up: ['Class is closing now.', 'Time to wave goodbye.'],
};

export function getTeacherScriptLine({
  attemptIndex,
  currentItemIndex,
  phase,
  participationState,
  stageId,
  targetText,
}: TeacherScriptRequest): TeacherScriptLine {
  const variant = resolveStageAwareVariant({
    attemptIndex,
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

  if (phase === 'teacher_encourage') {
    return stageId === 'repeat-after-teacher'
      ? getRepeatAfterTeacherEncourage(targetText, currentItemIndex)
      : getPictureTalkSecondPrompt(
          attemptIndex,
          currentItemIndex,
          participationState,
        );
  }

  if (phase === 'teacher_echo') {
    return stageId === 'repeat-after-teacher'
      ? getRepeatAfterTeacherEcho(targetText, currentItemIndex)
      : {
          hintLabel: 'Keep going',
          spokenModel: 'Thanks for trying. Let us keep going.',
          visibleCaption: 'Thanks for trying. Let us keep going.',
        };
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

function getPictureTalkSecondPrompt(
  attemptIndex: number,
  currentItemIndex: number,
  participationState: ParticipationState,
): TeacherScriptVariant {
  const visibleCaption =
    attemptIndex > 0 || participationState === 'silent'
      ? 'Take a breath. Answer one more time.'
      : 'Answer one more time.';

  return pickVariant(
    [
      {
        hintLabel: 'Try again',
        spokenModel: 'Take a look. What is it?',
        visibleCaption,
      },
      {
        hintLabel: 'One more answer',
        spokenModel: 'Look carefully. What do you see?',
        visibleCaption,
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

function formatDebugTargetText(targetText: string) {
  return targetText.trim().toUpperCase();
}
