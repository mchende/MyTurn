import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { LessonBoard } from '@/features/classroom-shell/lesson-board';

const baseProps = {
  currentItem: {
    imageAlt: 'Lion photo',
    imageSrc: '/lion.png',
    text: 'LION',
  },
  currentItemIndex: 0,
  progressCount: 4,
  sessionStatus: 'Teacher is leading the class round.',
  stageBadge: 'CORA LEADS',
  stagePrompt: 'Look at the picture and get ready.',
};

describe('LessonBoard', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps the target text out of the default child-facing board', () => {
    render(<LessonBoard {...baseProps} />);

    expect(screen.getAllByRole('img', { name: 'Lion photo' }).length).toBeGreaterThan(0);
    expect(screen.getByTestId('lesson-stage-badge')).toHaveTextContent(baseProps.stageBadge);
    expect(screen.getByTestId('lesson-stage-prompt')).toHaveTextContent(baseProps.stagePrompt);
    expect(screen.getByTestId('classroom-stage')).not.toHaveAccessibleName(/lion/i);
    expect(screen.queryByText(baseProps.currentItem.text)).not.toBeInTheDocument();
  });

  it('shows the target text only when the debug guard is explicitly enabled', () => {
    render(
      <LessonBoard
        {...baseProps}
        debugTargetText={baseProps.currentItem.text}
        showDebugTarget
      />,
    );

    expect(screen.getAllByText(baseProps.currentItem.text).length).toBeGreaterThan(0);
  });

  it('renders stage-specific badge and prompt copy for repeat and picture-talk rounds', () => {
    const { rerender } = render(
      <LessonBoard
        {...baseProps}
        stageBadge="Repeat after Cora · 1/5"
        stagePrompt="Say it after the model."
      />,
    );

    expect(screen.getByTestId('lesson-stage-badge')).toHaveTextContent(
      'Repeat after Cora · 1/5',
    );
    expect(screen.getByTestId('lesson-stage-prompt')).toHaveTextContent(
      'Say it after the model.',
    );

    rerender(
      <LessonBoard
        {...baseProps}
        stageBadge="Picture talk · 1/5"
        stagePrompt="Try once more."
      />,
    );

    expect(screen.getByTestId('lesson-stage-badge')).toHaveTextContent(
      'Picture talk · 1/5',
    );
    expect(screen.getByTestId('lesson-stage-prompt')).toHaveTextContent(
      'Try once more.',
    );
    expect(screen.queryByText(baseProps.currentItem.text)).not.toBeInTheDocument();
  });
});
