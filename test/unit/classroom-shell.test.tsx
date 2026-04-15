import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ClassroomShell } from '@/features/classroom-shell/classroom-shell';
import { loadLesson } from '@/features/lesson-config/load-lesson';

const lesson = loadLesson('week-01-lesson-01');

describe('classroom shell layout', () => {
  it('renders the seat strip, lesson board, stage panel, and teacher panel together', () => {
    render(<ClassroomShell lesson={lesson} sessionId="weekday-1400" />);

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Milo')).toBeInTheDocument();
    expect(screen.getByText('Seat 3')).toBeInTheDocument();
    expect(screen.getByText('Seat 4')).toBeInTheDocument();
    expect(screen.getByText('待上台')).toBeInTheDocument();
    expect(screen.getByText('Teacher Mia')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-seat-strip')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-lesson-board')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-stage-panel')).toBeInTheDocument();
    expect(screen.getByTestId('classroom-teacher-panel')).toBeInTheDocument();
  });

  it('renders the seed lesson image with stable alt text', () => {
    render(<ClassroomShell lesson={lesson} sessionId="weekday-1400" />);

    expect(screen.getByAltText('A red apple with a green leaf.')).toHaveAttribute(
      'src',
      '/lessons/week-01/apple.svg',
    );
  });

  it('exposes phone, tablet, and desktop layout markers in the classroom shell', () => {
    render(<ClassroomShell lesson={lesson} sessionId="weekday-1400" />);

    const shell = screen.getByTestId('classroom-shell');
    const roleColumn = screen.getByTestId('classroom-role-column');
    const seatStrip = screen.getByTestId('classroom-seat-strip');

    expect(shell.className).toContain('flex-col');
    expect(shell.className).toContain('md:grid');
    expect(shell.className).toContain('xl:px-10');
    expect(roleColumn.className).toContain('flex-col');
    expect(roleColumn.className).toContain('sm:grid');
    expect(roleColumn.className).toContain('md:flex');
    expect(seatStrip.className).toContain('overflow-x-auto');
    expect(seatStrip.className).toContain('md:grid');
  });
});
