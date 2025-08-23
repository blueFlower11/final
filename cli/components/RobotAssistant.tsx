'use client';

import { useEffect, useState } from "react";
import type { Cell } from "./Board";

function countEmpty(board: Cell[]) {
  return board.filter(c => !c).length;
}

export function RobotAssistant({
  busy,
  board,
  mode,
}: {
  busy: boolean;
  board: Cell[];
  mode: "learning" | "static";
}) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!busy) return;
    const empties = countEmpty(board);
    const msgs = [
      "🤖 Hmm... let me think.",
      `🤖 I see ${empties} open ${empties === 1 ? "space" : "spaces"}.`,
      mode === "learning"
        ? "🤖 I'll favor moves that worked in the past (reinforcement learning!)."
        : "🤖 I'll pick a legal move that looks okay.",
      "🤖 Considering forks, blocks, and center..."
    ];
    setLines([]);
    let i = 0;
    const id = setInterval(() => {
      setLines(prev => [...prev, msgs[i]]);
      i++;
      if (i >= msgs.length) clearInterval(id);
    }, 700);
    return () => clearInterval(id);
  }, [busy, board, mode]);

  return (
    <div className="text-sm text-gray-700 space-y-2 p-4 rounded-2xl bg-white/60 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        <div className="font-semibold">Little Robot</div>
        {busy && <span className="ml-auto animate-pulse">thinking…</span>}
      </div>
      <div className="space-y-1">
        {lines.map((l, idx) => <div key={idx}>{l}</div>)}
        {!busy && lines.length === 0 && (<div>Tap a square to make your move.</div>)}
      </div>
    </div>
  );
}
