'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings2, Sparkles, Volume2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Lesson } from '@/features/lesson-config/lesson-schema';

import { AudioPreflightCard } from './audio-preflight-card';
import { LessonBoard } from './lesson-board';
import type { PodiumViewModel } from './podium-view-model';
import { StudentSeatStrip } from './student-seat-strip';
import {
  useClassroomAudioRuntime,
  type ClassroomAudioRuntimeOverrides,
} from './use-classroom-audio-runtime';
import {
  LESSON_COMPLETE_HOLD_MS,
  useClassroomOrchestrator,
} from './use-classroom-orchestrator';

type ClassroomShellProps = {
  audioRuntimeOverrides?: ClassroomAudioRuntimeOverrides;
  forceAudioPreflight?: boolean;
  lesson: Lesson;
  sessionId: string;
  sessionTitle: string;
  sessionStatus: string;
  showReward?: boolean;
};

export function ClassroomShell({
  audioRuntimeOverrides,
  forceAudioPreflight = false,
  lesson,
  sessionId,
  sessionTitle,
  sessionStatus,
  showReward = false,
}: ClassroomShellProps) {
  const router = useRouter();
  const classroom = useClassroomOrchestrator({
    lesson,
    showReward,
  });
  const audio = useClassroomAudioRuntime({
    activeSeat: classroom.activeSeat,
    bobbyScriptLine: classroom.bobbyScriptLine,
    forcePreflight: forceAudioPreflight,
    onRecordingAccepted: classroom.confirmStudentParticipation,
    onSubmitStudentAttempt: classroom.submitStudentAttempt,
    phase: classroom.phase,
    runtimeOverrides: audioRuntimeOverrides,
    stageId: classroom.currentStageId,
    teacherScriptLine: classroom.teacherScriptLine,
  });

  useEffect(() => {
    if (classroom.phase !== 'lesson_complete') {
      return;
    }

    const timer = window.setTimeout(() => {
      router.replace(`/?completedSession=${sessionId}`, { scroll: false });
    }, LESSON_COMPLETE_HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [classroom.phase, router, sessionId]);

  if (audio.preflightVisible) {
    return (
      <main className="relative min-h-screen overflow-y-auto bg-[#0F172A] px-4 py-4 text-white lg:px-6 lg:py-6">
        <div className="absolute left-0 top-0 h-[36vh] w-[36vw] rounded-full bg-[#10B981]/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[30vh] w-[24vw] rounded-full bg-sky-500/8 blur-[120px]" />

        <div className="relative z-10 flex min-h-[calc(100vh-2rem)] flex-col gap-6">
          <header className="flex flex-wrap items-center justify-between gap-3 px-2 py-1 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-white shadow-lg shadow-emerald-500/20">
                <Sparkles className="h-6 w-6 fill-current" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-black tracking-[-0.05em]">MyTurn</h1>
                <p className="text-xs font-bold tracking-[0.16em] text-white/55">
                  {sessionTitle}
                </p>
              </div>
            </div>
            <p className="text-right text-xs font-bold tracking-[0.16em] text-white/55">
              {sessionStatus}
            </p>
          </header>

          <div className="flex flex-1 items-center justify-center py-4">
            <AudioPreflightCard
              message={audio.runtimeSnapshot.lastError?.message}
              microphoneReady={audio.runtimeSnapshot.preflight.microphoneReady}
              onCheckMicrophone={audio.preflightActions.checkMicrophone}
              onCheckSpeaker={audio.preflightActions.checkSpeaker}
              onSkip={audio.preflightActions.skip}
              speakerReady={audio.runtimeSnapshot.preflight.speakerReady}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-y-auto bg-[#0F172A] px-4 py-4 text-white lg:px-6 lg:py-6 xl:h-screen xl:overflow-hidden">
      <div className="absolute left-0 top-0 h-[36vh] w-[36vw] rounded-full bg-[#10B981]/8 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[30vh] w-[24vw] rounded-full bg-sky-500/8 blur-[120px]" />

      <div className="relative z-10 flex min-h-[calc(100vh-2rem)] flex-col gap-4 xl:h-full xl:min-h-0">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-2 py-1 sm:px-4 xl:h-20 xl:flex-nowrap xl:px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-6 w-6 fill-current" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-[-0.05em]">MyTurn</h1>
              <p className="sr-only">{sessionTitle}</p>
            </div>
          </div>

          <div className="order-3 w-full xl:order-none xl:flex-1">
            <StudentSeatStrip
              seats={classroom.podiumViewModel.seats}
              sessionId={sessionId}
            />
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3 xl:min-w-[220px]">
            <TopActionButton icon={Settings2} label="设置" />
            <TopActionButton icon={X} label="退出" />
          </div>
        </header>

        {audio.preflightWarning ? (
          <div
            className="mx-2 rounded-[28px] border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-50/90 sm:mx-4"
            data-testid="classroom-audio-warning"
          >
            {audio.preflightWarning}
          </div>
        ) : null}

        {audio.showDebugHud ? (
          <div
            className="mx-2 flex flex-wrap items-center gap-2 rounded-[22px] border border-white/8 bg-slate-950/45 px-4 py-2 text-[11px] font-medium text-white/68 sm:mx-4"
            data-testid="classroom-audio-debug"
          >
            <span data-testid="debug-transcript-status">
              transcript: {audio.runtimeSnapshot.transcriptStatus}
            </span>
            <span data-testid="debug-transcript-latency">
              latency: {audio.runtimeSnapshot.transcriptLatencyMs ?? 'n/a'}
            </span>
            <span data-testid="debug-transcript-reason">
              reason: {audio.runtimeSnapshot.transcriptFailureReason ?? 'none'}
            </span>
          </div>
        ) : null}

        <div className="flex flex-1 flex-col gap-4 xl:min-h-0 xl:flex-row xl:gap-6">
          <section className="min-w-0 xl:flex-[3]">
            <LessonBoard
              currentItem={classroom.currentItem}
              currentItemIndex={classroom.currentItemIndex}
              progressCount={classroom.progressCount}
              sessionStatus={sessionStatus}
              stageBadge={classroom.stageBadge}
              stagePrompt={classroom.stagePrompt}
            />
          </section>

          <aside
            className="grid w-full flex-none grid-cols-1 gap-4 md:grid-cols-2 xl:min-h-0 xl:max-w-[360px] xl:flex-1 xl:grid-cols-1 xl:content-start xl:overflow-y-auto"
            data-testid="classroom-side-panels"
          >
            <TeacherColumn
              audioEnabled={audio.audioEnabled}
              audioStateLabel={audio.audioStateLabel}
              hint={classroom.teacherHint}
              lastAudioError={audio.runtimeSnapshot.lastError?.message ?? null}
              message={classroom.teacherMessage}
              onRetryAudio={audio.retryAudioStep}
              showRetryButton={audio.showRetryButton && !audio.showRecordingButton}
              showTeacherPlaybackPulse={audio.showTeacherPlaybackPulse}
            />
            <PodiumColumn
              actionButtonLabel={
                audio.controlButtonLabel ??
                classroom.podiumViewModel.confirmationButtonLabel
              }
              audioModeActive={audio.audioModeActive}
              audioStateLabel={audio.audioStateLabel}
              onPrimaryAction={
                audio.showRecordingButton
                  ? () => void audio.studentAction()
                  : classroom.confirmStudentParticipation
              }
              podiumViewModel={classroom.podiumViewModel}
              recordingStatusLabel={audio.recordingStatusLabel}
              showPrimaryButton={
                audio.showRecordingButton ||
                classroom.podiumViewModel.showConfirmationButton
              }
            />
          </aside>
        </div>
      </div>

      <CelebrateOverlay show={showReward || classroom.rewardVisible} />
    </main>
  );
}

function TopActionButton({
  icon: Icon,
  label,
}: {
  icon: typeof Settings2;
  label: string;
}) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-bold text-white/90 backdrop-blur-md transition-all hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-xs"
      type="button"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function TeacherColumn({
  audioEnabled,
  audioStateLabel,
  hint,
  lastAudioError,
  message,
  onRetryAudio,
  showRetryButton,
  showTeacherPlaybackPulse,
}: {
  audioEnabled: boolean;
  audioStateLabel: string;
  hint: string;
  lastAudioError: string | null;
  message: string;
  onRetryAudio: () => Promise<void>;
  showRetryButton: boolean;
  showTeacherPlaybackPulse: boolean;
}) {
  return (
    <section className="relative min-h-[220px] overflow-hidden rounded-[40px] border-2 border-slate-700 bg-slate-800/80 p-5 sm:min-h-[240px] xl:flex-[0.8] xl:p-6">
      <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-[#10B981]/10 blur-2xl" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <motion.div
          animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.32)', '0 0 0 18px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0)'] }}
          className="relative mb-4 shrink-0 rounded-full bg-emerald-500/20 p-1.5"
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
        >
          <img
            alt="Cora 老师"
            className="block h-24 w-24 rounded-full bg-white object-contain shadow-xl sm:h-28 sm:w-28"
            src="/avatars/teacher-cora.svg"
          />
          <motion.div
            animate={{ scaleY: [0.45, 1, 0.55, 0.85], opacity: [0.65, 1, 0.8, 0.95] }}
            className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-end gap-1 rounded-full bg-[#10B981] px-3 py-2 shadow-lg shadow-emerald-500/30"
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          >
            <span className="h-3 w-1 rounded-full bg-white/80" />
            <span className="h-4 w-1 rounded-full bg-white" />
            <span className="h-2 w-1 rounded-full bg-white/80" />
          </motion.div>
        </motion.div>

        <p className="text-[24px] font-black italic tracking-[-0.05em] sm:text-[28px]">Cora 老师</p>
        {audioEnabled ? (
          <div className="mt-2 flex max-w-full flex-wrap items-center justify-center gap-2">
            <div
              className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold ${
                showTeacherPlaybackPulse
                  ? 'border-emerald-300/30 bg-emerald-400/12 text-emerald-50'
                  : 'border-white/10 bg-white/6 text-white/78'
              }`}
              data-testid="teacher-audio-status"
            >
              <Volume2 className="h-4 w-4" />
              <span className="truncate">{audioStateLabel}</span>
            </div>
            {showRetryButton ? (
              <button
                className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-2 text-[11px] font-bold text-white/82 transition hover:bg-white/10"
                data-testid="teacher-audio-retry"
                onClick={() => void onRetryAudio()}
                type="button"
              >
                Retry audio
              </button>
            ) : null}
          </div>
        ) : null}
        <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-3 py-2 text-[11px] font-bold text-[#10B981]">
          <Volume2 className="h-4 w-4" />
          <span className="truncate">{message}</span>
        </div>
        {lastAudioError ? (
          <p className="mt-3 max-w-xs text-center text-[11px] font-medium text-amber-100/85">
            {lastAudioError}
          </p>
        ) : null}
        <p className="mt-3 text-center text-[11px] font-bold tracking-[0.14em] text-white/45 sm:text-xs sm:tracking-[0.18em]">
          {hint}
        </p>
      </div>
    </section>
  );
}

function PodiumColumn({
  actionButtonLabel,
  audioModeActive,
  audioStateLabel,
  onPrimaryAction,
  podiumViewModel,
  recordingStatusLabel,
  showPrimaryButton,
}: {
  actionButtonLabel: string | null;
  audioModeActive: boolean;
  audioStateLabel: string;
  onPrimaryAction: () => void;
  podiumViewModel: PodiumViewModel;
  recordingStatusLabel: string;
  showPrimaryButton: boolean;
}) {
  const bars = [0.42, 0.62, 1, 0.72, 0.5];
  const isStudentTurn = podiumViewModel.seats.some(
    (seat) => seat.id === 'me' && seat.isOnStage,
  );
  const podiumStatus = isStudentTurn && audioModeActive
    ? recordingStatusLabel
    : audioModeActive && podiumViewModel.seats.some((seat) => seat.id === 'ai' && seat.isOnStage)
      ? audioStateLabel
      : podiumViewModel.podiumStatus;

  return (
    <section
      className={`relative min-h-[320px] overflow-hidden rounded-[40px] border-4 bg-slate-800 p-2 sm:min-h-[360px] xl:flex-1 ${
        isStudentTurn
          ? 'border-[#10B981] shadow-[0_0_40px_rgba(16,185,129,0.18)]'
          : 'border-white/15 shadow-[0_0_24px_rgba(15,23,42,0.32)]'
      }`}
    >
      <div className="absolute left-1/2 top-3 z-20 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-[#10B981] px-3 py-1 text-[10px] font-black text-white shadow-lg sm:px-4">
        {podiumViewModel.turnLabel}
      </div>

      <div className="relative flex h-full flex-col overflow-hidden rounded-[32px] bg-slate-900">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
          <motion.span
            animate={{ opacity: [0.45, 1, 0.45] }}
            className="h-2 w-2 rounded-full bg-red-500"
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/80">LIVE</span>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-20 pt-14 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.06),transparent_32%),linear-gradient(180deg,#111827_0%,#0b1220_100%)] sm:px-6 sm:pb-24">
          <div className="flex aspect-[4/5] w-full max-w-[220px] flex-col items-center justify-center rounded-[32px] border border-white/5 bg-[#162238] px-4 py-5">
            <AnimatePresence mode="wait">
              <motion.img
                alt={podiumViewModel.liveAvatarAlt}
                animate={{ opacity: 0.9, scale: 1 }}
                className="aspect-square h-auto w-[78%] max-w-[150px] object-contain"
                exit={{ opacity: 0, scale: 0.96 }}
                initial={{ opacity: 0, scale: 0.98 }}
                key={podiumViewModel.liveAvatarSrc}
                src={podiumViewModel.liveAvatarSrc}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              />
            </AnimatePresence>
            <div className="mt-4 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-white/65">
              {podiumViewModel.podiumCaption}
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-4 right-4 flex items-center justify-center sm:left-6 sm:right-6">
          <div className="flex flex-col items-center gap-3">
            <p
              className="max-w-full rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-center text-[11px] font-bold text-white/70"
              data-testid="podium-status"
            >
              {podiumStatus}
            </p>
            {showPrimaryButton && actionButtonLabel ? (
              <button
                className="inline-flex items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/15 px-5 py-2 text-center text-sm font-black tracking-[0.02em] text-emerald-50 shadow-[0_12px_24px_rgba(16,185,129,0.18)] transition hover:bg-emerald-400/25"
                data-testid="podium-primary-action"
                onClick={onPrimaryAction}
                type="button"
              >
                {actionButtonLabel}
              </button>
            ) : null}
          </div>
        </div>

        <div className="absolute bottom-6 left-5 right-5 flex h-12 items-end justify-center gap-1.5 sm:left-6 sm:right-6">
          {bars.map((bar, index) => (
            <motion.div
              animate={{ height: [`${Math.max(bar * 70, 20)}%`, `${Math.min(bar * 100 + 12, 100)}%`, `${Math.max(bar * 62, 24)}%`] }}
              className={index === 2 ? 'w-2 rounded-full bg-[#10B981] shadow-[0_0_15px_#10B981]' : 'w-2 rounded-full bg-[#10B981]'}
              key={`${bar}-${index}`}
              transition={{
                duration:
                  podiumViewModel.pulseDurationMs / 1000 + index * 0.08,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CelebrateOverlay({ show }: { show: boolean }) {
  const starPositions = [
    { top: '30%', left: '33%', size: '18px', delay: 0 },
    { top: '26%', left: '66%', size: '14px', delay: 0.1 },
    { top: '62%', left: '31%', size: '16px', delay: 0.2 },
    { top: '64%', left: '69%', size: '20px', delay: 0.3 },
    { top: '38%', left: '24%', size: '12px', delay: 0.18 },
    { top: '40%', left: '75%', size: '12px', delay: 0.25 },
  ];

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-[#0F172A]/70 backdrop-blur-[2px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {starPositions.map((star, index) => (
            <motion.span
              animate={{
                opacity: [0, 1, 0],
                scale: [0.2, 1.1, 0.5],
                x: [0, index % 2 === 0 ? -28 : 28, 0],
                y: [0, index < 2 ? -20 : 20, 0],
                rotate: [0, 24, -18],
              }}
              className={index % 2 === 0 ? 'absolute text-[#FACC15]' : 'absolute text-[#86EFAC]'}
              key={`${star.left}-${star.top}`}
              style={{ top: star.top, left: star.left, fontSize: star.size }}
              transition={{
                duration: 1.4,
                delay: star.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            >
              ★
            </motion.span>
          ))}

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="text-center"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <motion.div
              animate={{ rotate: [0, 6, -6, 0] }}
              className="mx-auto flex h-[220px] w-[220px] items-center justify-center rounded-full border-[10px] border-[#FDE68A] bg-[radial-gradient(circle_at_32%_28%,#FDE68A_0%,#FACC15_42%,#EAB308_100%)] shadow-[0_0_0_16px_rgba(250,204,21,0.08),0_0_90px_rgba(250,204,21,0.36)]"
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              <Sparkles className="h-20 w-20 fill-current text-white/95" />
            </motion.div>
            <motion.p
              animate={{ scale: [1, 1.04, 1] }}
              className="mt-10 text-[clamp(4rem,7vw,6.8rem)] font-black italic tracking-[-0.08em] text-[#FACC15] drop-shadow-[0_10px_24px_rgba(250,204,21,0.32)]"
              transition={{ duration: 1.3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              GREAT JOB!
            </motion.p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
