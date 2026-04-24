import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import type { ClassroomAudioRuntimeOverrides } from '@/features/classroom-shell/use-classroom-audio-runtime';
import { CLASSROOM_TIMINGS } from '@/features/classroom-shell/classroom-orchestrator';
import { getBobbyScriptLine } from '@/features/classroom-shell/bobby-script';
import { getTeacherScriptLine } from '@/features/classroom-shell/teacher-script';
import { useClassroomOrchestrator } from '@/features/classroom-shell/use-classroom-orchestrator';
import { loadLesson } from '@/features/lesson-config/load-lesson';

const { replaceMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

const lesson = loadLesson('week-01-lesson-01');

beforeEach(() => {
  vi.useFakeTimers();
  replaceMock.mockReset();
  FakeMediaRecorder.emitEmptyChunk = false;
  FakeMediaRecorder.instances = [];
});

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

async function advanceFlow(duration: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(duration);
  });
}

describe('classroom shell layout', () => {
  it('shows a lightweight preflight card before class and enters after speaker plus microphone checks pass', async () => {
    const runtimeOverrides = createAudioRuntimeOverrides();

    renderAudioClassroom(runtimeOverrides);

    expect(screen.getByTestId('audio-preflight-card')).toBeInTheDocument();
    expect(screen.queryByText('Cora 老师')).not.toBeInTheDocument();

    await clickAudioControl(screen.getByTestId('preflight-speaker-check'));
    await clickAudioControl(screen.getByTestId('preflight-microphone-check'));
    await act(async () => {
      await Promise.resolve();
    });

    expect(runtimeOverrides.audioService?.playCue).toHaveBeenCalledWith(
      expect.objectContaining({ speaker: 'teacher' }),
    );
    expect(screen.queryByTestId('audio-preflight-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('classroom-audio-warning')).not.toBeInTheDocument();
  });

  it('lets the user skip preflight and keeps a soft classroom warning instead of trapping entry', async () => {
    renderAudioClassroom();

    await clickAudioControl(screen.getByTestId('preflight-skip-button'));

    expect(screen.queryByTestId('audio-preflight-card')).not.toBeInTheDocument();
    expect(screen.getByText('Cora 老师')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-audio-warning')).toHaveTextContent(
      'Audio check skipped. Sound or recording may not work.',
    );
  });

  it('wires auto playback and one recording CTA into the classroom shell without exposing Bobby in picture-talk', async () => {
    const runtimeOverrides = createAudioRuntimeOverrides();
    const playCueMock = runtimeOverrides.audioService?.playCue;

    renderAudioClassroom(runtimeOverrides);

    await clickAudioControl(screen.getByTestId('preflight-skip-button'));
    await act(async () => {
      await Promise.resolve();
    });

    expect(playCueMock).toHaveBeenCalledWith(
      expect.objectContaining({ speaker: 'teacher' }),
    );

    await advanceFlow(CLASSROOM_TIMINGS.warmup);
    await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);

    expect(playCueMock).toHaveBeenCalledWith(
      expect.objectContaining({ speaker: 'bobby' }),
    );

    await advanceFlow(CLASSROOM_TIMINGS.ai_model);

    expect(
      screen.getByRole('button', { name: 'Tap to talk' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('podium-status')).toHaveTextContent(
      'Tap to talk when Cora calls on you.',
    );

    await clickAudioControl(screen.getByRole('button', { name: 'Tap to talk' }));
    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByRole('button', { name: 'Listening... tap again' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('podium-status')).toHaveTextContent(
      'Listening... tap again when you finish.',
    );

    await clickAudioControl(screen.getByRole('button', { name: 'Listening... tap again' }));
    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.queryByRole('button', { name: /tap to talk|listening\.\.\. tap again/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('podium-status')).toHaveTextContent(
      'One more second...',
    );
    expect(screen.getByTestId('teacher-audio-status')).toHaveTextContent(
      'Cora is listening carefully',
    );
    expect(screen.getByTestId('classroom-audio-debug')).toBeInTheDocument();
    expect(screen.getByTestId('debug-transcript-status')).toHaveTextContent(
      'transcript: waiting',
    );
  });

  it('keeps retry feedback lightweight when the student recording is empty', async () => {
    FakeMediaRecorder.emitEmptyChunk = true;
    renderAudioClassroom();

    await clickAudioControl(screen.getByTestId('preflight-skip-button'));
    await moveToStudentTurn({ includeWarmup: true });

    await clickAudioControl(screen.getByRole('button', { name: 'Tap to talk' }));
    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByRole('button', { name: 'Listening... tap again' }),
    ).toBeInTheDocument();

    await clickAudioControl(screen.getByRole('button', { name: 'Listening... tap again' }));

    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByTestId('podium-status')).toHaveTextContent(
      'No voice came through. Try again.',
    );
    expect(screen.queryByTestId('audio-preflight-card')).not.toBeInTheDocument();
  });

  it('hides the transcript debug HUD in production while keeping classroom copy intact', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    renderAudioClassroom();

    await clickAudioControl(screen.getByTestId('preflight-skip-button'));

    expect(screen.getByText('Cora 老师')).toBeInTheDocument();
    expect(screen.queryByTestId('classroom-audio-debug')).not.toBeInTheDocument();
  });

  it('renders the immersive shell with fixed seats and teacher-script copy', () => {
    const teacherLine = getTeacherScriptLine({
      attemptIndex: 0,
      currentItemIndex: 0,
      phase: 'warmup',
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
    expect(screen.getAllByText(teacherLine.hintLabel).length).toBeGreaterThan(0);
    expect(screen.getByTestId('classroom-seat-strip')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-stage')).toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-empty')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /i said it|i answered/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^apple$/i)).not.toBeInTheDocument();
  });

  it('keeps the side panels responsive and the podium label inside a safe layout slot', () => {
    const { container } = render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    const sidePanels = screen.getByTestId('classroom-side-panels');
    const stageBadge = screen.getByTestId('lesson-stage-badge');
    const teacherAvatar = screen.getByAltText('Cora 老师');

    expect(sidePanels).toHaveClass('grid');
    expect(sidePanels).toHaveClass('md:grid-cols-2');
    expect(sidePanels).toHaveClass('xl:grid-cols-1');
    expect(stageBadge).toHaveClass('max-w-[calc(100%-2rem)]');
    expect(teacherAvatar).toHaveClass('object-contain');

    const liveAvatar = container.querySelector('img[alt="我的摄像头占位"]');
    expect(liveAvatar).toHaveClass('aspect-square');
    expect(liveAvatar).toHaveClass('object-contain');
  });

  it('lets the classroom page scroll on smaller screens instead of clipping the lower panels', () => {
    const { container } = render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1700"
        sessionStatus="检票入场中: 02:45"
        sessionTitle="每日语感启蒙"
      />,
    );

    const main = container.querySelector('main');
    const shell = main?.querySelector('div.relative.z-10');
    const seatStrip = screen.getByTestId('classroom-seat-strip');
    const sidePanels = screen.getByTestId('classroom-side-panels');

    expect(main).toHaveClass('min-h-screen');
    expect(main).toHaveClass('overflow-y-auto');
    expect(main).toHaveClass('xl:overflow-hidden');
    expect(shell).toHaveClass('min-h-[calc(100vh-2rem)]');
    expect(shell).toHaveClass('xl:h-full');
    expect(seatStrip).toHaveClass('xl:max-w-[420px]');
    expect(sidePanels).toHaveClass('xl:overflow-y-auto');
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

    await advanceFlow(CLASSROOM_TIMINGS.warmup);
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
      attemptIndex: 0,
      currentItemIndex: 0,
      phase: 'teacher_encourage',
      participationState: 'silent',
      stageId: 'repeat-after-teacher',
      targetText: 'apple',
    });
    const retryLine = getTeacherScriptLine({
      attemptIndex: 1,
      currentItemIndex: 0,
      phase: 'student_wait',
      participationState: 'waiting',
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

    await moveToStudentTurn({ includeWarmup: true });
    await advanceFlow(CLASSROOM_TIMINGS.student_wait);

    expect(screen.getByText(encourageLine.visibleCaption)).toBeInTheDocument();
    expect(screen.queryByText(bobbyLineText('apple'))).not.toBeInTheDocument();
    expect(screen.queryByText('GREAT JOB!')).not.toBeInTheDocument();
    expect(screen.getByTestId('seat-me')).toHaveAttribute('data-on-stage', 'false');
    expect(screen.getByTestId('seat-ai')).toHaveAttribute('data-on-stage', 'false');

    await advanceFlow(CLASSROOM_TIMINGS.teacher_encourage);

    expect(screen.getByText(retryLine.visibleCaption)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'I said it' })).toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.student_wait);
    await advanceFlow(CLASSROOM_TIMINGS.teacher_fallback_model);
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
  });

  it('uses the completion hold contract to auto-return home after lesson_complete', async () => {
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

    await completeFullLesson(user);

    expect(screen.getByText('You finished class. See you next time.')).toBeInTheDocument();
    expect(screen.getAllByText('Class complete').length).toBeGreaterThan(0);
    expect(replaceMock).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2999);
    });

    expect(replaceMock).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(replaceMock).toHaveBeenCalledWith('/?completedSession=weekday-1700', {
      scroll: false,
    });
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

    await moveToStudentTurn({ includeWarmup: true });

    const repeatButton = screen.getByRole('button', { name: 'I said it' });
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);

    await clickWithUser(user, repeatButton);

    expect(screen.getByText(/Good job|Nice work|Yes\. I heard you trying carefully\./i)).toBeInTheDocument();

    await finishTurn();
    await completeRepeatAfterTeacherStage(user, 1);

    const pictureTalkButton = screen.getByRole('button', { name: 'I answered' });
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);
    expect(screen.queryByText(/Bobby goes first|Listen to Bobby|Bobby shows one/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^apple$/i)).not.toBeInTheDocument();

    await clickWithUser(user, pictureTalkButton);

    expect(screen.getByText('Nice answer.')).toBeInTheDocument();
  });

  it('keeps picture-talk retries teacher-led with a light second prompt and no Bobby rescue', async () => {
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

    await moveToPictureTalkStudentTurn(user);

    expect(screen.getByRole('button', { name: 'I answered' })).toBeInTheDocument();
    expect(screen.getByText('Picture talk · 1/5')).toBeInTheDocument();
    expect(screen.queryByText(/Bobby goes first|Listen to Bobby|Bobby shows one/i)).not.toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.student_wait);

    expect(screen.getAllByText('Look closely. What do you notice?').length).toBeGreaterThan(0);
    expect(screen.queryByText(/apple/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Bobby goes first|Listen to Bobby|Bobby shows one/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/correct|wrong|score|points/i)).not.toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.teacher_encourage);

    expect(screen.getByRole('button', { name: 'I answered' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);
    expect(screen.getAllByText('Look again and choose.').length).toBeGreaterThan(0);

    await advanceFlow(CLASSROOM_TIMINGS.student_wait);

    expect(
      screen.getAllByText('Listen once more. Then say it with Cora.').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/Bobby goes first|Listen to Bobby|Bobby shows one/i)).not.toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.teacher_fallback_model);
    expect(screen.getByRole('button', { name: 'I said it with Cora' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);

    await advanceFlow(CLASSROOM_TIMINGS.teacher_echo);
    await advanceFlow(CLASSROOM_TIMINGS.move_next);

    expect(screen.getByText('Picture talk · 2/5')).toBeInTheDocument();
  });

  it('keeps one CTA through repeat fallback and switches to I said it with Cora for the final follow', async () => {
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

    await moveToStudentTurn({ includeWarmup: true });
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);

    await advanceFlow(CLASSROOM_TIMINGS.student_wait);

    expect(screen.getByText('Say it with me. Nice and slow.')).toBeInTheDocument();
    expect(screen.queryByText(/^apple$/i)).not.toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.teacher_encourage);

    expect(screen.getByRole('button', { name: 'I said it' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);

    await advanceFlow(CLASSROOM_TIMINGS.student_wait);

    expect(
      screen.getAllByText('Listen once more. Then say it with Cora.').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/score|correct|incorrect/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^apple$/i)).not.toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.teacher_fallback_model);

    const finalFollowButton = screen.getByRole('button', {
      name: 'I said it with Cora',
    });
    expect(finalFollowButton).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);

    await clickWithUser(user, finalFollowButton);

    await advanceFlow(CLASSROOM_TIMINGS.move_next);

    expect(screen.getByText('Repeat after Cora · 2/5')).toBeInTheDocument();
  });

  it('keeps picture fallback teacher-led with one final CTA and no Bobby or answer leakage', async () => {
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

    await moveToPictureTalkStudentTurn(user);

    expect(screen.getByRole('button', { name: 'I answered' })).toBeInTheDocument();
    expect(screen.queryByText(/Bobby goes first|Listen to Bobby|Bobby shows one/i)).not.toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.student_wait);
    await advanceFlow(CLASSROOM_TIMINGS.teacher_encourage);
    await advanceFlow(CLASSROOM_TIMINGS.student_wait);

    expect(
      screen.getAllByText('Listen once more. Then say it with Cora.').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText(/apple|banana/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/score|correct|incorrect/i)).not.toBeInTheDocument();

    await advanceFlow(CLASSROOM_TIMINGS.teacher_fallback_model);

    const finalFollowButton = screen.getByRole('button', {
      name: 'I said it with Cora',
    });
    expect(finalFollowButton).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /i said it|i answered/i })).toHaveLength(1);
    expect(screen.queryByText(/Bobby goes first|Listen to Bobby|Bobby shows one/i)).not.toBeInTheDocument();

    await clickWithUser(user, finalFollowButton);
    await advanceFlow(CLASSROOM_TIMINGS.move_next);

    expect(screen.getByText('Picture talk · 2/5')).toBeInTheDocument();
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
    expect(screen.getByTestId('probe-phase')).toHaveTextContent('warmup');

    await advanceFlow(CLASSROOM_TIMINGS.warmup);
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

class FakeMediaRecorder {
  static emitEmptyChunk = false;
  static instances: FakeMediaRecorder[] = [];

  static isTypeSupported(type: string) {
    return type === 'audio/webm;codecs=opus';
  }

  readonly mimeType: string;
  readonly stream: MediaStream;

  private listeners = new Map<string, Set<(event?: unknown) => void>>();

  constructor(stream: MediaStream, options?: { mimeType?: string }) {
    this.mimeType = options?.mimeType ?? 'audio/webm;codecs=opus';
    this.stream = stream;
    FakeMediaRecorder.instances.push(this);
  }

  addEventListener(name: string, listener: (event?: unknown) => void) {
    if (!this.listeners.has(name)) {
      this.listeners.set(name, new Set());
    }

    this.listeners.get(name)?.add(listener);
  }

  start() {}

  stop() {
    const blob = FakeMediaRecorder.emitEmptyChunk
      ? new Blob([], { type: this.mimeType })
      : new Blob(['hello'], { type: this.mimeType });

    void Promise.resolve().then(() => {
      this.listeners.get('dataavailable')?.forEach((listener) => {
        listener({ data: blob });
      });
      this.listeners.get('stop')?.forEach((listener) => {
        listener();
      });
    });
  }
}

function createFakeStream() {
  const track = {
    stop: vi.fn(),
  };

  return {
    stream: {
      getTracks: () => [track],
    } as unknown as MediaStream,
    track,
  };
}

function renderAudioClassroom(
  runtimeOverrides: ClassroomAudioRuntimeOverrides = createAudioRuntimeOverrides(),
) {
  return render(
    <ClassroomShell
      audioRuntimeOverrides={runtimeOverrides}
      forceAudioPreflight
      lesson={lesson}
      sessionId="weekday-1700"
      sessionStatus="检票入场中: 02:45"
      sessionTitle="每日语感启蒙"
    />,
  );
}

function createAudioRuntimeOverrides(): ClassroomAudioRuntimeOverrides {
  return {
    MediaRecorderCtor: FakeMediaRecorder as unknown as typeof MediaRecorder,
    audioService: {
      playCue: vi.fn(async () => {}),
    },
    getUserMedia: vi.fn(async () => createFakeStream().stream),
    queryPermission: vi.fn(async () => ({
      state: 'granted',
    })),
  };
}

async function moveToStudentTurn({
  includeWarmup = false,
}: {
  includeWarmup?: boolean;
} = {}) {
  if (includeWarmup) {
    await advanceFlow(CLASSROOM_TIMINGS.warmup);
  }

  await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);
  await advanceFlow(CLASSROOM_TIMINGS.ai_model);
}

async function finishTurn() {
  await advanceFlow(CLASSROOM_TIMINGS.teacher_feedback);
  await advanceFlow(CLASSROOM_TIMINGS.move_next);
}

async function completeRepeatAfterTeacherStage(
  user?: ReturnType<typeof userEvent.setup>,
  startIndex = 0,
) {
  const actualUser =
    user ??
    userEvent.setup({
      advanceTimers: vi.advanceTimersByTime,
      delay: null,
    });

  for (let index = startIndex; index < lesson.items.length; index += 1) {
    await moveToStudentTurn({ includeWarmup: index === 0 });
    await clickWithUser(actualUser, screen.getByRole('button', { name: 'I said it' }));
    await finishTurn();
  }

  await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);
}

async function moveToPictureTalkStudentTurn(
  user: ReturnType<typeof userEvent.setup>,
) {
  await completeRepeatAfterTeacherStage(user);
}

async function completeFullLesson(user: ReturnType<typeof userEvent.setup>) {
  await moveToPictureTalkStudentTurn(user);

  for (let index = 0; index < lesson.items.length; index += 1) {
    await clickWithUser(user, screen.getByRole('button', { name: 'I answered' }));

    if (index < lesson.items.length - 1) {
      await advanceFlow(CLASSROOM_TIMINGS.teacher_feedback);
      await advanceFlow(CLASSROOM_TIMINGS.move_next);
      await advanceFlow(CLASSROOM_TIMINGS.teacher_prompt);
    }
  }

  await advanceFlow(CLASSROOM_TIMINGS.teacher_feedback);
  await advanceFlow(CLASSROOM_TIMINGS.move_next);
  await advanceFlow(CLASSROOM_TIMINGS.wrap_up);
  await advanceFlow(CLASSROOM_TIMINGS.completion_reward);
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

async function clickAudioControl(element: Element) {
  await act(async () => {
    (element as HTMLElement).click();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
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
