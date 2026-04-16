import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  Cast,
  CheckCheck,
  ChevronRight,
  CirclePlus,
  Home,
  LayoutGrid,
  MessageSquareMore,
  MonitorSmartphone,
  Search,
  Settings,
} from 'lucide-react';

import {
  getTodayScheduleViewModel,
  type TodayScheduleSessionViewModel,
  type TodayScheduleViewModel,
} from '@/features/schedule/get-today-schedule-view-model';
import { cn } from '@/lib/utils';

export { type TodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';

const catalogCards = [
  {
    id: 'creative-april',
    title: '118语感启蒙营（4月）',
    room: 'JWZQ教室',
    sticker: '5638',
    href: '/lesson/weekday-1835',
    tone: 'sun',
  },
  {
    id: 'mia-freetalk',
    title: 'Free talk — Mia（周一至周五17:00-22:00）',
    room: 'JWZQ教室',
    sticker: 'Mia',
    href: '/lesson/weekday-1900',
    tone: 'aurora',
  },
  {
    id: 'september',
    title: '118语感启蒙营（9月）',
    room: 'JWZQ教室',
    sticker: '5610',
    href: '/lesson/weekday-1935',
    tone: 'aurora',
  },
  {
    id: 'march',
    title: '118语感启蒙营（3月）',
    room: 'JWZQ教室',
    sticker: '5604',
    href: '/lesson/weekday-2000',
    tone: 'sky',
  },
  {
    id: 'february',
    title: '118语感启蒙营（2月）',
    room: 'JWZQ教室',
    sticker: '5010',
    href: '/lesson/weekday-2035',
    tone: 'library',
  },
  {
    id: 'january',
    title: '118语感启蒙营（1月）',
    room: 'JWZQ教室',
    sticker: '5529',
    href: '/lesson/weekday-2105',
    tone: 'aurora',
  },
  {
    id: 'december',
    title: '118语感启蒙营（12月）',
    room: 'JWZQ教室',
    sticker: '5608',
    href: '/lesson/weekday-1900',
    tone: 'aurora',
  },
  {
    id: 'november',
    title: '118语感启蒙营（11月）',
    room: 'JWZQ教室',
    sticker: '5618',
    href: '/lesson/weekday-1935',
    tone: 'aurora',
  },
] as const;

const leftRailItems = [
  { icon: Home, label: '主页', active: true },
  { icon: MessageSquareMore, label: '消息' },
  { icon: CheckCheck, label: '待办', badge: '7' },
  { icon: CalendarDays, label: '课程表' },
  { icon: LayoutGrid, label: '空间' },
] as const;

const lowerRailItems = [
  { icon: BookOpenText, label: '黑板' },
  { icon: Cast, label: '投屏' },
] as const;

const tabs = ['全部班级', '我是教师', '我是学生', '待处理', '已结课'] as const;

export default async function HomePage() {
  const viewModel = getTodayScheduleViewModel();

  return <HomepageShell viewModel={viewModel} />;
}

export function HomepageShell({ viewModel }: { viewModel: TodayScheduleViewModel }) {
  const focusSession = viewModel.nextSession ?? viewModel.sessions[0] ?? null;

  return (
    <main className="min-h-screen bg-[#ecebe7] p-4 text-[#1c1d20] md:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1920px] overflow-hidden rounded-[2rem] bg-[#fbfbf8] shadow-[0_24px_80px_rgba(18,22,28,0.08)] xl:grid-cols-[320px_minmax(0,1fr)_408px]">
        <aside className="flex flex-col bg-[#f8f7f4] px-6 py-8 xl:px-8 xl:py-10">
          <div>
            <p className="font-display text-[3.2rem] font-extrabold tracking-[-0.08em] text-[#202126]">
              MyTurn
            </p>
          </div>

          <nav className="mt-14 space-y-5">
            {leftRailItems.map((item) => (
              <button
                className={cn(
                  'flex w-full items-center gap-5 rounded-[1.65rem] px-6 py-5 text-left text-[1.05rem] font-semibold text-[#1f2228] transition-colors',
                  item.active ? 'bg-[#efefed] shadow-[inset_0_0_0_1px_rgba(28,29,32,0.05)]' : 'hover:bg-[#f1f1ee]',
                )}
                key={item.label}
                type="button"
              >
                <span
                  className={cn(
                    'relative flex size-11 items-center justify-center rounded-2xl',
                    item.active ? 'bg-[#191919] text-white' : 'bg-transparent text-[#202126]',
                  )}
                >
                  <item.icon className="size-6" />
                  {item.badge ? (
                    <span className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-[#ff533d] text-sm font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                <span className="text-[1.2rem]">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mx-5 mt-12 h-px bg-[#e4e2de]" />

          <nav className="mt-10 space-y-5">
            {lowerRailItems.map((item) => (
              <button
                className="flex w-full items-center gap-5 rounded-[1.65rem] px-6 py-5 text-left text-[1.2rem] font-semibold text-[#202126] transition-colors hover:bg-[#f1f1ee]"
                key={item.label}
                type="button"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl text-[#202126]">
                  <item.icon className="size-6" />
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-4 px-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[radial-gradient(circle_at_32%_32%,#ffe89b,#ffa552_70%,#ff7356)]">
              <div className="absolute right-0 top-0 size-4 rounded-full border-2 border-[#f8f7f4] bg-[#ff4b42]" />
            </div>
            <div>
              <p className="text-[1rem] font-bold text-[#1d1f24]">yilia...</p>
            </div>
          </div>
        </aside>

        <section className="overflow-hidden bg-[#fcfcfa] px-8 py-6 xl:px-10 xl:py-7">
          <div className="flex items-center justify-center gap-8">
            <button
              aria-label="搜索"
              className="flex size-11 items-center justify-center rounded-full text-[#1b1d21] transition-colors hover:bg-[#f1f1ee]"
              type="button"
            >
              <Search className="size-7" />
            </button>

            <div className="flex items-center gap-3 rounded-full bg-[#050505] px-10 py-5 text-white shadow-[0_16px_36px_rgba(5,5,5,0.14)]">
              <span className="flex h-6 items-end gap-[5px]">
                <span className="h-4 w-1.5 rounded-full bg-[#25d366]" />
                <span className="h-7 w-1.5 rounded-full bg-[#25d366]" />
                <span className="h-5 w-1.5 rounded-full bg-[#25d366]" />
              </span>
              <span className="text-[1.2rem] font-bold">9 节课</span>
            </div>

            <button
              aria-label="创建"
              className="flex size-11 items-center justify-center rounded-full text-[#1b1d21] transition-colors hover:bg-[#f1f1ee]"
              type="button"
            >
              <CirclePlus className="size-7" />
            </button>
          </div>

          <div className="mt-8 grid gap-7 2xl:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
            <section className="relative overflow-hidden rounded-[1.8rem] bg-[linear-gradient(135deg,#4e91ec,#4b86df)] px-11 py-10 text-white shadow-[0_20px_40px_rgba(78,145,236,0.22)]">
              <div className="flex items-center gap-7">
                <CirclePlus className="size-12" />
                <div>
                  <h2 className="font-display text-[2.35rem] font-extrabold tracking-[-0.05em]">创建班级</h2>
                  <p className="mt-2 text-[1.15rem] text-white/86">全新班级，多种学习模式</p>
                </div>
              </div>

              <div className="absolute bottom-0 right-10 top-0 hidden w-[32%] items-center justify-center xl:flex">
                <div className="relative h-40 w-52 rounded-[1.7rem] bg-white/80 backdrop-blur">
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="size-2.5 rounded-full bg-[#d5d5d5]" />
                    <span className="size-2.5 rounded-full bg-[#d5d5d5]" />
                    <span className="size-2.5 rounded-full bg-[#d5d5d5]" />
                  </div>
                  <div className="absolute left-7 top-12 h-8 w-28 rounded-2xl bg-[linear-gradient(90deg,#dbeafe,#ffffff)] shadow-[0_8px_20px_rgba(123,155,219,0.18)]" />
                  <div className="absolute left-7 top-24 h-8 w-20 rounded-2xl bg-[linear-gradient(90deg,#dbeafe,#ffffff)] shadow-[0_8px_20px_rgba(123,155,219,0.18)]" />
                  <div className="absolute -bottom-5 right-[-24px] h-28 w-28 rounded-[1.6rem] bg-white p-4 shadow-[0_20px_40px_rgba(43,79,150,0.18)]">
                    <div className="h-full rounded-[1rem] border border-[#efefef] bg-[#fbfbfb] p-3">
                      <div className="h-3 w-14 rounded-full bg-[#141414]" />
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full rounded-full bg-[#d9d9d9]" />
                        <div className="h-2 w-4/5 rounded-full bg-[#d9d9d9]" />
                        <div className="h-2 w-3/5 rounded-full bg-[#d9d9d9]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[1.8rem] bg-[#eceae7] px-11 py-10 text-[#1f2126]">
              <div className="flex items-center gap-7">
                <CirclePlus className="size-12 text-[#8c8c8c]" />
                <div>
                  <h2 className="font-display text-[2.35rem] font-extrabold tracking-[-0.05em]">创建公开课</h2>
                  <p className="mt-2 text-[1.15rem] text-[#7d7d7b]">公开课堂，随时参与</p>
                </div>
              </div>

              <div className="absolute right-9 top-9 hidden h-32 w-48 rounded-[1.5rem] bg-[linear-gradient(180deg,#dce7ff,#f8fbff)] shadow-[0_16px_32px_rgba(94,132,194,0.15)] xl:block">
                <div className="grid grid-cols-4 gap-2 p-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      className="h-8 rounded-xl bg-white/80 shadow-[inset_0_0_0_1px_rgba(184,196,225,0.5)]"
                      key={index}
                    />
                  ))}
                </div>
                <div className="absolute bottom-7 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#7ea8ff]/70">
                  <span className="ml-1 text-2xl text-white">▶</span>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-12 text-[1.3rem] font-medium text-[#848484]">
            {tabs.map((tab, index) => (
              <button
                className={cn(
                  'relative pb-4 transition-colors',
                  index === 0 && 'font-bold text-[#181818]',
                )}
                key={tab}
                type="button"
              >
                {tab}
                {index === 0 ? <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-[#161616]" /> : null}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2 2xl:grid-cols-4" data-testid="session-card-grid">
            {catalogCards.map((card) => (
              <article
                className="group overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_12px_30px_rgba(31,35,41,0.05)] shadow-[#d8d8d8]/70 ring-1 ring-[#ece9e4]"
                key={card.id}
              >
                <Link className="block" href={card.href}>
                  <div className={cn('relative h-[210px] overflow-hidden rounded-[1.6rem]', coverToneClassName(card.tone))}>
                    {card.tone === 'sun' ? (
                      <>
                        <div className="absolute left-[-10%] top-[-8%] h-40 w-40 rounded-full bg-[#fff2a8]" />
                        <div className="absolute right-[12%] top-[14%] h-24 w-24 rounded-full border-[7px] border-[#3a342a]" />
                        <div className="absolute right-[18%] top-[22%] h-24 w-24 rounded-full border-[7px] border-transparent border-t-[#3a342a]" />
                        <div className="absolute bottom-0 left-[36%] h-28 w-8 rounded-t-full bg-[#2f2b22]" />
                      </>
                    ) : null}

                    {card.tone === 'sky' ? (
                      <>
                        <div className="absolute left-10 top-14 h-16 w-28 rounded-[1.2rem] bg-[#ffcc20] blur-[1px]" />
                        <div className="absolute right-8 top-12 h-28 w-52 -rotate-6 rounded-[1.8rem] bg-[#12398f]" />
                        <div className="absolute bottom-[-18px] right-12 h-24 w-28 -rotate-[20deg] rounded-[999px] bg-[#1f4da7]" />
                      </>
                    ) : null}

                    {card.tone === 'library' ? (
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,#b77e3f_0_13%,#e9c991_13%_20%,#b77e3f_20%_33%,#ecd6a8_33%_40%,#b87d3c_40%_53%,#ead9bc_53%_60%,#b77b39_60%_72%,#ecd5a9_72%_79%,#b87e40_79%_100%)]" />
                    ) : null}

                    <div className="absolute bottom-[-12px] left-6 flex h-16 w-16 items-center justify-center rounded-[1.2rem] border-4 border-white bg-white shadow-[0_10px_24px_rgba(18,22,28,0.12)]">
                      <span className="font-display text-sm font-black tracking-[-0.04em] text-[#1d2127]">{card.sticker}</span>
                    </div>
                  </div>

                  <div className="px-3 pb-3 pt-10">
                    <h3 className="line-clamp-2 font-display text-[1.2rem] font-bold tracking-[-0.04em] text-[#17191f]">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-[1rem] text-[#8b8b8a]">{card.room}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <aside className="border-l border-[#ece9e4] bg-[#f8f7f2] px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.05em] text-[#1a1c20]">近期待办</h2>
            </div>
            <button className="flex items-center gap-2 text-[1.1rem] text-[#8f8f8f]" type="button">
              更多
              <ArrowUpRight className="size-5" />
            </button>
          </div>

          <div className="mt-8 space-y-7">
            <div>
              <p className="text-[1.35rem] font-bold text-[#bab8b4]">一天内</p>
            </div>

            {viewModel.sessions.map((session) => (
              <TodoSessionRow
                isFocus={session.sessionId === focusSession?.sessionId}
                key={session.sessionId}
                session={session}
              />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

function TodoSessionRow({
  session,
  isFocus,
}: {
  session: TodayScheduleSessionViewModel;
  isFocus: boolean;
}) {
  const statusText = getTodoStatusText(session);

  return (
    <article className="rounded-[1.8rem] px-1 py-2">
      <p className="text-[1.1rem] font-medium text-[#2f3136]">{session.title}</p>

      <div className="mt-3 flex items-center gap-3 text-[1rem] text-[#8d8d8d]">
        <span className="rounded-xl bg-[#e9faec] px-3 py-1 text-[#199950]">课堂</span>
        <span>{getLongTimeLabel(session)}</span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[1.05rem] text-[#8c8c8c]">
        <span>{session.campLabel}</span>
        <ChevronRight className="size-4" />
      </div>

      <div className="mt-3 flex items-center gap-3 text-[1.1rem] text-[#8a8a8a]">
        <span>{session.learnerLabel}</span>
        <span className="text-[#c7c5c0]">|</span>
        <span>{session.attendanceLabel}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-right">
          <p className="text-[1rem] font-medium text-[#13a351]">{statusText.label}</p>
          <p className="mt-1 font-display text-[1.25rem] font-extrabold tracking-[-0.04em] text-[#13a351]">
            {statusText.value}
          </p>
        </div>

        {session.accessState === 'open_for_entry' ? (
          <Link
            className="inline-flex min-h-16 min-w-[136px] items-center justify-center rounded-full bg-[#33db5b] px-9 text-[1.65rem] font-bold tracking-[-0.05em] text-[#051506] shadow-[0_12px_24px_rgba(51,219,91,0.25)]"
            href={`/lesson/${session.sessionId}`}
          >
            上课
          </Link>
        ) : isFocus ? (
          <div className="inline-flex min-h-16 min-w-[136px] items-center justify-center rounded-full bg-[#e9efe8] px-8 text-[1.2rem] font-semibold text-[#7a8379]">
            准备中
          </div>
        ) : null}
      </div>
    </article>
  );
}

function getLongTimeLabel(session: TodayScheduleSessionViewModel) {
  const start = new Date(session.startsAt);
  return `${start.getMonth() + 1}月${start.getDate()}日 今天 ${session.startTimeLabel} 开始（${session.durationMinutes}分）`;
}

function getTodoStatusText(session: TodayScheduleSessionViewModel) {
  if (session.accessState === 'open_for_entry') {
    return {
      label: '即将开课',
      value: session.startTimeLabel,
    };
  }

  if (session.accessState === 'completed') {
    return {
      label: '已结束',
      value: session.startTimeLabel,
    };
  }

  if (session.accessState === 'in_progress_locked') {
    return {
      label: '已开课',
      value: session.startTimeLabel,
    };
  }

  return {
    label: session.countdownLabel.replace('距开场 ', '距上课'),
    value: session.startTimeLabel,
  };
}

function coverToneClassName(tone: (typeof catalogCards)[number]['tone']) {
  switch (tone) {
    case 'sun':
      return 'bg-[linear-gradient(135deg,#ffd77e,#ffeaa8_40%,#ffcb53)]';
    case 'sky':
      return 'bg-[linear-gradient(135deg,#a8cfff,#85b7f2_42%,#93c8ff)]';
    case 'library':
      return 'bg-[#d9b57b]';
    default:
      return 'bg-[linear-gradient(135deg,#b53692,#fb8f8f_56%,#8db5eb)]';
  }
}
