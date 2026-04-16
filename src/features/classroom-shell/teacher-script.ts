import type { ClassroomOrchestratorPhase } from './classroom-orchestrator';

type TeacherScriptVariant = {
  hintLabel: string;
  spokenLine: string;
};

export type TeacherScriptRequest = {
  currentItemIndex: number;
  phase: ClassroomOrchestratorPhase;
  targetText: string;
};

export type TeacherScriptLine = TeacherScriptVariant & {
  debugTargetText: string;
};

const SCRIPT_VARIANTS: Record<
  ClassroomOrchestratorPhase,
  readonly TeacherScriptVariant[]
> = {
  teacher_prompt: [
    {
      hintLabel: 'Look first',
      spokenLine: "It's your turn. Look at the picture and get ready.",
    },
    {
      hintLabel: 'Eyes on the board',
      spokenLine: 'Watch the picture. Your mouth is ready next.',
    },
    {
      hintLabel: 'Get ready',
      spokenLine: 'My eyes are on you. Take a breath and begin.',
    },
  ],
  ai_model: [
    {
      hintLabel: 'Listen to Bobby',
      spokenLine: 'Listen to Bobby first. Then you try.',
    },
    {
      hintLabel: 'Hear the model',
      spokenLine: 'Bobby goes first. Use your listening ears.',
    },
  ],
  student_wait: [
    {
      hintLabel: 'Your voice now',
      spokenLine: 'Your mic is ready. I am listening.',
    },
    {
      hintLabel: 'Say it now',
      spokenLine: 'You can do it. Say it when you are ready.',
    },
  ],
  teacher_encourage: [
    {
      hintLabel: 'Try with me',
      spokenLine: "Let's say it together. Nice and slow.",
    },
    {
      hintLabel: 'One more try',
      spokenLine: "Let's say it together. Come with me.",
    },
    {
      hintLabel: 'Big brave voice',
      spokenLine: 'Take a brave breath. We can say it as a team.',
    },
  ],
  teacher_echo: [
    {
      hintLabel: 'Hear the echo',
      spokenLine: 'Listen to my echo. Then match my voice.',
    },
    {
      hintLabel: 'Copy the sound',
      spokenLine: 'Hear my smooth voice. Copy it with me.',
    },
  ],
  teacher_feedback: [
    {
      hintLabel: 'Celebrate',
      spokenLine: 'Good job. That was a strong try.',
    },
    {
      hintLabel: 'Keep going',
      spokenLine: 'Nice work. Your voice sounded brave.',
    },
    {
      hintLabel: 'Teacher smile',
      spokenLine: 'Yes. I heard you trying carefully.',
    },
  ],
  move_next: [
    {
      hintLabel: 'Move on',
      spokenLine: 'Next one. Eyes back to the board.',
    },
    {
      hintLabel: 'Keep the rhythm',
      spokenLine: 'Next one. Stay with me and look.',
    },
  ],
  wrap_up: [
    {
      hintLabel: 'Class done',
      spokenLine: 'Class is all done. See you next time.',
    },
    {
      hintLabel: 'Wave goodbye',
      spokenLine: 'You worked hard today. Wave goodbye.',
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
  currentItemIndex,
  phase,
  targetText,
}: TeacherScriptRequest): TeacherScriptLine {
  const variant = pickVariant(SCRIPT_VARIANTS[phase], currentItemIndex);

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

function formatDebugTargetText(targetText: string) {
  return targetText.trim().toUpperCase();
}
