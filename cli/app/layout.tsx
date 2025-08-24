import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/lang/LanguageContext";

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
        <LanguageProvider>
          <LanguageToggle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
