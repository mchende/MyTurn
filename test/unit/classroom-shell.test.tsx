import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { loadLesson } from '@/features/lesson-config/load-lesson';

const lesson = loadLesson('week-01-lesson-01');

afterEach(() => {
  cleanup();
});

describe('classroom shell layout', () => {
  it('renders the approved dark classroom shell with stage, strip, and side panels', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    expect(screen.getByText('MyTurn')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '退出课堂' })).toBeInTheDocument();
    expect(screen.getByText('Cora 老师')).toBeInTheDocument();
    expect(screen.getByText(`"It's your turn! Say LION!"`)).toBeInTheDocument();
    expect(screen.getByText('榜单奖励时刻')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-seat-strip')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-stage')).toBeInTheDocument();
  });

  it('keeps the reward preview card visible beside the stage in default mode', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    expect(screen.getByAltText('奖励中的同学')).toHaveAttribute('src', '/avatars/reward-student.svg');
    expect(screen.getByAltText('讲台中的 Cora 老师')).toHaveAttribute('src', '/avatars/teacher-cora.svg');
  });

  it('switches the main stage into the reward feedback state when requested', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
        showReward
      />,
    );

    expect(screen.getByText('GREAT JOB!')).toBeInTheDocument();
    expect(screen.getByText('Excellent!')).toBeInTheDocument();
  });
});
