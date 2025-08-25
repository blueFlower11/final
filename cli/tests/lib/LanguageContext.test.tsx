import React from 'react';
import { render, screen } from '@testing-library/react';
import { LanguageProvider, useLang } from '@/lib/lang/LanguageContext';

function Probe() {
  const { t } = useLang();
  return <div>{t('home.title')}</div>;
}

describe('LanguageContext', () => {
  it('provides translations', () => {
    render(<LanguageProvider defaultLang="en"><Probe /></LanguageProvider>);
    expect(screen.getByText('Tic‑Tac‑Toe')).toBeInTheDocument();
  });

  it('throws when used outside provider', () => {
    const { useLang: useLangHook } = require('@/lib/lang/LanguageContext');
    expect(() => useLangHook()).toThrow();
  });
});
