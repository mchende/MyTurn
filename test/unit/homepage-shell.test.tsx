import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { HomepageShell, type TodayScheduleViewModel } from '@/app/(marketing)/page';

const homepageViewModel: TodayScheduleViewModel = {
  todayLabel: '4月15日 星期三',
  currentTimeLabel: '当前时间 16:57',
  nextSession: {
    sessionId: 'weekday-1700',
    lessonId: 'week-01-lesson-01',
    title: '每日语感启蒙',
    startsAt: '2026-04-15T09:00:00.000Z',
    endsAt: '2026-04-15T09:15:00.000Z',
    durationMinutes: 15,
    entryOpensAt: '2026-04-15T08:55:00.000Z',
    accessState: 'open_for_entry',
    startTimeLabel: '17:00',
    timeRangeLabel: '17:00 - 17:15',
    countdownLabel: '距开场 02:45',
    learnerLabel: '同学 Bobby',
    campLabel: '第 4 周：动物园大冒险',
    attendanceLabel: '正在检票',
  },
  sessions: [
    {
      sessionId: 'weekday-1600',
      lessonId: 'week-01-lesson-01',
      title: '每日语感启蒙',
      startsAt: '2026-04-15T08:00:00.000Z',
      endsAt: '2026-04-15T08:15:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T07:55:00.000Z',
      accessState: 'completed',
      startTimeLabel: '16:00',
      timeRangeLabel: '16:00 - 16:15',
      countdownLabel: '已结束',
      learnerLabel: 'Cora 老师',
      campLabel: '第 4 周：动物园大冒险',
      attendanceLabel: '已结束',
    },
    {
      sessionId: 'weekday-1700',
      lessonId: 'week-01-lesson-01',
      title: '每日语感启蒙',
      startsAt: '2026-04-15T09:00:00.000Z',
      endsAt: '2026-04-15T09:15:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T08:55:00.000Z',
      accessState: 'open_for_entry',
      startTimeLabel: '17:00',
      timeRangeLabel: '17:00 - 17:15',
      countdownLabel: '距开场 02:45',
      learnerLabel: '同学 Bobby',
      campLabel: '第 4 周：动物园大冒险',
      attendanceLabel: '正在检票',
    },
    {
      sessionId: 'weekday-1800',
      lessonId: 'week-01-lesson-01',
      title: '每日语感启蒙',
      startsAt: '2026-04-15T10:00:00.000Z',
      endsAt: '2026-04-15T10:15:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T09:55:00.000Z',
      accessState: 'upcoming',
      startTimeLabel: '18:00',
      timeRangeLabel: '18:00 - 18:15',
      countdownLabel: '距开场 01:02:45',
      learnerLabel: '同学 Bobby',
      campLabel: '第 4 周：动物园大冒险',
      attendanceLabel: '尚未开放',
    },
  ],
};

afterEach(() => {
  cleanup();
});

describe('homepage shell contract', () => {
  it('renders the approved dashboard hero with date, streak, and focused entry card', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    expect(screen.getByText('MyTurn')).toBeInTheDocument();
    expect(screen.getByText('4月15日 星期三')).toBeInTheDocument();
    expect(screen.getByText('12 天连胜')).toBeInTheDocument();
    expect(screen.getByText('完成一节课堂练习')).toBeInTheDocument();
    expect(screen.getByText('每日语感启蒙')).toBeInTheDocument();
    expect(screen.getByText('第 4 周：动物园大冒险')).toBeInTheDocument();
    expect(screen.getByText('02:45')).toBeInTheDocument();
    expect(screen.getByText('进入教室')).toBeInTheDocument();
  });

  it('links the hero CTA to the currently open classroom session', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    const cta = screen.getByRole('link', { name: '进入教室' });
    expect(cta).toHaveAttribute('href', '/lesson/weekday-1700');
    expect(screen.getByText('Cora 老师')).toBeInTheDocument();
    expect(screen.getByText('Bobby 同学')).toBeInTheDocument();
  });

  it('renders the right-side session timeline states from the prototype', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    const timeline = screen.getByTestId('session-timeline');
    expect(within(timeline).getByText('16:00')).toBeInTheDocument();
    expect(within(timeline).getByText('已结束')).toBeInTheDocument();
    expect(within(timeline).getByText('17:00')).toBeInTheDocument();
    expect(within(timeline).getByText('正在入场')).toBeInTheDocument();
    expect(within(timeline).getByText('18:00')).toBeInTheDocument();
    expect(within(timeline).getByText('尚未开放')).toBeInTheDocument();
  });
});
