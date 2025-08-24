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

// 'use client';

// import { useEffect, useRef, useState } from "react";

// /**
//  * RobotAssistant renders a bot figure next to the board.
//  * A comic-style speech bubble appears ONLY while `talking` is true.
//  *
//  * Props:
//  * - talking: boolean — when true, shows bubble and types out `text`
//  * - text: string — what the bot says during this speaking session
//  * - onFinished: () => void — called after the text finishes typing;
//  *                BotGame will then reveal the pending move.
//  */
// export function RobotAssistant({
//   talking,
//   text,
//   onFinished
// }: {
//   talking: boolean;
//   text: string;
//   onFinished?: () => void;
// }) {
//   const [visibleText, setVisibleText] = useState<string>("");
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   // Whenever a new "talking" session starts, type the text out.
//   useEffect(() => {
//     // Clear any previous typing
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//     setVisibleText("");

//     if (talking && text) {
//       const content = text;
//       let i = 0;
//       timerRef.current = setInterval(() => {
//         i += 1;
//         setVisibleText(content.slice(0, i));
//         if (i >= content.length) {
//           if (timerRef.current) {
//             clearInterval(timerRef.current);
//             timerRef.current = null;
//           }
//           // Small pause before we signal finished, to feel natural
//           setTimeout(() => {
//             onFinished?.();
//           }, 400);
//         }
//       }, Math.max(18, Math.min(38, Math.floor(1800 / Math.max(1, content.length)))));
//     }

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//       timerRef.current = null;
//     };
//   }, [talking, text, onFinished]);

//   return (
//     <div className="relative w-[280px] h-[340px] grid place-items-center">
//       {/* Bot figure */}
//       <div
//         className={
//           "w-[200px] h-[200px] rounded-[28px] relative shadow-2xl " +
//           "bg-[radial-gradient(40%_50%_at_50%_30%,#5ce1e6_0%,#33cccc_60%,#119999_100%)] " +
//           (talking ? "animate-[botbob_1.4s_ease-in-out_infinite]" : "")
//         }
//         aria-hidden
//       >
//         {/* eyes */}
//         <div className="absolute top-16 left-[18px] w-[34%] h-[22px] bg-[#0f0f12] rounded-[12px]" />
//         <div className="absolute top-16 right-[18px] w-[34%] h-[22px] bg-[#0f0f12] rounded-[12px]" />
//       </div>

//       {/* Comic-style bubble (only when talking) */}
//       {talking && (
//         <div
//           className="absolute left-1/2 -translate-x-1/2 -bottom-3 max-w-[260px]
//                      rounded-[14px] px-[14px] py-[12px] text-[14px] leading-tight
//                      border-2 shadow-2xl
//                      bg-white text-[#141417] border-[#141417]
//                      dark:bg-[#1a1a1f] dark:text-[#e9e9ee] dark:border-[#2a2a33]"
//           role="status"
//           aria-live="polite"
//         >
//           <div className="max-h-[14lh] overflow-hidden">{visibleText || "…"}</div>
//           {/* Tail */}
//           <div
//             className="absolute left-[38%] -bottom-[10px] w-[18px] h-[18px]
//                        rotate-45
//                        border-2 border-t-0 border-l-0
//                        bg-white shadow-[3px_3px_0_0_#141417]
//                        border-[#141417]
//                        dark:bg-[#1a1a1f] dark:border-[#2a2a33] dark:shadow-[3px_3px_0_0_#2a2a33]"
//           />
//         </div>
//       )}

//       {/* keyframes for bobbing */}
//       <style jsx>{`
//         @keyframes botbob {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-4px); }
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from "react";

/**
 * Classic robot avatar with a comic-style speech bubble that appears ONLY while talking.
 *
 * Props:
 * - talking: boolean — when true, bubble appears and text types out
 * - text: string — content for the speech bubble
 * - onFinished: () => void — fired after typing finishes (so the game can reveal the move)
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

  // Typewriter effect
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setVisibleText("");

    if (talking && text) {
      const content = String(text);
      let i = 0;
      // Typing speed scales with length (keeps it snappy but readable)
      const delay = Math.max(18, Math.min(38, Math.floor(1800 / Math.max(1, content.length))));
      timerRef.current = setInterval(() => {
        i += 1;
        setVisibleText(content.slice(0, i));
        if (i >= content.length) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setTimeout(() => onFinished?.(), 400);
        }
      }, delay);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [talking, text, onFinished]);

  return (
    <div className="relative w-[300px] h-[360px]">
      {/* Robot figure */}
      <div
        className={[
          "absolute left-1/2 -translate-x-1/2 top-8",
          "w-[200px] h-[200px]",
          "grid place-items-center",
          talking ? "animate-[botbob_1.4s_ease-in-out_infinite]" : "",
        ].join(" ")}
        aria-hidden
      >
        <svg
          viewBox="0 0 200 220"
          className="drop-shadow-2xl"
          role="img"
          aria-label="Robot assistant"
        >
          {/* Antenna */}
          <circle cx="100" cy="10" r="8" fill="#8B5CF6" />
          <rect x="97" y="18" width="6" height="18" rx="3" fill="#8B5CF6" />
          {/* Head */}
          <rect x="40" y="40" width="120" height="90" rx="16" fill="#D4D4D8" stroke="#111827" strokeWidth="3" />
          {/* Eyes */}
          <circle cx="75" cy="80" r="10" fill="#111827" />
          <circle cx="125" cy="80" r="10" fill="#111827" />
          {/* Mouth */}
          <rect x="70" y="105" width="60" height="12" rx="6" fill="#111827" />
          {/* Cheeks */}
          <circle cx="55" cy="95" r="6" fill="#F59E0B" opacity="0.6" />
          <circle cx="145" cy="95" r="6" fill="#F59E0B" opacity="0.6" />

          {/* Neck */}
          <rect x="92" y="130" width="16" height="16" rx="4" fill="#6B7280" />
          {/* Body */}
          <rect x="55" y="145" width="90" height="55" rx="12" fill="#9CA3AF" stroke="#111827" strokeWidth="3" />
          {/* Body lights */}
          <circle cx="80" cy="170" r="6" fill="#10B981" />
          <circle cx="100" cy="170" r="6" fill="#F59E0B" />
          <circle cx="120" cy="170" r="6" fill="#EF4444" />
        </svg>
      </div>

      {/* Comic speech bubble — appears only when talking */}
      {talking && (
        <>
          {/* On desktop, bubble to the RIGHT of the robot; on small screens, above it */}
          <div
            className={[
              "absolute",
              // mobile: centered above
              "left-1/2 -translate-x-1/2 top-0",
              // md+: to the right side
              "md:left-[calc(50%+140px)] md:top-14 md:-translate-x-0",
              "max-w-[340px] rounded-2xl px-5 py-4 text-[16px] md:text-[17px] leading-relaxed font-medium tracking-wide",
              "border-2 shadow-2xl z-10",
              "bg-white text-[#141417] border-[#141417]",
              "dark:bg-[#1a1a1f] dark:text-[#e9e9ee] dark:border-[#2a2a33]",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <div className="whitespace-pre-wrap">{visibleText || "…"}</div>
            {/* Tail — points toward the robot */}
            {/* mobile (tail downwards) */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[10px] w-[18px] h-[18px] rotate-45
                         border-2 border-t-0 border-l-0
                         bg-white shadow-[3px_3px_0_0_#141417]
                         border-[#141417]
                         dark:bg-[#1a1a1f] dark:border-[#2a2a33] dark:shadow-[3px_3px_0_0_#2a2a33]
                         md:hidden"
            />
            {/* desktop (tail to the left) */}
            <div
              className="hidden md:block absolute -left-[10px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] rotate-45
                         border-2 border-b-0 border-r-0
                         bg-white shadow-[-3px_-3px_0_0_#141417]
                         border-[#141417]
                         dark:bg-[#1a1a1f] dark:border-[#2a2a33] dark:shadow-[-3px_-3px_0_0_#2a2a33]"
            />
          </div>
        </>
      )}

      {/* Keyframes for bobbing animation */}
      <style jsx>{`
        @keyframes botbob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
