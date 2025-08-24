'use client';

import Link from "next/link";
import { useMemo } from "react";
import { Users, Bot, BotIcon } from "lucide-react";

export default function GameHub() {
  const cards = useMemo(() => ([
    {
      href: "/game/friend",
      title: "Play with a friend",
      icon: <Users />,
      desc: "Connect devices with QR codes and take turns."
    },
    {
      href: "/game/bot/static",
      title: "Play with a classic bot",
      icon: <BotIcon />,
      desc: "The bot plays valid moves but doesn't learn."
    },
    {
      href: "/game/bot/learning",
      title: "Play with a learning bot",
      icon: <Bot />,
      desc: "This bot updates its strategy over time."
    },
  ]), []);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold" data-i18n="auto.choose-your-mode">Choose your mode</h1>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {cards.map(card => (
            <Link key={card.href} href={card.href} className="group rounded-2xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col">
              <div className="text-2xl">{card.icon}</div>
              <div className="mt-4 text-xl font-semibold">{card.title}</div>
              <p className="mt-2 text-gray-600">{card.desc}</p>
              <span className="mt-auto text-indigo-600 group-hover:underline" data-i18n="auto.start">Start →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
