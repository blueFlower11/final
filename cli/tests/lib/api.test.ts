import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestBotMove } from '@/lib/api';
import { API_BASE, ENDPOINT_MOVE } from '@/lib/config';

const buildUrl = (b: string, p: string, m: string) =>
  `${API_BASE}${ENDPOINT_MOVE}?board=${encodeURIComponent(b)}&player=${p}&mode=${m}`;

afterEach(() => {
  vi.restoreAllMocks();
});

it('calls move endpoint and returns JSON on success', async () => {
  const json = vi.fn().mockResolvedValue({ index: 4 });
  // @ts-ignore
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json });
  const res = await requestBotMove({ board: ['X',null,null,null,'O',null,null,null,null], player: 'X', mode: 'smart' as any });
  expect(global.fetch).toHaveBeenCalled();
  expect(res).toEqual({ index: 4 });
});

it('handles HTTP error', async () => {
  const json = vi.fn().mockResolvedValue({ error: 'Bad' });
  // @ts-ignore
  global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json });
  const res = await requestBotMove({ board: Array(9).fill(null), player: 'O', mode: 'stupid' as any });
  expect(res).toEqual({ ok: false, error: 'Bad' });
});
