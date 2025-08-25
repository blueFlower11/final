import React from 'react';
import { LanguageProvider } from '@/lib/lang/LanguageContext';

export const TestProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <LanguageProvider defaultLang="en">{children}</LanguageProvider>;
};
