import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tic-Tac-Toe RL",
  description: "Play with a friend or two kinds of bots — one that learns!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-display">
        {children}
      </body>
    </html>
  );
}
