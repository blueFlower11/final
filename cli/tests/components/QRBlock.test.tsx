import { render, screen } from '@testing-library/react';
import React from 'react';
import { QRBlock } from '@/components/QRBlock';

describe('QRBlock', () => {
  it('renders label, qr code and url text', () => {
    render(<QRBlock label="Join" url="https://example.com/join/xyz" />);
    expect(screen.getByText('Join')).toBeInTheDocument();
    const qr = screen.getByTestId('qrcode');
    expect(qr).toHaveAttribute('data-value', 'https://example.com/join/xyz');
    expect(screen.getByText(/example\.com/)).toBeInTheDocument();
  });
});
