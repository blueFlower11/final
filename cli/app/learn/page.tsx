'use client';

import Link from "next/link";

export default function Learn() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold">How the learning bot improves</h1>
        <p className="mt-4 text-gray-700 leading-relaxed">
          Imagine teaching a puppy to play Tic‑Tac‑Toe. At first, it guesses. When a guess leads to winning, it gets a treat;
          when it loses, no treat. Over time, it remembers which guesses earned treats and tries those first.
        </p>
        <p className="mt-3 text-gray-700 leading-relaxed">
          That&apos;s the idea of <b>reinforcement learning</b>: an agent takes actions, gets feedback (rewards), and updates
          how likely it is to take similar actions in similar situations. Our bot treats each board state as a situation, and
          nudges its preferences toward moves that tend to win. With more games, it becomes harder to beat.
        </p>
        <p className="mt-3 text-gray-700">
          Want to feel its growth? Play a few rounds against the learning bot, then come back later and try again.
        </p>
        <div className="mt-6">
          <Link className="px-4 py-2 rounded-xl bg-indigo-600 text-white" href="/game/bot/learning">Play the learning bot →</Link>
        </div>
      </div>
    </main>
  );
}
