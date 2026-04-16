'use client';

import {
  Plus,
  Settings2,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Lesson } from '@/features/lesson-config/lesson-schema';

import { LessonBoard } from './lesson-board';
import { StudentSeatStrip } from './student-seat-strip';

type ClassroomShellProps = {
  lesson: Lesson;
  sessionId: string;
  sessionTitle: string;
  sessionStatus: string;
  showReward?: boolean;
};

export function ClassroomShell({
  lesson,
  sessionId,
  sessionTitle,
  sessionStatus,
  showReward = false,
}: ClassroomShellProps) {
  return (
    <main className="relative h-screen overflow-hidden bg-[#0F172A] px-4 py-4 text-white lg:px-6 lg:py-6">
      <div className="absolute left-0 top-0 h-[36vh] w-[36vw] rounded-full bg-[#10B981]/8 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[30vh] w-[24vw] rounded-full bg-sky-500/8 blur-[120px]" />

      <div className="relative z-10 flex h-full flex-col gap-4">
        <header className="flex h-20 shrink-0 items-center justify-between px-4">
          <div className="flex w-1/4 min-w-[220px] items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-6 w-6 fill-current" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-[-0.05em]">MyTurn</h1>
              <p className="sr-only">{sessionTitle}</p>
            </div>
          </div>

          <div className="flex flex-1 justify-center">
            <StudentSeatStrip sessionId={sessionId} />
          </div>

          <div className="flex w-1/4 min-w-[220px] items-center justify-end gap-3">
            <TopActionButton icon={Settings2} label="设置" />
            <TopActionButton icon={X} label="退出" />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 gap-6">
          <section className="min-w-0 flex-[3]">
            <LessonBoard lesson={lesson} sessionStatus={sessionStatus} showReward={showReward} />
          </section>

          <aside className="flex w-full max-w-[360px] flex-1 flex-col gap-6">
            <TeacherColumn showReward={showReward} />
            <PodiumColumn />
          </aside>
        </div>
      </div>

      <CelebrateOverlay show={showReward} />
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
      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white/90 backdrop-blur-md transition-all hover:bg-white/10"
      type="button"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function TeacherColumn({ showReward }: { showReward: boolean }) {
  return (
    <section className="relative flex-[0.8] overflow-hidden rounded-[40px] border-2 border-slate-700 bg-slate-800/80 p-6">
      <div className="absolute inset-x-8 top-8 h-24 rounded-full bg-[#10B981]/10 blur-2xl" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <motion.div
          animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.32)', '0 0 0 18px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0)'] }}
          className="relative mb-4 rounded-full bg-emerald-500/20 p-1.5"
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
        >
          <img
            alt="Cora 老师"
            className="block h-28 w-28 rounded-full bg-white shadow-xl"
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

        <p className="text-[28px] font-black italic tracking-[-0.05em]">Cora 老师</p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-3 py-2 text-[11px] font-bold text-[#10B981]">
          <Volume2 className="h-4 w-4" />
          <span>{showReward ? 'Excellent!' : "It's your turn! Say LION!"}</span>
        </div>
      </div>
    </section>
  );
}

function PodiumColumn() {
  const bars = [0.42, 0.62, 1, 0.72, 0.5];

  return (
    <section className="relative flex-1 overflow-hidden rounded-[40px] border-4 border-[#10B981] bg-slate-800 p-2 shadow-[0_0_40px_rgba(16,185,129,0.18)]">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#10B981] px-4 py-1 text-[10px] font-black text-white shadow-lg">
        你的发言时间
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

        <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.06),transparent_32%),linear-gradient(180deg,#111827_0%,#0b1220_100%)]">
          <div className="flex h-[76%] w-[76%] items-center justify-center rounded-[32px] border border-white/5 bg-[#162238]">
            <img
              alt="我的摄像头占位"
              className="h-[82%] w-[82%] object-contain opacity-90"
              src="/avatars/reward-student.svg"
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex h-12 items-end justify-center gap-1.5">
          {bars.map((bar, index) => (
            <motion.div
              animate={{ height: [`${Math.max(bar * 70, 20)}%`, `${Math.min(bar * 100 + 12, 100)}%`, `${Math.max(bar * 62, 24)}%`] }}
              className={index === 2 ? 'w-2 rounded-full bg-[#10B981] shadow-[0_0_15px_#10B981]' : 'w-2 rounded-full bg-[#10B981]'}
              key={`${bar}-${index}`}
              transition={{ duration: 0.9 + index * 0.1, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
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
