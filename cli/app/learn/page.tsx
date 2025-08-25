// 'use client';

// import Link from "next/link";

// export default function Learn() {
//   return (
//     <main className="min-h-screen px-6 py-12">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl sm:text-4xl font-bold" data-i18n="auto.how-the-learning-bot-improves">How the learning bot improves</h1>
//         <p className="mt-4 text-gray-700 leading-relaxed">
//           Imagine teaching a puppy to play Tic‑Tac‑Toe. At first, it guesses. When a guess leads to winning, it gets a treat;
//           when it loses, no treat. Over time, it remembers which guesses earned treats and tries those first.
//         </p>
//         <p className="mt-3 text-gray-700 leading-relaxed">
//           That&apos;s the idea of <b>reinforcement learning</b>: an agent takes actions, gets feedback (rewards), and updates
//           how likely it is to take similar actions in similar situations. Our bot treats each board state as a situation, and
//           nudges its preferences toward moves that tend to win. With more games, it becomes harder to beat.
//         </p>
//         <p className="mt-3 text-gray-700" data-i18n="auto.want-to-feel-its-growth-play-a-few-rounds-against-">Want to feel its growth? Play a few rounds against the learning bot, then come back later and try again.</p>
//         <div className="mt-6">
//           <Link className="px-4 py-2 rounded-xl bg-indigo-600 text-white" href="/game/bot/learning">Play the learning bot →</Link>
//         </div>
//       </div>
//     </main>
//   );
// }

// /app/learning/page.tsx

'use client';

import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/lang/LanguageContext";
import { stories } from "@/lib/lang/learningStories";

export default function LearningHub() {
  const { lang, t } = useLang();

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">
          {t("learning.title")}
        </h1>
        <p className="mt-2 text-gray-600">
          {t("learning.subtitle")}
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
          {stories.map((s) => (
            <Link
              key={s.slug}
              href={`/learn/${s.slug}`}
              className="group rounded-2xl p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col w-full max-w-xs"
            >
              <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-50">
                <Image src={s.cover} alt={s.title[lang] ?? s.title.en} fill className="object-cover" />
              </div>
              <div className="mt-4 text-xl font-semibold">
                {s.title[lang] ?? s.title.en}
              </div>
              <p className="mt-2 text-gray-600">
                {s.description[lang] ?? s.description.en}
              </p>
              <span className="mt-auto pt-4 text-indigo-600 group-hover:underline">
                {t("learning.read")}
              </span>
            </Link>
          ))}
        </div>
        <Link href="/" className="text-sm text-gray-500 hover:underline">{`← ${t("game.back")}`}</Link>
      </div>
    </main>
  );
}
