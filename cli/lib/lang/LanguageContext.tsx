'use client';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { labels } from './labels';

type LangCode = keyof typeof labels;

type LangContextShape = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string, vars?: Record<string, string|number>) => string;
};

const LangContext = createContext<LangContextShape | null>(null);

function get(obj: any, path: string, fallback: string = ''): string {
  const val = path.split('.').reduce((o: any, k: string) => (o && k in o ? o[k] : undefined), obj);
  return (val ?? fallback) as string;
}

function interpolate(str: string, vars?: Record<string, string|number>): string {
  if (!vars) return str;
  return String(str).replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? String(vars[k]) : `{{${k}}}`));
}

export const LanguageProvider: React.FC<{ children: React.ReactNode, defaultLang?: LangCode }> = ({ children, defaultLang = 'en' }) => {
  const [lang, setLang] = useState<LangCode>((typeof window !== 'undefined' && (localStorage.getItem('app_lang') as LangCode)) || defaultLang);

  const api = useMemo<LangContextShape>(() => ({
    lang,
    setLang: (l: LangCode) => {
      setLang(l);
      if (typeof window !== 'undefined') localStorage.setItem('app_lang', l);
    },
    t: (key: string, vars?: Record<string, string|number>) => {
      const dict = labels[lang] || {};
      return interpolate(get(dict, key, key), vars);
    }
  }), [lang]);

  return <LangContext.Provider value={api}>{children}</LangContext.Provider>;
};

export function useLang(): LangContextShape {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}