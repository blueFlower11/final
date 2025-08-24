import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Tic-Tac-Toe RL",
  description: "Play with a friend or two kinds of bots — one that learns!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/i18n/css/i18n.css" />
      </head>
      <body className="min-h-screen font-display">
        {children}
        <Script id="i18n-config" strategy="afterInteractive">{`window.I18N_DEFAULT="en";window.I18N_TRANSLATIONS_PATH="/i18n/translations.json";window.I18N_SWITCH_STYLE="pill";`}</Script>
        <Script src="/i18n/i18n-single.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
