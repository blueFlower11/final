'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Brain } from "lucide-react";
import { useLang } from "@/lib/lang/LanguageContext";

export default function Home() {
  const { lang } = useLang();
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600"
        >
          Tic‑Tac‑Toe with a Learning Bot
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 text-lg text-gray-600"
        >
          A playful experiment in strategy: battle a friend, a classic bot, or a bot that improves by playing.
        </motion.p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/game"
            className="inline-flex items-center justify-center rounded-2xl px-6 py-4 text-lg font-semibold shadow-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            <Gamepad2 className="mr-2" /> Play
          </Link>
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-2xl px-6 py-4 text-lg font-semibold shadow-lg bg-white border border-gray-200 hover:border-gray-300"
          >
            <Brain className="mr-2" /> Learn more
          </Link>
        </div>
      </div>
    </main>
  );
}
