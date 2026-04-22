import { describe, expect, it } from 'vitest';

import { getTodayScheduleViewModel } from '@/features/schedule/get-today-schedule-view-model';

describe('getTodayScheduleViewModel', () => {
  it('applies recently-completed overlay without changing the real accessState', () => {
    const now = new Date('2026-04-15T09:57:15+08:00');
    const baseline = getTodayScheduleViewModel(now);
    const viewModel = getTodayScheduleViewModel(now, {
      completedSessionId: 'weekday-1700',
    });

    const baselineCompletedSession = baseline.sessions.find(
      (session) => session.sessionId === 'weekday-1700',
    );
    const completedSession = viewModel.sessions.find(
      (session) => session.sessionId === 'weekday-1700',
    );
    const baselineUntouchedSession = baseline.sessions.find(
      (session) => session.sessionId === 'weekday-1800',
    );
    const untouchedSession = viewModel.sessions.find(
      (session) => session.sessionId === 'weekday-1800',
    );

    expect(completedSession?.accessState).toBe(baselineCompletedSession?.accessState);
    expect(completedSession?.isRecentlyCompleted).toBe(true);
    expect(untouchedSession?.accessState).toBe(baselineUntouchedSession?.accessState);
    expect(untouchedSession?.isRecentlyCompleted).toBe(false);
  });

  it('prioritizes the recently-completed overlay session before the next time-based session', () => {
    const now = new Date('2026-04-15T09:57:15+08:00');
    const baseline = getTodayScheduleViewModel(now);
    const viewModel = getTodayScheduleViewModel(now, {
      completedSessionId: 'weekday-1600',
    });
    const baselineSession = baseline.sessions.find(
      (session) => session.sessionId === 'weekday-1600',
    );

    expect(viewModel.nextSession?.sessionId).toBe('weekday-1600');
    expect(viewModel.nextSession?.isRecentlyCompleted).toBe(true);
    expect(viewModel.nextSession?.accessState).toBe(baselineSession?.accessState);
  });
});
