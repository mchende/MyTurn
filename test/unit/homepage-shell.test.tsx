import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HomepageShell, type TodayScheduleViewModel } from '@/app/(marketing)/page';

const homepageViewModel: TodayScheduleViewModel = {
  todayLabel: '4月15日 星期三',
  currentTimeLabel: '当前时间 13:57',
  nextSession: {
    sessionId: 'weekday-1400',
    lessonId: 'week-01-lesson-01',
    title: '每日语感启蒙',
    startsAt: '2026-04-15T14:00:00.000Z',
    endsAt: '2026-04-15T14:15:00.000Z',
    durationMinutes: 15,
    entryOpensAt: '2026-04-15T13:55:00.000Z',
    accessState: 'open_for_entry',
    startTimeLabel: '14:00',
    timeRangeLabel: '14:00 - 14:15',
    countdownLabel: '距开场 00:03',
    learnerLabel: '5638Cora',
    campLabel: '语感启蒙营 4月班',
    attendanceLabel: '出勤 2/2',
  },
  sessions: [
    {
      sessionId: 'weekday-1000',
      lessonId: 'week-01-lesson-01',
      title: '每日语感启蒙',
      startsAt: '2026-04-15T10:00:00.000Z',
      endsAt: '2026-04-15T10:15:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T09:55:00.000Z',
      accessState: 'completed',
      startTimeLabel: '10:00',
      timeRangeLabel: '10:00 - 10:15',
      countdownLabel: '已结束',
      learnerLabel: '5604Kiki',
      campLabel: '语感启蒙营 4月班',
      attendanceLabel: '出勤 1/1',
    },
    {
      sessionId: 'weekday-1400',
      lessonId: 'week-01-lesson-01',
      title: '每日语感启蒙',
      startsAt: '2026-04-15T14:00:00.000Z',
      endsAt: '2026-04-15T14:15:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T13:55:00.000Z',
      accessState: 'open_for_entry',
      startTimeLabel: '14:00',
      timeRangeLabel: '14:00 - 14:15',
      countdownLabel: '距开场 00:03',
      learnerLabel: '5638Cora',
      campLabel: '语感启蒙营 4月班',
      attendanceLabel: '出勤 2/2',
    },
    {
      sessionId: 'weekday-1930',
      lessonId: 'week-01-lesson-01',
      title: '每日语感启蒙',
      startsAt: '2026-04-15T19:30:00.000Z',
      endsAt: '2026-04-15T19:45:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T19:25:00.000Z',
      accessState: 'upcoming',
      startTimeLabel: '19:30',
      timeRangeLabel: '19:30 - 19:45',
      countdownLabel: '距开场 05:33:00',
      learnerLabel: '5612Hippo',
      campLabel: '语感启蒙营 4月班',
      attendanceLabel: '出勤 12/14',
    },
    {
      sessionId: 'weekday-2000',
      lessonId: 'week-01-lesson-01',
      title: '每日语感启蒙',
      startsAt: '2026-04-15T20:00:00.000Z',
      endsAt: '2026-04-15T20:15:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T19:55:00.000Z',
      accessState: 'in_progress_locked',
      startTimeLabel: '20:00',
      timeRangeLabel: '20:00 - 20:15',
      countdownLabel: '已开课，停止入场',
      learnerLabel: '5610Joey',
      campLabel: '语感启蒙营 4月班',
      attendanceLabel: '出勤 8/9',
    },
  ],
};

describe('homepage shell contract', () => {
  it('renders the Stitch homepage shell with left nav and session grid', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    expect(screen.getAllByText('MyTurn').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: '主页' }).length).toBeGreaterThan(0);
    expect(screen.getAllByText('设置').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: '我的课堂' })).toBeInTheDocument();

    const grid = screen.getByTestId('session-card-grid');
    expect(grid).toBeInTheDocument();
    expect(within(grid).getAllByRole('article')).toHaveLength(4);
  });

  it('renders entry CTA only for open sessions and locked copy for started sessions', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    const entryLinks = screen.getAllByRole('link', { name: '进入课堂' });
    expect(entryLinks[0]).toHaveAttribute('href', '/lesson/weekday-1400');
    expect(screen.getAllByText('已开课，停止入场').length).toBeGreaterThan(0);
  });

  it('keeps upcoming sessions readable with start time emphasis and countdown copy', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    expect(screen.getAllByText('19:30').length).toBeGreaterThan(0);
    expect(screen.getAllByText('距开场 05:33:00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4月15日 星期三').length).toBeGreaterThan(0);
  });
});
