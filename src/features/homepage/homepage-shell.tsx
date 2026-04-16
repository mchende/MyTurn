'use client';

import Link from 'next/link';
import {
  CalendarDays,
  Check,
  DoorOpen,
  Flame,
  Home,
  Info,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { motion } from 'framer-motion';

import type {
  TodayScheduleSessionViewModel,
  TodayScheduleViewModel,
} from '@/features/schedule/get-today-schedule-view-model';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: '我的课堂', active: true },
  { icon: CalendarDays, label: '课程表', active: false },
  { icon: Trophy, label: '成就奖状', active: false },
] as const;

export function HomepageShell({ viewModel }: { viewModel: TodayScheduleViewModel }) {
  const focusSession = viewModel.nextSession ?? viewModel.sessions[0];

  if (!focusSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F9FAFB] text-[#1F2937]">
        <p className="text-2xl font-black">今天还没有排课</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      <div className="flex min-h-screen overflow-hidden">
        <aside className="flex w-28 shrink-0 flex-col items-center justify-between border-r border-[#E5E7EB] bg-white py-8">
          <div className="flex w-full flex-col items-center gap-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#10B981] text-white shadow-[0_20px_45px_rgba(16,185,129,0.22)]">
              <Sparkles className="h-8 w-8 fill-current" />
            </div>

            <nav className="flex w-full flex-col items-center gap-8">
              {navItems.map((item) => (
                <button
                  className={cn(
                    'flex w-full flex-col items-center gap-2 px-2 text-center transition-colors',
                    item.active ? 'text-[#10B981]' : 'text-[#C7CDD4] hover:text-[#6B7280]',
                  )}
                  key={item.label}
                  type="button"
                >
                  <div
                    className={cn(
                      'rounded-[24px] p-4',
                      item.active ? 'bg-[#10B981]/10' : 'bg-transparent',
                    )}
                  >
                    <item.icon className="h-8 w-8" />
                  </div>
                  <span className="text-[15px] font-black leading-tight">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-24 shrink-0 items-center justify-between border-b border-[#E5E7EB] bg-white/70 px-8 backdrop-blur-md xl:px-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#10B981] text-white shadow-[0_14px_30px_rgba(16,185,129,0.2)]">
                <Sparkles className="h-6 w-6 fill-current" />
              </div>
              <h1 className="text-3xl font-black tracking-[-0.05em]">MyTurn</h1>
              <span className="text-[#D1D5DB]">|</span>
              <p className="text-sm font-black text-[#9CA3AF]">{viewModel.todayLabel}</p>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3 rounded-[24px] border border-[#FED7AA] bg-[#FFF7ED] px-4 py-3 text-[#EA580C]">
                <Flame className="h-5 w-5 fill-current" />
                <span className="text-lg font-black">12 天连胜</span>
              </div>

              <div className="flex items-center gap-4 rounded-[32px] bg-white px-4 py-3 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9CA3AF]">
                    今日学习目标
                  </p>
                  <p className="mt-1 text-sm font-black italic text-[#6B7280]">
                    完成一节课堂练习
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-dashed border-[#E5E7EB] bg-[#F9FAFB]">
                  <Check className="h-7 w-7 text-[#D1D5DB]" />
                </div>
              </div>
            </div>
          </header>

          <div className="flex flex-1 gap-8 overflow-hidden p-8 xl:p-10">
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              className="flex min-w-0 flex-[2] flex-col"
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              data-testid="hero-card"
            >
              <div className="flex flex-1 flex-col justify-between rounded-[48px] border border-[#E5E7EB] bg-white p-10 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
                <div className="space-y-8">
                  <div className="flex items-start justify-between gap-6">
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 8px 24px rgba(16,185,129,0.16)',
                          '0 12px 34px rgba(16,185,129,0.28)',
                          '0 8px 24px rgba(16,185,129,0.16)',
                        ],
                      }}
                      className="inline-flex items-center gap-3 rounded-full bg-[#10B981] px-5 py-3 text-white"
                      transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                    >
                      <motion.span
                        animate={{ opacity: [0.45, 1, 0.45], scale: [0.9, 1.1, 0.9] }}
                        className="h-2.5 w-2.5 rounded-full bg-white"
                        transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                      />
                      <span className="text-sm font-black tracking-tight">正在检票入场</span>
                    </motion.div>

                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-[32px] bg-[#1F2937] px-7 py-5 text-white shadow-[0_18px_40px_rgba(31,41,55,0.18)]"
                      initial={{ opacity: 0, scale: 0.96 }}
                      transition={{ delay: 0.08, duration: 0.3, ease: 'easeOut' }}
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/50">
                        距离开课
                      </p>
                      <p className="mt-2 font-mono text-5xl font-black tracking-[-0.08em] text-[#10B981]">
                        {extractCountdown(focusSession.countdownLabel)}
                      </p>
                    </motion.div>
                  </div>

                  <div>
                    <h2 className="text-6xl font-black tracking-[-0.08em] text-[#1F2937]">
                      {focusSession.title}
                    </h2>
                    <p className="mt-3 text-2xl font-black italic tracking-[-0.04em] text-[#9CA3AF]">
                      {focusSession.campLabel}
                    </p>
                  </div>
                </div>

                <div className="my-8 flex items-center gap-10 border-y border-[#F3F4F6] py-8">
                  <RoleCard
                    imageAlt="Cora 老师"
                    imageSrc="/avatars/teacher-cora.svg"
                    label="Cora 老师"
                    role="主讲老师"
                    tone="emerald"
                  />

                  <div className="h-[2px] w-10 rounded-full bg-[#E5E7EB]" />

                  <RoleCard
                    imageAlt="同学 Bobby"
                    imageSrc="/avatars/student-bobby.svg"
                    label="AI 同学 Bobby"
                    role="同学"
                    tone="blue"
                  />
                </div>

                <Link
                  className="inline-flex w-full items-center justify-center gap-4 rounded-[36px] bg-[#10B981] py-10 text-3xl font-black text-white shadow-[0_24px_50px_rgba(16,185,129,0.25)] transition-all hover:bg-[#0EA271] active:scale-[0.985]"
                  href={`/lesson/${focusSession.sessionId}`}
                >
                  <DoorOpen className="h-8 w-8" />
                  进入教室
                </Link>
              </div>
            </motion.section>

            <motion.aside
              animate={{ opacity: 1, y: 0 }}
              className="flex min-w-[320px] flex-1 flex-col"
              initial={{ opacity: 0, y: 24 }}
              transition={{ delay: 0.06, duration: 0.35, ease: 'easeOut' }}
              data-testid="session-timeline"
            >
              <div className="flex flex-1 flex-col rounded-[48px] border border-[#E5E7EB] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.04)]">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-[28px] font-black tracking-[-0.05em]">今日课堂场次</h3>
                  <span className="rounded-[16px] bg-[#ECFDF5] px-3 py-1.5 text-[11px] font-black text-[#10B981]">
                    每节 15 分钟
                  </span>
                </div>

                <div className="flex-1 space-y-4">
                  {viewModel.sessions.map((session) => (
                    <TimelineSessionRow key={session.sessionId} session={session} />
                  ))}
                </div>

                <div className="mt-6 border-t border-[#F3F4F6] pt-6">
                  <div className="flex items-start gap-3 text-[#9CA3AF]">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-xs font-black leading-relaxed">
                      错过场次了吗？别担心，你可以预约明天的相同时间入场练习。
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function RoleCard({
  imageSrc,
  imageAlt,
  label,
  role,
  tone,
}: {
  imageSrc: string;
  imageAlt: string;
  label: string;
  role: string;
  tone: 'emerald' | 'blue';
}) {
  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        <img
          alt={imageAlt}
          className={cn(
            'h-20 w-20 rounded-[28px] border-4 border-white object-cover shadow-md',
            tone === 'emerald' ? 'bg-[#ECFDF5]' : 'bg-[#EFF6FF]',
          )}
          src={imageSrc}
        />
        <span
          className={cn(
            'absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 rounded-xl px-3 py-1 text-[10px] font-black text-white',
            tone === 'emerald' ? 'bg-[#10B981]' : 'bg-[#3B82F6]',
          )}
        >
          {role}
        </span>
      </div>

      <p
        className={cn(
          'text-[32px] font-black italic tracking-[-0.05em]',
          tone === 'emerald' ? 'text-[#1F2937]' : 'text-[#2563EB]',
        )}
      >
        {label}
      </p>
    </div>
  );
}

function TimelineSessionRow({ session }: { session: TodayScheduleSessionViewModel }) {
  const state = getTimelineState(session);

  if (state.tone === 'active') {
    return (
      <motion.div
        animate={{ scale: [1, 1.015, 1] }}
        className="flex items-center gap-4 rounded-[32px] bg-[#10B981] px-6 py-6 text-white shadow-[0_20px_40px_rgba(16,185,129,0.22)]"
        transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      >
        <span className="w-16 text-2xl font-black tracking-[-0.06em]">{session.startTimeLabel}</span>
        <span className="h-3 w-3 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.95)]" />
        <span className="text-lg font-black">{state.label}</span>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-[32px] px-6 py-5',
        state.tone === 'completed' && 'bg-[#F3F4F6] opacity-50',
        state.tone === 'upcoming' && 'border-2 border-dashed border-[#E5E7EB] bg-white',
      )}
    >
      <span
        className={cn(
          'w-16 text-2xl font-black tracking-[-0.06em]',
          state.tone === 'completed' ? 'text-[#9CA3AF]' : 'text-[#D1D5DB]',
        )}
      >
        {session.startTimeLabel}
      </span>
      <span
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          state.tone === 'completed' ? 'bg-[#9CA3AF]' : 'bg-[#E5E7EB]',
        )}
      />
      <span
        className={cn(
          'font-black',
          state.tone === 'completed' ? 'text-[#9CA3AF]' : 'text-[#D1D5DB]',
        )}
      >
        {state.label}
      </span>
    </div>
  );
}

function extractCountdown(label: string) {
  return label.replace('距开场 ', '');
}

function getTimelineState(session: TodayScheduleSessionViewModel) {
  if (session.accessState === 'open_for_entry') {
    return { label: '正在入场', tone: 'active' as const };
  }

  if (session.accessState === 'completed') {
    return { label: '已结束', tone: 'completed' as const };
  }

  return { label: '尚未开放', tone: 'upcoming' as const };
}
