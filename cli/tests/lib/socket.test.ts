import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getSocket } from '@/lib/socket';
import { API_BASE } from '@/lib/config';

vi.mock('socket.io-client', () => ({
  __esModule: true,
  io: vi.fn(() => ({ id: 'socket123' })),
  Socket: class {},
}));

describe('getSocket', () => {
  beforeEach(() => {
    // Reset module cache to force re-evaluation
    vi.resetModules();
  });

  it('creates singleton socket with API_BASE', async () => {
    const { io } = await import('socket.io-client');
    const s1 = getSocket();
    const s2 = getSocket();
    expect(s1).toBe(s2);
    expect(io).toHaveBeenCalledWith(API_BASE, { transports: ['websocket'] });
  });
});
