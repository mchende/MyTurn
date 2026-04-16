import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { loadLesson } from '@/features/lesson-config/load-lesson';

const lesson = loadLesson('week-01-lesson-01');

afterEach(() => {
  cleanup();
});

describe('classroom shell layout', () => {
  it('renders the dark classroom chrome with title bar, participant strip, and stage', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1900"
        sessionStatus="将要开课: 01:00"
        sessionTitle="118语感启蒙营（4月） - 113"
      />,
    );

    expect(screen.getByText('118语感启蒙营（4月） - 113')).toBeInTheDocument();
    expect(screen.getAllByText('将要开课: 01:00').length).toBeGreaterThan(0);
    expect(screen.getByText('cherry11801265')).toBeInTheDocument();
    expect(screen.getByText('Carl11801154')).toBeInTheDocument();
    expect(screen.getByText('yilia11801081')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-seat-strip')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-stage')).toBeInTheDocument();
  });

  it('keeps the lesson content available inside the stage overlay', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1900"
        sessionStatus="将要开课: 01:00"
        sessionTitle="118语感启蒙营（4月） - 113"
      />,
    );

    expect(screen.getByText('APPLE')).toBeInTheDocument();
    expect(screen.getByAltText('A red apple with a green leaf.')).toHaveAttribute(
      'src',
      '/lessons/week-01/apple.svg',
    );
  });

  it('uses a top video-strip layout and full-stage responsive shell markers', () => {
    render(
      <ClassroomShell
        lesson={lesson}
        sessionId="weekday-1900"
        sessionStatus="将要开课: 01:00"
        sessionTitle="118语感启蒙营（4月） - 113"
      />,
    );

    const strip = screen.getByTestId('classroom-seat-strip');
    const stage = screen.getByTestId('classroom-stage');

    expect(strip.className).toContain('overflow-x-auto');
    expect(strip.className).toContain('md:px-6');
    expect(stage.className).toContain('flex-1');
    expect(stage.className).toContain('overflow-hidden');
  });
});
