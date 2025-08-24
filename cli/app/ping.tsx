'use client';

import { API_BASE, ENDPOINT_PING } from '@/lib/config';
import { useEffect } from 'react';

export default function PingClient() {
  useEffect(() => {
    const BACKEND = API_BASE || 'http://localhost:3001';

    const ping = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        await fetch(`${BACKEND}/${ENDPOINT_PING}`, {
          keepalive: true,
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timeoutId);
      } catch {}
    };

    ping();
    const id = setInterval(ping, 60_000);

    const onVisible = () => { if (document.visibilityState === 'visible') ping(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return null;
}
