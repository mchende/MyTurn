import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { CLASSROOM_TIMINGS } from '@/features/classroom-shell/classroom-orchestrator';
import { getBobbyScriptLine } from '@/features/classroom-shell/bobby-script';
import { getTeacherScriptLine } from '@/features/classroom-shell/teacher-script';
import { useClassroomOrchestrator } from '@/features/classroom-shell/use-classroom-orchestrator';
import { loadLesson } from '@/features/lesson-config/load-lesson';

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
  it('renders the immersive shell with fixed seats and teacher-script copy', () => {
    const teacherLine = getTeacherScriptLine({
      attemptIndex: 0,
      currentItemIndex: 0,
      phase: 'teacher_prompt',
      participationState: 'idle',
      stageId: 'repeat-after-teacher',
      targetText: 'apple',
    });

    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    expect(screen.getByText('MyTurn')).toBeInTheDocument();
    expect(screen.getByText('Cora 老师')).toBeInTheDocument();
    expect(screen.getByText(teacherLine.visibleCaption)).toBeInTheDocument();
    expect(screen.getByText(teacherLine.hintLabel)).toBeInTheDocument();
    expect(screen.getByTestId('classroom-seat-strip')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-stage')).toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-empty')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /i said it|i answered/i })).not.toBeInTheDocument();
    expect(screen.queryByText(teacherLine.spokenModel)).not.toBeInTheDocument();
    expect(screen.queryByText(/^apple$/i)).not.toBeInTheDocument();
  });

  it('keeps three fixed seats while Bobby demos before the student turn', async () => {
    const bobbyLine = getBobbyScriptLine({
      currentItemIndex: 0,
      phase: 'ai_model',
      stageId: 'repeat-after-teacher',
      targetText: 'apple',
    });
    const teacherAiLine = getTeacherScriptLine({
      attemptIndex: 0,
      currentItemIndex: 0,
      phase: 'ai_model',
      participationState: 'idle',
      stageId: 'repeat-after-teacher',
      targetText: 'apple',
    });
    const teacherStudentLine = getTeacherScriptLine({
      attemptIndex: 0,
      currentItemIndex: 0,
      phase: 'student_wait',
      participationState: 'waiting',
      stageId: 'repeat-after-teacher',
      targetText: 'apple',
    });

    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);

    expect(screen.getByText(teacherAiLine.visibleCaption)).toBeInTheDocument();
    expect(screen.getByText(bobbyLine?.hintLabel ?? '')).toBeInTheDocument();
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'true');
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-empty')).toBeInTheDocument();
    expect(screen.getAllByText('讲台中')).toHaveLength(1);

    await advanceFlow(CLASSROOM_TIMINGS.ai_model);

    expect(screen.getByText(teacherStudentLine.visibleCaption)).toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'true');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-empty')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'I said it' })).toHaveLength(1);
    expect(screen.queryByText(/^apple$/i)).not.toBeInTheDocument();
  });

  it('keeps the teacher in control during silence handling and does not auto-show reward', async () => {
    const encourageLine = getTeacherScriptLine({
      attemptIndex: 1,
      currentItemIndex: 0,
      phase: 'teacher_encourage',
      participationState: 'silent',
      stageId: 'repeat-after-teacher',
      targetText: 'apple',
    });
    const echoLine = getTeacherScriptLine({
      attemptIndex: 1,
      currentItemIndex: 0,
      phase: 'teacher_echo',
      participationState: 'encouraged',
      stageId: 'repeat-after-teacher',
      targetText: 'apple',
    });
    const bananaPromptLine = getTeacherScriptLine({
      attemptIndex: 0,
      currentItemIndex: 1,
      phase: 'teacher_prompt',
      participationState: 'idle',
      stageId: 'repeat-after-teacher',
      targetText: 'banana',
    });

    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);
    await advanceFlow(CLASSROOM_TIMINGS.ai_model);
    await advanceFlow(CLASSROOM_TIMINGS.student_wait);

    expect(screen.getByText(encourageLine.visibleCaption)).toBeInTheDocument();
    expect(screen.queryByText(bobbyLineText('apple'))).not.toBeInTheDocument();
    expect(screen.queryByText('GREAT JOB!')).not.toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'false');

    await advanceFlow(CLASSROOM_TIMINGS.teacher_encourage);

    expect(screen.getByText(echoLine.visibleCaption)).toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.teacher_echo);
    await advanceFlow(CLASSROOM_TIMINGS.move_next);

    expect(screen.getByText(bananaPromptLine.visibleCaption)).toBeInTheDocument();
    expect(screen.queryByText('GREAT JOB!')).not.toBeInTheDocument();
  });

  it('switches the main stage into the reward feedback state only when requested', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
        showReward
      />,
    );

    expect(screen.getAllByText('GREAT JOB!')).toHaveLength(1);
    expect(screen.getAllByText('Reward time')).toHaveLength(2);
  });

  it('uses one classroom confirmation button to progress repeat-after-teacher and picture-talk turns', async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
      delay: null,
    });

    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    await moveToStudentTurn();

    const repeatButton = screen.getByRole('button', { name: 'I said it' });
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);

    await clickWithUser(user, repeatButton);

    expect(screen.getByText(/Good job|Nice work|Yes\. I heard you trying carefully\./i)).toBeInTheDocument();

    await finishTurn();
    await completeRepeatAfterTeacherStage(user);

    const pictureTalkButton = screen.getByRole('button', { name: 'I answered' });
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);
    expect(screen.queryByText(/Bobby goes first|Listen to Bobby|Bobby shows one/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^apple$/i)).not.toBeInTheDocument();

    await clickWithUser(user, pictureTalkButton);

    expect(screen.getByText(/Good job|Nice work|Yes\. I heard you trying carefully\./i)).toBeInTheDocument();
  });
});

describe('classroom shell hook contract', () => {
  it('exposes stage-aware fields and confirmStudentParticipation to shell consumers', async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
      delay: null,
    });

    render(<ClassroomHookProbe />);

    expect(screen.getByTestId('probe-stage-id')).toHaveTextContent('repeat-after-teacher');
    expect(screen.getByTestId('probe-stage-index')).toHaveTextContent('0');
    expect(screen.getByTestId('probe-stage-item-index')).toHaveTextContent('0');
    expect(screen.getByTestId('probe-attempt-index')).toHaveTextContent('0');
    expect(screen.getByTestId('probe-phase')).toHaveTextContent('teacher_prompt');

    await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);
    await advanceFlow(CLASSROOM_TIMINGS.ai_model);

    expect(screen.getByTestId('probe-phase')).toHaveTextContent('student_wait');

    await clickWithUser(
      user,
      screen.getByRole('button', { name: 'Confirm student participation' }),
    );

    expect(screen.getByTestId('probe-phase')).toHaveTextContent('teacher_feedback');
    expect(screen.getByTestId('probe-attempt-index')).toHaveTextContent('1');
  });
});

function bobbyLineText(targetText: string) {
  return getBobbyScriptLine({
    currentItemIndex: 0,
    phase: 'ai_model',
    stageId: 'repeat-after-teacher',
    targetText,
  })?.spokenLine;
}

async function moveToStudentTurn() {
  await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);
  await advanceFlow(CLASSROOM_TIMINGS.ai_model);
}

async function finishTurn() {
  await advanceFlow(CLASSROOM_TIMINGS.teacher_feedback);
  await advanceFlow(CLASSROOM_TIMINGS.move_next);
}

async function completeRepeatAfterTeacherStage(user: ReturnType<typeof userEvent.setup>) {
  for (let index = 1; index < lesson.items.length; index += 1) {
    await moveToStudentTurn();
    await clickWithUser(user, screen.getByRole('button', { name: 'I said it' }));
    await finishTurn();
  }

  await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);
}

async function clickWithUser(
  user: ReturnType<typeof userEvent.setup>,
  element: Element,
) {
  await act(async () => {
    void user.click(element);
    await Promise.resolve();
  });
}

function ClassroomHookProbe() {
  const orchestrator = useClassroomOrchestrator({
    lesson,
  });

  return (
    <div>
      <div data-testid="probe-stage-id">{orchestrator.currentStageId}</div>
      <div data-testid="probe-stage-index">{orchestrator.currentStageIndex}</div>
      <div data-testid="probe-stage-item-index">{orchestrator.currentStageItemIndex}</div>
      <div data-testid="probe-attempt-index">{orchestrator.attemptIndex}</div>
      <div data-testid="probe-phase">{orchestrator.phase}</div>
      <button onClick={() => orchestrator.confirmStudentParticipation()} type="button">
        Confirm student participation
      </button>
    </div>
  );
}
