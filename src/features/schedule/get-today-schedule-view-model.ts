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
const CAMP_LABEL = '语感启蒙营 4月班';
const LEARNERS = ['5638Cora', '5612Hippo', '5610Joey', '5604Kiki'];

export function getTodayScheduleViewModel(now: Date = new Date()): TodayScheduleViewModel {
  const sessions = buildDaySessions({
    template: defaultWeekdayScheduleTemplate,
    date: now,
    now,
  }).map((session, index) => {
    const startsAt = session.startsAt.toISOString();
    const endsAt = session.endsAt.toISOString();
    const entryOpensAt = session.entryOpensAt.toISOString();

    return {
      sessionId: session.sessionId,
      lessonId: session.lessonId,
      title: HOMEPAGE_TITLE,
      startsAt,
      endsAt,
      durationMinutes: session.durationMinutes,
      entryOpensAt,
      accessState: session.accessState,
      startTimeLabel: formatTimeLabel(session.startsAt),
      timeRangeLabel: `${formatTimeLabel(session.startsAt)} - ${formatTimeLabel(session.endsAt)}`,
      countdownLabel: getCountdownLabel(session.entryOpensAt, session.startsAt, now, session.accessState),
      learnerLabel: LEARNERS[index % LEARNERS.length],
      campLabel: CAMP_LABEL,
      attendanceLabel: `出勤 ${Math.min(index + 2, 12)}/${Math.max(index + 2, 2)}`,
    };
  });

  return {
    todayLabel: formatTodayLabel(now),
    currentTimeLabel: `当前时间 ${formatTimeLabel(now)}`,
    nextSession: sessions.find((session) => session.accessState !== 'completed') ?? null,
    sessions,
  };
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
