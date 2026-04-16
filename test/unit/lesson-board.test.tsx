import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
  it('keeps the target text out of the default child-facing board', () => {
    render(<LessonBoard {...baseProps} />);

    expect(screen.getAllByRole('img', { name: 'Lion photo' }).length).toBeGreaterThan(0);
    expect(screen.getByText(baseProps.stageBadge)).toBeInTheDocument();
    expect(screen.getByText(baseProps.stagePrompt)).toBeInTheDocument();
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
});
