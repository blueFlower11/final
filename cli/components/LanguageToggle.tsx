'use client';
import React from 'react';
import { useLang } from '@/lib/lang/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  const langs: Array<keyof typeof import('@/lib/lang/labels').labels> = ['en','hr'] as any;

  return (
    <div style={{
      position: 'fixed',
      top: 12, right: 12,
      zIndex: 2147483647
    }}>
      <div style={{
        display: 'flex', gap: 6,
        border: '1px solid rgba(0,0,0,.15)',
        background: 'rgba(255,255,255,.85)',
        backdropFilter: 'blur(6px)',
        borderRadius: 999, padding: '6px 8px',
        fontSize: 12, letterSpacing: '.03em'
      }}>
        {langs.map(code => (
          <button
            key={String(code)}
            onClick={() => setLang(code as any)}
            aria-pressed={lang === code}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontWeight: lang === code ? 700 : 500
            }}
          >
            {String(code).toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}