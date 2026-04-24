'use client';

import { useEffect, useRef, useState } from 'react';

import {
  createClassroomAudioRuntime,
  type ClassroomAudioCue,
  type ClassroomAudioErrorReason,
  type ClassroomAudioRuntime,
  type ClassroomAudioSnapshot,
} from './classroom-audio-runtime';
import {
  createSpeechSynthesisAudioService,
  type ClassroomAudioService,
} from './classroom-audio-service';
import type { BobbyScriptLine } from './bobby-script';
import type {
  ClassroomActiveSeat,
  ClassroomOrchestratorPhase,
  GuidedStageId,
} from './classroom-orchestrator';
import type { TeacherScriptLine } from './teacher-script';

export type ClassroomAudioRuntimeOverrides = {
  MediaRecorderCtor?: typeof MediaRecorder | null;
  audioService?: ClassroomAudioService;
  getUserMedia?: ((constraints: MediaStreamConstraints) => Promise<MediaStream>) | null;
  queryPermission?: (
    descriptor: PermissionDescriptor & { name: 'microphone' },
  ) => Promise<{
    state: 'prompt' | 'granted' | 'denied';
  }> | null;
  transcriptTimeoutMs?: number;
};

type UseClassroomAudioRuntimeOptions = {
  activeSeat: ClassroomActiveSeat;
  bobbyScriptLine: BobbyScriptLine | null;
  forcePreflight?: boolean;
  onRecordingAccepted: () => void;
  phase: ClassroomOrchestratorPhase;
  runtimeOverrides?: ClassroomAudioRuntimeOverrides;
  stageId: GuidedStageId;
  teacherScriptLine: TeacherScriptLine;
};

export function useClassroomAudioRuntime({
  activeSeat,
  bobbyScriptLine,
  forcePreflight = false,
  onRecordingAccepted,
  phase,
  runtimeOverrides,
  stageId,
  teacherScriptLine,
}: UseClassroomAudioRuntimeOptions) {
  const [hasHydrated, setHasHydrated] = useState(forcePreflight);
  const audioSupported = hasHydrated && canUseClassroomAudio(runtimeOverrides);
  const shouldUseAudioRuntime = forcePreflight || audioSupported;
  const runtimeRef = useRef<ClassroomAudioRuntime | null>(null);
  const activeCueKeyRef = useRef<string | null>(null);
  const [snapshot, setSnapshot] = useState(createIdleSnapshot);
  const [preflightDismissed, setPreflightDismissed] = useState(
    !shouldUseAudioRuntime,
  );
  const [preflightWarning, setPreflightWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) {
      setHasHydrated(true);
    }
  }, [hasHydrated]);

  useEffect(() => {
    if (shouldUseAudioRuntime) {
      setPreflightDismissed(false);
      setPreflightWarning(null);
      return;
    }

    setPreflightDismissed(true);

    if (hasHydrated && !forcePreflight) {
      setPreflightWarning('Audio checks are unavailable in this browser.');
    }
  }, [forcePreflight, hasHydrated, shouldUseAudioRuntime]);

  if (!runtimeRef.current && shouldUseAudioRuntime) {
    runtimeRef.current = createClassroomAudioRuntime({
      MediaRecorderCtor:
        runtimeOverrides?.MediaRecorderCtor ??
        (typeof MediaRecorder === 'undefined' ? null : MediaRecorder),
      audioService:
        runtimeOverrides?.audioService ?? createSpeechSynthesisAudioService(),
      getUserMedia:
        runtimeOverrides?.getUserMedia ??
        (navigator.mediaDevices?.getUserMedia
          ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
          : null),
      queryPermission:
        runtimeOverrides?.queryPermission ??
        (navigator.permissions?.query
          ? navigator.permissions.query.bind(navigator.permissions)
          : null),
      transcriptTimeoutMs: runtimeOverrides?.transcriptTimeoutMs,
    });
  }

  useEffect(() => {
    if (!runtimeRef.current) {
      return;
    }

    setSnapshot(runtimeRef.current.getSnapshot());

    return runtimeRef.current.subscribe((nextSnapshot) => {
      setSnapshot(nextSnapshot);
    });
  }, []);

  useEffect(() => {
    return () => {
      runtimeRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!runtimeRef.current || preflightDismissed === false) {
      return;
    }

    const cue = resolvePhaseCue({
      bobbyScriptLine,
      phase,
      stageId,
      teacherScriptLine,
    });

    if (!cue) {
      activeCueKeyRef.current = null;
      return;
    }

    if (snapshot.status === 'recording_student') {
      return;
    }

    if (activeCueKeyRef.current === cue.cueKey) {
      return;
    }

    activeCueKeyRef.current = cue.cueKey;
    void runtimeRef.current.playCue(cue).catch(() => {});
  }, [
    bobbyScriptLine,
    phase,
    preflightDismissed,
    snapshot.status,
    stageId,
    teacherScriptLine,
  ]);

  useEffect(() => {
    if (
      !preflightDismissed &&
      snapshot.preflight.speakerReady &&
      snapshot.preflight.microphoneReady
    ) {
      setPreflightDismissed(true);
      setPreflightWarning(null);
    }
  }, [preflightDismissed, snapshot.preflight.microphoneReady, snapshot.preflight.speakerReady]);

  const studentTurnActive =
    activeSeat === 'me' && (phase === 'student_wait' || phase === 'teacher_echo');
  const audioModeActive = shouldUseAudioRuntime && preflightDismissed;
  const showRecordingButton =
    studentTurnActive &&
    ((audioModeActive && snapshot.transcriptStatus !== 'waiting') ||
      snapshot.retryableStep === 'recording');
  const controlButtonLabel = showRecordingButton
    ? getRecordingButtonLabel(snapshot.retryableStep, snapshot.status)
    : null;

  const maybeDismissPreflight = () => {
    const nextSnapshot = runtimeRef.current?.getSnapshot();

    if (
      nextSnapshot?.preflight.speakerReady &&
      nextSnapshot.preflight.microphoneReady
    ) {
      setPreflightDismissed(true);
      setPreflightWarning(null);
    }
  };

  return {
    audioEnabled: shouldUseAudioRuntime,
    audioModeActive,
    audioStateLabel: getAudioStateLabel(snapshot),
    controlButtonLabel,
    preflightActions: {
      checkMicrophone: async () => {
        if (!runtimeRef.current) {
          return;
        }

        await runtimeRef.current.runMicrophoneCheck();
        maybeDismissPreflight();
      },
      checkSpeaker: async () => {
        if (!runtimeRef.current) {
          return;
        }

        await runtimeRef.current.playCue({
          cueKey: 'preflight-teacher-check',
          speaker: 'teacher',
          text: 'Hello. Can you hear Cora clearly?',
        });
        maybeDismissPreflight();
      },
      skip: () => {
        runtimeRef.current?.skipPreflight();
        setPreflightDismissed(true);
        setPreflightWarning('Audio check skipped. Sound or recording may not work.');
      },
    },
    preflightVisible: shouldUseAudioRuntime && !preflightDismissed,
    preflightWarning,
    recordingStatusLabel: getRecordingStatusLabel(
      snapshot.status,
      snapshot.lastError?.reason,
      snapshot.transcriptStatus,
    ),
    showDebugHud: process.env.NODE_ENV !== 'production' && audioModeActive,
    retryAudioStep: async () => {
      await runtimeRef.current?.retryLastStep();
    },
    runtimeSnapshot: snapshot,
    showRecordingButton,
    showRetryButton: Boolean(
      audioModeActive &&
        snapshot.lastError &&
        (snapshot.retryableStep === 'playback' ||
          snapshot.retryableStep === 'recording' ||
          snapshot.retryableStep === 'microphone-check'),
    ),
    showTeacherPlaybackPulse:
      snapshot.status === 'playing_teacher' || snapshot.status === 'playing_bobby',
    studentAction: async () => {
      if (!audioModeActive || !runtimeRef.current) {
        onRecordingAccepted();
        return;
      }

      if (snapshot.status === 'recording_student') {
        try {
          await runtimeRef.current.stopStudentRecording();
        } catch {
          // runtime snapshot already carries the retryable error state
        }
        return;
      }

      try {
        await runtimeRef.current.startStudentRecording();
      } catch {
        // runtime snapshot already carries the retryable error state
      }
    },
  };
}

function canUseClassroomAudio(
  runtimeOverrides?: ClassroomAudioRuntimeOverrides,
) {
  if (runtimeOverrides?.audioService && runtimeOverrides?.getUserMedia && runtimeOverrides?.MediaRecorderCtor) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return Boolean(
    window.speechSynthesis &&
      window.SpeechSynthesisUtterance &&
      navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== 'undefined',
  );
}

function resolvePhaseCue(input: {
  bobbyScriptLine: BobbyScriptLine | null;
  phase: ClassroomOrchestratorPhase;
  stageId: GuidedStageId;
  teacherScriptLine: TeacherScriptLine;
}): ClassroomAudioCue | null {
  if (
    input.phase === 'ai_model' &&
    input.stageId === 'repeat-after-teacher' &&
    input.bobbyScriptLine
  ) {
    return {
      cueKey: input.bobbyScriptLine.audioCueKey,
      pitch: 1.2,
      rate: 0.98,
      speaker: 'bobby',
      text: input.bobbyScriptLine.spokenLine,
    };
  }

  if (input.phase === 'student_wait') {
    return null;
  }

  return {
    cueKey: input.teacherScriptLine.audioCueKey,
    pitch: 1,
    rate: 0.94,
    speaker: 'teacher',
    text: input.teacherScriptLine.spokenModel,
  };
}

function getRecordingButtonLabel(
  retryableStep: ClassroomAudioSnapshot['retryableStep'],
  status: ClassroomAudioSnapshot['status'],
) {
  if (status === 'recording_student') {
    return 'Listening... tap again';
  }

  if (retryableStep === 'recording' || retryableStep === 'microphone-check') {
    return 'Try again';
  }

  return 'Tap to talk';
}

function getAudioStateLabel(
  snapshot: ClassroomAudioSnapshot,
) {
  const { status } = snapshot;

  if (snapshot.transcriptStatus === 'waiting') {
    return 'Cora is listening carefully';
  }

  if (status === 'playing_teacher') {
    return 'Cora is speaking';
  }

  if (status === 'playing_bobby') {
    return 'Bobby is speaking';
  }

  if (status === 'recording_student') {
    return 'Listening to your voice';
  }

  if (snapshot.lastError?.reason === 'playback_blocked') {
    return 'Tap retry to hear this line';
  }

  if (snapshot.lastError?.reason || snapshot.transcriptStatus === 'failed') {
    return 'Audio needs one more try';
  }

  return 'Audio ready';
}

function getRecordingStatusLabel(
  status: ClassroomAudioRuntime['getSnapshot'] extends () => infer T
    ? T['status']
    : never,
  lastErrorReason: ClassroomAudioErrorReason | undefined,
  transcriptStatus?: ClassroomAudioSnapshot['transcriptStatus'],
) {
  if (transcriptStatus === 'waiting') {
    return 'One more second...';
  }

  if (transcriptStatus === 'failed') {
    return 'Let us try that once more.';
  }

  if (status === 'recording_student') {
    return 'Listening... tap again when you finish.';
  }

  if (lastErrorReason === 'recording_empty') {
    return 'No voice came through. Try again.';
  }

  if (
    lastErrorReason === 'microphone_denied' ||
    lastErrorReason === 'microphone_unavailable' ||
    lastErrorReason === 'microphone_insecure'
  ) {
    return 'Microphone needs a quick retry.';
  }

  return 'Tap to talk when Cora calls on you.';
}

function createIdleSnapshot() {
  return {
    canStartRecording: true,
    currentCue: null,
    currentSpeaker: null,
    lastError: null,
    lastRecording: null,
    preflight: {
      microphonePermission: 'unknown' as const,
      microphoneReady: false,
      skipped: false,
      speakerReady: false,
    },
    retryableStep: null,
    status: 'idle' as const,
    lastTranscript: null,
    transcriptFailureReason: null,
    transcriptLatencyMs: null,
    transcriptStatus: 'idle' as const,
  };
}
