import { Home, Settings } from 'lucide-react';

import {
  getTodayScheduleViewModel,
  type TodayScheduleViewModel,
} from '@/features/schedule/get-today-schedule-view-model';
import { SessionCard } from '@/features/schedule/session-card';
import { cn } from '@/lib/utils';

export { type TodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';

export default async function HomePage() {
  const viewModel = getTodayScheduleViewModel();

  return <HomepageShell viewModel={viewModel} />;
}

export function HomepageShell({ viewModel }: { viewModel: TodayScheduleViewModel }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(40,199,111,0.12),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col md:flex-row">
        <header className="border-b border-black/6 bg-white/80 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl font-bold tracking-[-0.03em] text-classroom-ink">
                MyTurn
              </p>
              <p className="text-sm text-classroom-ink/56">{viewModel.todayLabel}</p>
            </div>
            <nav className="flex items-center gap-2 text-sm font-semibold">
              <a
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-classroom-ink"
                href="#homepage-main"
              >
                <Home className="size-4" />
                主页
              </a>
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-classroom-ink/64"
                type="button"
              >
                <Settings className="size-4" />
                设置
              </button>
            </nav>
          </div>
        </header>

        <aside className="hidden w-[248px] shrink-0 border-r border-black/6 bg-white/72 px-5 py-8 backdrop-blur md:flex md:flex-col">
          <div className="mb-10 px-4">
            <p className="font-display text-[2rem] font-bold tracking-[-0.04em] text-classroom-ink">
              MyTurn
            </p>
            <p className="mt-2 text-sm leading-6 text-classroom-ink/56">{viewModel.todayLabel}</p>
          </div>

          <nav className="space-y-2">
            <a
              className="flex min-h-12 items-center gap-3 rounded-2xl bg-black/5 px-4 text-base font-semibold text-classroom-ink"
              href="#homepage-main"
            >
              <Home className="size-5" />
              主页
            </a>
            <button
              className="flex min-h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-base font-semibold text-classroom-ink/54"
              type="button"
            >
              <Settings className="size-5" />
              设置
            </button>
          </nav>

          <div className="mt-auto rounded-[calc(var(--radius-panel)-0.2rem)] border border-emerald-100/80 bg-[linear-gradient(180deg,rgba(240,253,244,0.95),rgba(255,255,255,0.92))] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-classroom-accent-strong">
              Today
            </p>
            <p className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] text-classroom-ink">
              我的课堂
            </p>
            <p className="mt-2 text-sm leading-6 text-classroom-ink/62">
              {viewModel.currentTimeLabel}
            </p>
          </div>
        </aside>

        <section className="flex-1 px-4 py-6 md:px-8 md:py-10 lg:px-12 xl:px-16" id="homepage-main">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <header className="space-y-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold tracking-[0.14em] text-classroom-accent-strong">
                    SCHEDULE SURFACE
                  </p>
                  <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.05em] text-classroom-ink md:text-[2.8rem]">
                    我的课堂
                  </h1>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-classroom-ink/64">
                    先确认今天哪一节课正在准备入场，再按时间节奏进入课堂。
                  </p>
                </div>

                {viewModel.nextSession ? (
                  <div className="rounded-[calc(var(--radius-panel)-0.3rem)] border border-black/6 bg-white/86 px-5 py-4 shadow-[0_20px_32px_rgba(17,24,39,0.06)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-classroom-accent-strong">
                      NEXT
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-classroom-ink">
                      {viewModel.nextSession.startTimeLabel}
                    </p>
                    <p className="mt-1 text-sm text-classroom-ink/62">
                      {viewModel.nextSession.accessState === 'open_for_entry'
                        ? '当前可入场'
                        : viewModel.nextSession.countdownLabel}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="h-px w-full bg-black/8" />
            </header>

            <div
              className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3"
              data-testid="session-card-grid"
            >
              {viewModel.sessions.map((session, index) => (
                <SessionCard
                  isFeatured={index === 0 || session.sessionId === viewModel.nextSession?.sessionId}
                  key={session.sessionId}
                  session={session}
                />
              ))}
            </div>

            {viewModel.sessions.length === 0 ? (
              <div
                className={cn(
                  'rounded-[calc(var(--radius-panel)-0.25rem)] border border-dashed border-black/10 bg-white/80 px-6 py-10 text-center',
                )}
              >
                <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-classroom-ink">
                  今天暂时没有可进入的课程
                </h2>
                <p className="mt-3 text-base leading-7 text-classroom-ink/62">
                  请查看下一节课开始时间，并在开课前进入课堂。
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
