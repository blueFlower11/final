'use client';

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLang } from "@/lib/lang/LanguageContext";
import { stories } from "@/lib/lang/learningStories";

type PageProps = { params: { slug: string } };

export default function StoryPage({ params }: PageProps) {
  const { slug } = params;
  const { lang, t } = useLang();
  const [page, setPage] = useState(0);

  const story = useMemo(() => stories.find(s => s.slug === slug), [slug]);
  if (!story) return notFound();

  const pages = story.pages[lang] ?? story.pages.en;
  const { img, title, text } = pages[page];

  const hasPrev = page > 0;
  const hasNext = page < pages.length - 1;

  return (
    <main className="min-h-screen flex items-center justify-center bg-yellow-50 px-6 py-12">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-full md:w-[40%] h-72 md:h-96 rounded-xl overflow-hidden shadow">
          <Image src={img} alt={title} fill className="object-contain bg-yellow-50" />
        </div>

        <div className="flex-1 flex flex-col items-center text-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            {title}
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {text}
          </p>

          <div className="flex gap-4 mt-2">
            {hasPrev && (
              <button
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
              >
                {t("learning.prev")}
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
              >
                {t("learning.next")}
              </button>
            )}
          </div>

          <Link href="/learn" className="mt-4 text-indigo-600 hover:underline">
            {t("game.back")}
          </Link>
        </div>
      </div>
    </main>
  );
}
