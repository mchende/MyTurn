import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
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
      currentItemIndex: 0,
      phase: 'teacher_prompt',
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
    expect(screen.getByText(teacherLine.spokenLine)).toBeInTheDocument();
    expect(screen.getByText(teacherLine.hintLabel)).toBeInTheDocument();
    expect(screen.getByTestId('classroom-seat-strip')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-stage')).toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-empty')).toBeInTheDocument();
    expect(screen.queryByText(/^apple$/i)).not.toBeInTheDocument();
  });

  it('keeps three fixed seats while Bobby demos before the student turn', async () => {
    const bobbyLine = getBobbyScriptLine({
      currentItemIndex: 0,
      phase: 'ai_model',
      targetText: 'apple',
    });
    const teacherAiLine = getTeacherScriptLine({
      currentItemIndex: 0,
      phase: 'ai_model',
      targetText: 'apple',
    });
    const teacherStudentLine = getTeacherScriptLine({
      currentItemIndex: 0,
      phase: 'student_wait',
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

    expect(screen.getByText(teacherAiLine.spokenLine)).toBeInTheDocument();
    expect(screen.getByText(bobbyLine?.hintLabel ?? '')).toBeInTheDocument();
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'true');
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-empty')).toBeInTheDocument();
    expect(screen.getAllByText('讲台中')).toHaveLength(1);

    await advanceFlow(CLASSROOM_TIMINGS.ai_model);

    expect(screen.getByText(teacherStudentLine.spokenLine)).toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'true');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-empty')).toBeInTheDocument();
  });

  it('keeps the teacher in control during silence handling and does not auto-show reward', async () => {
    const encourageLine = getTeacherScriptLine({
      currentItemIndex: 0,
      phase: 'teacher_encourage',
      targetText: 'apple',
    });
    const echoLine = getTeacherScriptLine({
      currentItemIndex: 0,
      phase: 'teacher_echo',
      targetText: 'apple',
    });
    const bananaPromptLine = getTeacherScriptLine({
      currentItemIndex: 1,
      phase: 'teacher_prompt',
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

    expect(screen.getByText(encourageLine.spokenLine)).toBeInTheDocument();
    expect(screen.queryByText(bobbyLineText('apple'))).not.toBeInTheDocument();
    expect(screen.queryByText('GREAT JOB!')).not.toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'false');

    await advanceFlow(CLASSROOM_TIMINGS.teacher_encourage);

    expect(screen.getByText(echoLine.spokenLine)).toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.teacher_echo);
    await advanceFlow(CLASSROOM_TIMINGS.move_next);

    expect(screen.getByText(bananaPromptLine.spokenLine)).toBeInTheDocument();
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
    expect(screen.getAllByText('奖励时刻')).toHaveLength(2);
  });
});

describe('classroom shell hook contract', () => {
  it('exposes stage-aware fields and confirmStudentParticipation to shell consumers', async () => {
    render(<ClassroomHookProbe />);

    expect(screen.getByTestId('probe-stage-id')).toHaveTextContent('repeat-after-teacher');
    expect(screen.getByTestId('probe-stage-index')).toHaveTextContent('0');
    expect(screen.getByTestId('probe-stage-item-index')).toHaveTextContent('0');
    expect(screen.getByTestId('probe-attempt-index')).toHaveTextContent('0');
    expect(screen.getByTestId('probe-phase')).toHaveTextContent('teacher_prompt');

    await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);
    await advanceFlow(CLASSROOM_TIMINGS.ai_model);

    expect(screen.getByTestId('probe-phase')).toHaveTextContent('student_wait');

    fireEvent.click(screen.getByRole('button', { name: 'Confirm student participation' }));

    expect(screen.getByTestId('probe-phase')).toHaveTextContent('teacher_feedback');
    expect(screen.getByTestId('probe-attempt-index')).toHaveTextContent('1');
  });
});

function bobbyLineText(targetText: string) {
  return getBobbyScriptLine({
    currentItemIndex: 0,
    phase: 'ai_model',
    targetText,
  })?.spokenLine;
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
