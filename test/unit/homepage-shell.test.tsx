import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { HomepageShell, type TodayScheduleViewModel } from '@/app/(marketing)/page';

const homepageViewModel: TodayScheduleViewModel = {
  todayLabel: '4月15日 星期三',
  currentTimeLabel: '当前时间 18:59',
  nextSession: {
    sessionId: 'weekday-1900',
    lessonId: 'week-01-lesson-01',
    title: '118语感启蒙营（4月） - 113',
    startsAt: '2026-04-15T11:00:00.000Z',
    endsAt: '2026-04-15T11:15:00.000Z',
    durationMinutes: 15,
    entryOpensAt: '2026-04-15T10:55:00.000Z',
    accessState: 'open_for_entry',
    startTimeLabel: '19:00',
    timeRangeLabel: '19:00 - 19:15',
    countdownLabel: '距开场 01:00',
    learnerLabel: '5612Hippo',
    campLabel: '118语感启蒙营（4月）',
    attendanceLabel: '出勤 12/144',
  },
  sessions: [
    {
      sessionId: 'weekday-1835',
      lessonId: 'week-01-lesson-01',
      title: '118语感启蒙营（4月） - 108',
      startsAt: '2026-04-15T10:35:00.000Z',
      endsAt: '2026-04-15T10:50:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T10:30:00.000Z',
      accessState: 'completed',
      startTimeLabel: '18:35',
      timeRangeLabel: '18:35 - 18:50',
      countdownLabel: '已结束',
      learnerLabel: '5638Cora',
      campLabel: '118语感启蒙营（4月）',
      attendanceLabel: '出勤 10/144',
    },
    {
      sessionId: 'weekday-1900',
      lessonId: 'week-01-lesson-01',
      title: '118语感启蒙营（4月） - 113',
      startsAt: '2026-04-15T11:00:00.000Z',
      endsAt: '2026-04-15T11:15:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T10:55:00.000Z',
      accessState: 'open_for_entry',
      startTimeLabel: '19:00',
      timeRangeLabel: '19:00 - 19:15',
      countdownLabel: '距开场 01:00',
      learnerLabel: '5612Hippo',
      campLabel: '118语感启蒙营（4月）',
      attendanceLabel: '出勤 12/144',
    },
    {
      sessionId: 'weekday-1935',
      lessonId: 'week-01-lesson-01',
      title: '118语感启蒙营（4月） - 118',
      startsAt: '2026-04-15T11:35:00.000Z',
      endsAt: '2026-04-15T11:50:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T11:30:00.000Z',
      accessState: 'upcoming',
      startTimeLabel: '19:35',
      timeRangeLabel: '19:35 - 19:50',
      countdownLabel: '距开场 34分',
      learnerLabel: '5610Joey',
      campLabel: '118语感启蒙营（4月）',
      attendanceLabel: '出勤 18/144',
    },
    {
      sessionId: 'weekday-2000',
      lessonId: 'week-01-lesson-01',
      title: '118语感启蒙营（4月） - 123',
      startsAt: '2026-04-15T12:00:00.000Z',
      endsAt: '2026-04-15T12:15:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T11:55:00.000Z',
      accessState: 'upcoming',
      startTimeLabel: '20:00',
      timeRangeLabel: '20:00 - 20:15',
      countdownLabel: '距开场 58分',
      learnerLabel: '5604Kiki',
      campLabel: '118语感启蒙营（4月）',
      attendanceLabel: '出勤 20/144',
    },
    {
      sessionId: 'weekday-2035',
      lessonId: 'week-01-lesson-01',
      title: '118语感启蒙营（4月） - 128',
      startsAt: '2026-04-15T12:35:00.000Z',
      endsAt: '2026-04-15T12:50:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T12:30:00.000Z',
      accessState: 'upcoming',
      startTimeLabel: '20:35',
      timeRangeLabel: '20:35 - 20:50',
      countdownLabel: '距开场 01:36:00',
      learnerLabel: '5010Zoe',
      campLabel: '118语感启蒙营（4月）',
      attendanceLabel: '出勤 6/144',
    },
    {
      sessionId: 'weekday-2105',
      lessonId: 'week-01-lesson-01',
      title: '118语感启蒙营（4月） - 133',
      startsAt: '2026-04-15T13:05:00.000Z',
      endsAt: '2026-04-15T13:20:00.000Z',
      durationMinutes: 15,
      entryOpensAt: '2026-04-15T13:00:00.000Z',
      accessState: 'upcoming',
      startTimeLabel: '21:05',
      timeRangeLabel: '21:05 - 21:20',
      countdownLabel: '距开场 02:06:00',
      learnerLabel: '5529Aurora',
      campLabel: '118语感启蒙营（4月）',
      attendanceLabel: '出勤 2/144',
    },
  ],
};

describe('homepage shell contract', () => {
  it('renders the classin-style workbench shell with left rail, top stats, and course grid', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    expect(screen.getByText('MyTurn')).toBeInTheDocument();
    expect(screen.getByText('9 节课')).toBeInTheDocument();
    expect(screen.getByText('创建班级')).toBeInTheDocument();
    expect(screen.getByText('创建公开课')).toBeInTheDocument();
    expect(screen.getByText('全部班级')).toBeInTheDocument();

    const grid = screen.getByTestId('session-card-grid');
    expect(within(grid).getAllByRole('article').length).toBeGreaterThanOrEqual(8);
  });

  it('renders a right-side todo column with an actionable 上课 CTA for the open session', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    expect(screen.getAllByText('近期待办').length).toBeGreaterThan(0);
    const joinLinks = screen.getAllByRole('link', { name: '上课' });
    expect(joinLinks[0]).toHaveAttribute('href', '/lesson/weekday-1900');
    expect(screen.getAllByText('118语感启蒙营（4月） - 113').length).toBeGreaterThan(0);
    expect(screen.getAllByText('5612Hippo').length).toBeGreaterThan(0);
  });

  it('keeps upcoming sessions readable with scheduled time emphasis in the todo rail', () => {
    render(<HomepageShell viewModel={homepageViewModel} />);

    expect(screen.getAllByText('19:35').length).toBeGreaterThan(0);
    expect(screen.getAllByText('距上课34分').length).toBeGreaterThan(0);
    expect(screen.getAllByText('20:00').length).toBeGreaterThan(0);
  });
});
