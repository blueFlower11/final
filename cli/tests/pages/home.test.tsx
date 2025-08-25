import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { TestProviders } from '../TestProviders';

describe('Home page', () => {
  it('renders title and CTA links', () => {
    render(<Home />, { wrapper: TestProviders });
    expect(screen.getByText(/Tic‑Tac‑Toe/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Play/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Learn more/i })).toBeInTheDocument();
  });
});
