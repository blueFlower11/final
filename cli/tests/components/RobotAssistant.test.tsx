import { render, screen } from '@testing-library/react';
import React from 'react';
import { RobotAssistant } from '@/components/RobotAssistant';
import { act } from 'react-dom/test-utils';

describe('RobotAssistant', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('reveals text over time and calls onFinished', () => {
    const onFinished = vi.fn();
    render(<RobotAssistant talking text="Hello" onFinished={onFinished} />);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
    expect(onFinished).toHaveBeenCalled();
  });
});
