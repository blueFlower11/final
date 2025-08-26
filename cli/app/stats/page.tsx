'use client';

import { API_BASE, ENDPOINT_STATS } from '@/lib/config';
import { useEffect, useState } from 'react';

type Row = {
  id: number;
  ip: string;
  smartW: number; smartD: number; smartL: number;
  stupidW: number; stupidD: number; stupidL: number;
};
type StatsResponse = {
  ok: boolean;
  count: number;
  rows: Row[];
  error?: string;
};

export default function StatsPage() {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  async function load(query?: string) {
    setLoading(true);
    const url = API_BASE + ENDPOINT_STATS;
    try {
      const res = await fetch(`${url}${query ? `?ip=${encodeURIComponent(query)}` : ''}`, { cache: 'no-store' });
      const json = await res.json();
      setData(json);
    } catch (e) {
      setData({ ok: false, count: 0, rows: [], error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Statistics</h1>

        <div className="flex gap-2 mb-4 justify-center">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Filter by IP (exact match)"
            className="border rounded px-3 py-2 w-72"
          />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={() => load(q)}>Search</button>
          <button className="px-4 py-2 rounded border" onClick={() => { setQ(''); load(); }}>Clear</button>
        </div>

        {loading ? (
          <div className="text-center">Loading…</div>
        ) : !data?.ok ? (
          <div className="text-red-600 text-center">Failed to load stats: {data?.error || 'Unknown error'}</div>
        ) : (
          <>
            <div className="mb-3 text-sm text-gray-500 text-center">Rows: {data.count}</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded bg-white">
                <thead>
                  <tr className="text-left border-b bg-indigo-50">
                    <th className="py-2 pr-4">IP</th>
                    <th className="py-2 pr-4">Smart W</th>
                    <th className="py-2 pr-4">Smart D</th>
                    <th className="py-2 pr-4">Smart L</th>
                    <th className="py-2 pr-4">Stupid W</th>
                    <th className="py-2 pr-4">Stupid D</th>
                    <th className="py-2 pr-4">Stupid L</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map(r => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 pr-4 font-mono">{r.ip}</td>
                      <td className="py-2 pr-4">{r.smartW}</td>
                      <td className="py-2 pr-4">{r.smartD}</td>
                      <td className="py-2 pr-4">{r.smartL}</td>
                      <td className="py-2 pr-4">{r.stupidW}</td>
                      <td className="py-2 pr-4">{r.stupidD}</td>
                      <td className="py-2 pr-4">{r.stupidL}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
