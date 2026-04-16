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
    <main className="min-h-screen overflow-hidden bg-[#152236] px-8 py-8 text-white md:px-10 md:py-10">
      <div className="mx-auto max-w-[1880px]">
        <header className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-6">
            <div className="h-[78px] w-[78px] rounded-[22px] bg-[#1fbe86]" />
            <p className="font-display text-[3rem] font-extrabold tracking-[-0.08em] text-white">
              MyTurn
            </p>
          </div>

          <div className="flex justify-center xl:flex-1">
            <StudentSeatStrip sessionId={sessionId} />
          </div>

          <button
            className="h-[78px] rounded-[28px] border border-white/14 bg-white/[0.06] px-10 text-[1.85rem] font-bold tracking-[-0.05em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:bg-white/[0.1]"
            type="button"
          >
            退出课堂
          </button>
        </header>

        <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0">
            <LessonBoard lesson={lesson} sessionStatus={sessionStatus} showReward={showReward} />
            <p className="sr-only">{sessionTitle}</p>
          </div>

          <aside className="space-y-8">
            <TeacherFeedbackCard showReward={showReward} />
            <RewardMomentCard showReward={showReward} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function TeacherFeedbackCard({ showReward }: { showReward: boolean }) {
  return (
    <section className="rounded-[42px] border border-white/10 bg-[#223249] px-8 py-10 shadow-[0_20px_50px_rgba(6,15,27,0.22)]">
      <div className="flex justify-end">
        <span className="h-5 w-5 rounded-full bg-white/95" />
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <div className="relative rounded-full border-[10px] border-[#145d58] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
          <img alt="Cora 老师" className="block h-[180px] w-[180px]" src="/avatars/teacher-cora.svg" />
          <div className="absolute -bottom-4 left-1/2 flex h-12 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-[#19be84] shadow-[0_12px_24px_rgba(25,190,132,0.28)]">
            <span className="flex gap-2">
              <span className="h-7 w-2 rounded-full bg-white/75" />
              <span className="h-9 w-2 rounded-full bg-white" />
              <span className="h-7 w-2 rounded-full bg-white/75" />
            </span>
          </div>
        </div>

        <p className="mt-10 text-[3.2rem] font-extrabold italic tracking-[-0.08em] text-white">
          Cora 老师
        </p>
        <p className="mt-3 text-[1.35rem] font-bold italic tracking-[-0.03em] text-[#16d59f]">
          {showReward ? 'Excellent!' : `"It's your turn! Say LION!"`}
        </p>
      </div>
    </section>
  );
}

function RewardMomentCard({ showReward }: { showReward: boolean }) {
  return (
    <section
      className={`relative rounded-[42px] border-[5px] ${
        showReward
          ? 'border-[#f0c300] shadow-[0_0_0_2px_rgba(240,195,0,0.18),0_20px_44px_rgba(240,195,0,0.12)]'
          : 'border-[#19be84] shadow-[0_20px_44px_rgba(9,24,44,0.2)]'
      } bg-[#16223a] p-5`}
      data-testid="reward-preview"
    >
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1fbe86] px-7 py-3 text-[1rem] font-bold text-white shadow-[0_10px_18px_rgba(31,190,134,0.3)]">
        榜单奖励时刻
      </span>

      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0f1522] px-5 py-3 text-[1rem] font-bold text-white/90">
          <span className="h-4 w-4 rounded-full bg-[#cb2d3e]" />
          LIVE
        </div>
        {showReward ? <span className="h-8 w-8 rounded-[8px] bg-[#f0c300]" /> : null}
      </div>

      <div className="mt-5 overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_50%_20%,rgba(46,75,109,0.32),transparent_48%),#16223a]">
        <img alt="奖励中的同学" className="block h-[460px] w-full object-cover" src="/avatars/reward-student.svg" />
      </div>

      <p className="sr-only">{showReward ? '奖励反馈进行中' : '奖励反馈待命'}</p>
    </section>
  );
}
