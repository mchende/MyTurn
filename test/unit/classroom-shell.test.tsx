import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { loadLesson } from '@/features/lesson-config/load-lesson';

const lesson = loadLesson('week-01-lesson-01');

afterEach(() => {
  cleanup();
});

describe('classroom shell layout', () => {
  it('renders the immersive classroom shell with stage, strip, and side panels', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    expect(screen.getByText('MyTurn')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '退出' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '设置' })).toBeInTheDocument();
    expect(screen.getByText('Cora 老师')).toBeInTheDocument();
    expect(screen.getByText("It's your turn! Say LION!")).toBeInTheDocument();
    expect(screen.getByText('你的发言时间')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-seat-strip')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-stage')).toBeInTheDocument();
  });

  it('keeps the podium live area and occupied seat states visible in default mode', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    expect(screen.getByAltText('动物课堂主画面')).toHaveAttribute('src', '/stage/zoo-immersive-stage.svg');
    expect(screen.getByAltText('我的席位')).toHaveAttribute('src', '/avatars/reward-student.svg');
    expect(screen.getByAltText('AI 同学 Bobby')).toHaveAttribute('src', '/avatars/student-bobby.svg');
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('讲台中')).toBeInTheDocument();
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
