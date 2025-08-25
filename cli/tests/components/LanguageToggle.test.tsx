import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import LanguageToggle from '@/components/LanguageToggle';
import { TestProviders } from '../TestProviders';

describe('LanguageToggle', () => {
  it('renders EN and HR buttons and toggles', () => {
    render(<LanguageToggle />, { wrapper: TestProviders });
    const en = screen.getByRole('button', { name: /EN/i });
    const hr = screen.getByRole('button', { name: /HR/i });
    expect(en).toBeInTheDocument();
    expect(hr).toBeInTheDocument();
    // Click HR and expect aria-pressed on HR
    fireEvent.click(hr);
    expect(hr).toHaveAttribute('aria-pressed', 'true');
  });
});
