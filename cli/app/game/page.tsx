'use client';

import Link from "next/link";
import { useMemo } from "react";
import { Users, Bot, BotIcon } from "lucide-react";
import { useLang } from "@/lib/lang/LanguageContext";

export default function GameHub() {
  const { t } = useLang();
  const cards = useMemo(() => ([
    {
      href: "/game/friend",
      title: t("game.friend"),
      icon: <Users />,
      desc: t("game.friendD")
    },
    {
      href: "/game/bot/static",
      title: t("game.stupid"),
      icon: <BotIcon />,
      desc: t("game.stupidD")
    },
    {
      href: "/game/bot/learning",
      title: t("game.smart"),
      icon: <Bot />,
      desc: t("game.smartD")
    },
  ]), []);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold" data-i18n="auto.choose-your-mode">{t("game.title")}</h1>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {cards.map(card => (
            <Link key={card.href} href={card.href} className="group rounded-2xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col">
              <div className="text-2xl">{card.icon}</div>
              <div className="mt-4 text-xl font-semibold">{card.title}</div>
              <p className="mt-2 text-gray-600">{card.desc}</p>
              <span className="mt-auto text-indigo-600 group-hover:underline" data-i18n="auto.start">{`${t("game.start")} →`}</span>
            </Link>
          ))}
          <Link href="/game" className="text-sm text-gray-500 hover:underline">{`← ${t("game.back")}`}</Link>
        </div>
      </div>
    </main>
  );
}
