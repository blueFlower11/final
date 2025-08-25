import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Board, Cell } from '@/components/Board';

describe('Board', () => {
  it('renders 9 cells and values', () => {
    const board: Cell[] = [null, 'X', 'O', null, 'X', null, 'O', null, null];
    const fn = vi.fn();
    render(<Board board={board} onClick={fn} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(9);
    expect(buttons[1]).toHaveTextContent('X');
    expect(buttons[2]).toHaveTextContent('O');
  });

  it('calls onClick with index when enabled', () => {
    const board: Cell[] = Array(9).fill(null);
    const fn = vi.fn();
    render(<Board board={board} onClick={fn} />);
    fireEvent.click(screen.getAllByRole('button')[4]);
    expect(fn).toHaveBeenCalledWith(4);
  });

  it('does not call onClick when disabled', () => {
    const board: Cell[] = Array(9).fill(null);
    const fn = vi.fn();
    render(<Board board={board} onClick={fn} disabled />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(fn).not.toHaveBeenCalled();
  });

  it('highlights provided indices', () => {
    const board: Cell[] = Array(9).fill(null);
    const fn = vi.fn();
    const { container } = render(<Board board={board} onClick={fn} highlight={[0,1,2]} />);
    const highlighted = container.querySelectorAll('.border-pink-500');
    expect(highlighted.length).toBeGreaterThanOrEqual(3);
  });
});
