import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { loadLesson } from '@/features/lesson-config/load-lesson';
import { CLASSROOM_FLOW_DURATIONS } from '@/features/classroom-shell/use-classroom-flow';

const lesson = loadLesson('week-01-lesson-01');

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

async function advanceFlow(duration: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(duration);
  });
}

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
    expect(screen.getByText('Look carefully. Can you find the APPLE?')).toBeInTheDocument();
    expect(screen.getByText('你的发言时间')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-seat-strip')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-stage')).toBeInTheDocument();
    expect(screen.getByText('老师点名中')).toBeInTheDocument();
    expect(screen.getByText('apple')).toBeInTheDocument();
  });

  it('rotates the classroom flow from teacher cue to Bobby demo and then to the student turn', async () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    expect(screen.getByAltText('我的席位')).toHaveAttribute('src', '/avatars/reward-student.svg');
    expect(screen.getByAltText('AI 同学 Bobby')).toHaveAttribute('src', '/avatars/student-bobby.svg');
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.queryByText('讲台中')).not.toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');

    await advanceFlow(CLASSROOM_FLOW_DURATIONS.teacher_prompt);

    expect(screen.getByText('Listen to Bobby first: "APPLE!"')).toBeInTheDocument();
    expect(screen.getByText('Bobby 示范中')).toBeInTheDocument();
    expect(screen.getByText('Bobby 正在示范 APPLE')).toBeInTheDocument();
    expect(screen.getByAltText('Bobby 讲台画面')).toHaveAttribute('src', '/avatars/student-bobby.svg');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'true');

    await advanceFlow(CLASSROOM_FLOW_DURATIONS.ai_model);

    expect(screen.getByText('Now it\'s your turn. Say "APPLE!"')).toBeInTheDocument();
    expect(screen.getByText('轮到你开口')).toBeInTheDocument();
    expect(screen.getByText('现在轮到你说 APPLE')).toBeInTheDocument();
    expect(screen.getByText('讲台中')).toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'true');
  });

  it('shows reward feedback and advances to the next lesson item after celebration', async () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    await advanceFlow(CLASSROOM_FLOW_DURATIONS.teacher_prompt);
    await advanceFlow(CLASSROOM_FLOW_DURATIONS.ai_model);
    await advanceFlow(CLASSROOM_FLOW_DURATIONS.student_turn);
    await advanceFlow(CLASSROOM_FLOW_DURATIONS.teacher_feedback);

    expect(screen.getAllByText('GREAT JOB!')).toHaveLength(2);
    expect(screen.getByText('Excellent!')).toBeInTheDocument();

    await advanceFlow(CLASSROOM_FLOW_DURATIONS.celebration);

    expect(screen.getByText('Look carefully. Can you find the BANANA?')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.getByText('第 2/5 轮')).toBeInTheDocument();
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

    expect(screen.getAllByText('GREAT JOB!')).toHaveLength(2);
    expect(screen.getByText('Excellent!')).toBeInTheDocument();
    expect(screen.getByText('奖励时刻')).toBeInTheDocument();
  });
});
