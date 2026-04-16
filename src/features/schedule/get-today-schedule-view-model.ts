import { defaultWeekdayScheduleTemplate } from '../../../content/schedules/default-weekday';
import { buildDaySessions } from './build-day-sessions';
import type { SessionAccessState } from '@/lib/time/session-access-state';

export type TodayScheduleSessionViewModel = {
  sessionId: string;
  lessonId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  entryOpensAt: string;
  accessState: SessionAccessState;
  startTimeLabel: string;
  timeRangeLabel: string;
  countdownLabel: string;
  learnerLabel: string;
  campLabel: string;
  attendanceLabel: string;
};

export type TodayScheduleViewModel = {
  todayLabel: string;
  currentTimeLabel: string;
  sessions: TodayScheduleSessionViewModel[];
  nextSession: TodayScheduleSessionViewModel | null;
};

const HOMEPAGE_TITLE = '每日语感启蒙';
const SESSION_META = [
  {
    title: '118语感启蒙营（4月） - 108',
    campLabel: '118语感启蒙营（4月）',
    learnerLabel: '5638Cora',
    attendanceLabel: '出勤 10/144',
  },
  {
    title: '118语感启蒙营（4月） - 113',
    campLabel: '118语感启蒙营（4月）',
    learnerLabel: '5612Hippo',
    attendanceLabel: '出勤 12/144',
  },
  {
    title: '118语感启蒙营（4月） - 118',
    campLabel: '118语感启蒙营（4月）',
    learnerLabel: '5610Joey',
    attendanceLabel: '出勤 18/144',
  },
  {
    title: '118语感启蒙营（4月） - 123',
    campLabel: '118语感启蒙营（4月）',
    learnerLabel: '5604Kiki',
    attendanceLabel: '出勤 20/144',
  },
  {
    title: '118语感启蒙营（4月） - 128',
    campLabel: '118语感启蒙营（4月）',
    learnerLabel: '5010Zoe',
    attendanceLabel: '出勤 6/144',
  },
  {
    title: '118语感启蒙营（4月） - 133',
    campLabel: '118语感启蒙营（4月）',
    learnerLabel: '5529Aurora',
    attendanceLabel: '出勤 2/144',
  },
] as const;

export function getTodayScheduleViewModel(now: Date = getReferenceNow()): TodayScheduleViewModel {
  const sessions = buildDaySessions({
    template: defaultWeekdayScheduleTemplate,
    date: now,
    now,
  }).map((session, index) => {
    const meta = SESSION_META[index] ?? {
      title: HOMEPAGE_TITLE,
      campLabel: '118语感启蒙营（4月）',
      learnerLabel: `Student ${index + 1}`,
      attendanceLabel: `出勤 ${index + 1}/144`,
    };
    const startsAt = session.startsAt.toISOString();
    const endsAt = session.endsAt.toISOString();
    const entryOpensAt = session.entryOpensAt.toISOString();

    return {
      sessionId: session.sessionId,
      lessonId: session.lessonId,
      title: meta.title,
      startsAt,
      endsAt,
      durationMinutes: session.durationMinutes,
      entryOpensAt,
      accessState: session.accessState,
      startTimeLabel: formatTimeLabel(session.startsAt),
      timeRangeLabel: `${formatTimeLabel(session.startsAt)} - ${formatTimeLabel(session.endsAt)}`,
      countdownLabel: getCountdownLabel(session.entryOpensAt, session.startsAt, now, session.accessState),
      learnerLabel: meta.learnerLabel,
      campLabel: meta.campLabel,
      attendanceLabel: meta.attendanceLabel,
    };
  });

  return {
    todayLabel: formatTodayLabel(now),
    currentTimeLabel: `当前时间 ${formatTimeLabel(now)}`,
    nextSession: sessions.find((session) => session.accessState !== 'completed') ?? null,
    sessions,
  };
}

function getReferenceNow() {
  const fixedNow = process.env.MYTURN_FIXED_NOW;

  if (fixedNow) {
    return new Date(fixedNow);
  }

  return new Date();
}

function formatTodayLabel(date: Date) {
  const weekdayLabel = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdayLabel[date.getDay()]}`;
}

function formatTimeLabel(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function getCountdownLabel(
  entryOpensAt: Date,
  startsAt: Date,
  now: Date,
  accessState: SessionAccessState,
) {
  if (accessState === 'open_for_entry') {
    return `距开场 ${formatCountdown(startsAt.getTime() - now.getTime())}`;
  }

  if (accessState === 'upcoming') {
    const target = now >= entryOpensAt ? startsAt : startsAt;
    return `距开场 ${formatCountdown(target.getTime() - now.getTime())}`;
  }

  if (accessState === 'in_progress_locked') {
    return '已开课，停止入场';
  }

  return '已结束';
}

function formatCountdown(milliseconds: number) {
  const safeMs = Math.max(0, milliseconds);
  const totalSeconds = Math.floor(safeMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}
