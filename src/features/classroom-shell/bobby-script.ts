import type {
  ClassroomOrchestratorPhase,
  GuidedStageId,
} from './classroom-orchestrator';

type BobbyPersona = {
  allowedPhases: readonly ClassroomOrchestratorPhase[];
  displayName: string;
  role: 'ai_classmate';
  tone: 'mildly_hesitant_classmate';
};

type BobbyScriptVariant = {
  hintLabel: string;
  spokenTemplate: (targetText: string) => string;
};

type BobbyScriptRequest = {
  currentItemIndex: number;
  phase: ClassroomOrchestratorPhase;
  stageId: GuidedStageId;
  targetText: string;
};

export type BobbyScriptLine = {
  audioCueKey: string;
  audioSpeaker: 'bobby';
  hesitationBeatMs: number;
  hintLabel: string;
  leadInPauseMs: number;
  persona: BobbyPersona['tone'];
  spokenLine: string;
  tailPauseMs: number;
};

export const BOBBY_PERSONA: BobbyPersona = {
  allowedPhases: ['ai_model'],
  displayName: 'Bobby 同学',
  role: 'ai_classmate',
  tone: 'mildly_hesitant_classmate',
};

export const BOBBY_RESPONSE_ENVELOPE = {
  leadInPauseMs: 180,
  hesitationBeatMs: 240,
  hesitationToken: 'uh',
  tailPauseMs: 120,
} as const;

const BOBBY_SCRIPT_VARIANTS: readonly BobbyScriptVariant[] = [
  {
    hintLabel: 'Bobby goes first',
    spokenTemplate: (targetText) => `Uh... ${targetText.toUpperCase()}!`,
  },
  {
    hintLabel: 'Listen to Bobby',
    spokenTemplate: (targetText) => `Um, ${targetText.toUpperCase()}!`,
  },
  {
    hintLabel: 'Bobby shows one',
    spokenTemplate: (targetText) => `Uh... I think it's ${targetText.toUpperCase()}!`,
  },
];

export function getBobbyScriptLine({
  currentItemIndex,
  phase,
  stageId,
  targetText,
}: BobbyScriptRequest): BobbyScriptLine | null {
  if (
    stageId !== 'repeat-after-teacher' ||
    !BOBBY_PERSONA.allowedPhases.includes(phase)
  ) {
    return null;
  }

  const variant =
    BOBBY_SCRIPT_VARIANTS[currentItemIndex % BOBBY_SCRIPT_VARIANTS.length];

  return {
    audioCueKey: `bobby:${stageId}:${phase}:${currentItemIndex}`,
    audioSpeaker: 'bobby',
    hesitationBeatMs: BOBBY_RESPONSE_ENVELOPE.hesitationBeatMs,
    hintLabel: variant.hintLabel,
    leadInPauseMs: BOBBY_RESPONSE_ENVELOPE.leadInPauseMs,
    persona: BOBBY_PERSONA.tone,
    spokenLine: variant.spokenTemplate(targetText.trim()),
    tailPauseMs: BOBBY_RESPONSE_ENVELOPE.tailPauseMs,
  };
}
