// 'use client';

// import { useEffect, useState } from "react";
// import type { Cell } from "./Board";

// function countEmpty(board: Cell[]) {
//   return board.filter(c => !c).length;
// }

// export function RobotAssistant({
//   busy,
//   board,
//   mode,
// }: {
//   busy: boolean;
//   board: Cell[];
//   mode: "learning" | "static";
// }) {
//   const [lines, setLines] = useState<string[]>([]);

//   useEffect(() => {
//     if (!busy) return;
//     const empties = countEmpty(board);
//     const msgs = [
//       "🤖 Hmm... let me think.",
//       `🤖 I see ${empties} open ${empties === 1 ? "space" : "spaces"}.`,
//       mode === "learning"
//         ? "🤖 I'll favor moves that worked in the past (reinforcement learning!)."
//         : "🤖 I'll pick a legal move that looks okay.",
//       "🤖 Considering forks, blocks, and center..."
//     ];
//     setLines([]);
//     let i = 0;
//     const id = setInterval(() => {
//       setLines(prev => [...prev, msgs[i]]);
//       i++;
//       if (i >= msgs.length) clearInterval(id);
//     }, 700);
//     return () => clearInterval(id);
//   }, [busy, board, mode]);

//   return (
//     <div className="text-sm text-gray-700 space-y-2 p-4 rounded-2xl bg-white/60 border border-gray-200 shadow-sm">
//       <div className="flex items-center gap-2">
//         <span className="text-2xl">🤖</span>
//         <div className="font-semibold">Little Robot</div>
//         {busy && <span className="ml-auto animate-pulse">thinking…</span>}
//       </div>
//       <div className="space-y-1">
//         {lines.map((l, idx) => <div key={idx}>{l}</div>)}
//         {!busy && lines.length === 0 && (<div>Tap a square to make your move.</div>)}
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from "react";

/**
 * RobotAssistant renders a bot figure next to the board.
 * A comic-style speech bubble appears ONLY while `talking` is true.
 *
 * Props:
 * - talking: boolean — when true, shows bubble and types out `text`
 * - text: string — what the bot says during this speaking session
 * - onFinished: () => void — called after the text finishes typing;
 *                BotGame will then reveal the pending move.
 */
export function RobotAssistant({
  talking,
  text,
  onFinished
}: {
  talking: boolean;
  text: string;
  onFinished?: () => void;
}) {
  const [visibleText, setVisibleText] = useState<string>("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Whenever a new "talking" session starts, type the text out.
  useEffect(() => {
    // Clear any previous typing
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setVisibleText("");

    if (talking && text) {
      const content = text;
      let i = 0;
      timerRef.current = setInterval(() => {
        i += 1;
        setVisibleText(content.slice(0, i));
        if (i >= content.length) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Small pause before we signal finished, to feel natural
          setTimeout(() => {
            onFinished?.();
          }, 400);
        }
      }, Math.max(18, Math.min(38, Math.floor(1800 / Math.max(1, content.length)))));
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = null;
    };
  }, [talking, text, onFinished]);

  return (
    <div className="relative w-[280px] h-[340px] grid place-items-center">
      {/* Bot figure */}
      <div
        className={
          "w-[200px] h-[200px] rounded-[28px] relative shadow-2xl " +
          "bg-[radial-gradient(40%_50%_at_50%_30%,#5ce1e6_0%,#33cccc_60%,#119999_100%)] " +
          (talking ? "animate-[botbob_1.4s_ease-in-out_infinite]" : "")
        }
        aria-hidden
      >
        {/* eyes */}
        <div className="absolute top-16 left-[18px] w-[34%] h-[22px] bg-[#0f0f12] rounded-[12px]" />
        <div className="absolute top-16 right-[18px] w-[34%] h-[22px] bg-[#0f0f12] rounded-[12px]" />
      </div>

      {/* Comic-style bubble (only when talking) */}
      {talking && (
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-3 max-w-[260px]
                     rounded-[14px] px-[14px] py-[12px] text-[14px] leading-tight
                     border-2 shadow-2xl
                     bg-white text-[#141417] border-[#141417]
                     dark:bg-[#1a1a1f] dark:text-[#e9e9ee] dark:border-[#2a2a33]"
          role="status"
          aria-live="polite"
        >
          <div className="max-h-[14lh] overflow-hidden">{visibleText || "…"}</div>
          {/* Tail */}
          <div
            className="absolute left-[38%] -bottom-[10px] w-[18px] h-[18px]
                       rotate-45
                       border-2 border-t-0 border-l-0
                       bg-white shadow-[3px_3px_0_0_#141417]
                       border-[#141417]
                       dark:bg-[#1a1a1f] dark:border-[#2a2a33] dark:shadow-[3px_3px_0_0_#2a2a33]"
          />
        </div>
      )}

      {/* keyframes for bobbing */}
      <style jsx>{`
        @keyframes botbob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
