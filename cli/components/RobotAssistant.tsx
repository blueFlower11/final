'use client';

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setVisibleText("");

    if (talking && text) {
      const content = String(text);
      let i = 0;
      const delay = Math.max(18, Math.min(38, Math.floor(1800 / Math.max(1, content.length))));
      timerRef.current = setInterval(() => {
        i += 1;
        setVisibleText(content.slice(0, i));
        if (i >= content.length) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setTimeout(() => onFinished?.(), 2000);
        }
      }, delay);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [talking, text, onFinished]);

  return (
    <div className="relative w-[300px] h-[360px] grid place-items-center">
      <div className="relative w-[200px] h-[200px] grid place-items-center">
        <div className={talking ? "bot-bob will-change-transform" : ""}>
          <svg
            viewBox="0 0 200 220"
            className="drop-shadow-2xl block"
            role="img"
            aria-label="Robot assistant"
            width="200"
            height="220"
          >
            <circle cx="100" cy="10" r="8" fill="#8B5CF6" />
            <rect x="97" y="18" width="6" height="18" rx="3" fill="#8B5CF6" />
            <rect x="40" y="40" width="120" height="90" rx="16" fill="#D4D4D8" stroke="#111827" strokeWidth="3" />
            <circle cx="75" cy="80" r="10" fill="#111827" />
            <circle cx="125" cy="80" r="10" fill="#111827" />
            <rect x="70" y="105" width="60" height="12" rx="6" fill="#111827" />
            <circle cx="55" cy="95" r="6" fill="#F59E0B" opacity="0.6" />
            <circle cx="145" cy="95" r="6" fill="#F59E0B" opacity="0.6" />

            <rect x="92" y="130" width="16" height="16" rx="4" fill="#6B7280" />
            <rect x="55" y="145" width="90" height="55" rx="12" fill="#9CA3AF" stroke="#111827" strokeWidth="3" />
            <circle cx="80" cy="170" r="6" fill="#10B981" />
            <circle cx="100" cy="170" r="6" fill="#F59E0B" />
            <circle cx="120" cy="170" r="6" fill="#EF4444" />
          </svg>
        </div>

        {talking && (
          <div
            className={[
              "absolute z-10",
              "left-1/2 -translate-x-1/2 -top-4 w-[92vw] max-w-[360px]",
              "md:left-full md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:ml-4 md:w-[250px] lg:w-[260px] md:max-w-none",
              "rounded-2xl px-5 py-3",
              "text-[16px] md:text-[17px] leading-tight font-medium",
              "whitespace-normal break-normal",
              "border-2 shadow-2xl",
              "bg-white text-[#141417] border-[#141417]",
              "dark:bg-[#1a1a1f] dark:text-[#e9e9ee] dark:border-[#2a2a33]"
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <div>{visibleText || "…"}</div>

            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-[12px] w-[22px] h-[22px] rotate-45
                         border-2 border-t-0 border-l-0
                         bg-white shadow-[3px_3px_0_0_#141417]
                         border-[#141417]
                         dark:bg-[#1a1a1f] dark:border-[#2a2a33] dark:shadow-[3px_3px_0_0_#2a2a33]
                         md:hidden"
            />
            <div
              className="hidden md:block absolute -left-[10px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] rotate-45
                         border-2 border-b-0 border-r-0
                         bg-white shadow-[-3px_-3px_0_0_#141417]
                         border-[#141417]
                         dark:bg-[#1a1a1f] dark:border-[#2a2a33] dark:shadow-[-3px_-3px_0_0_#2a2a33]"
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .bot-bob {
          animation: botbob 1.4s ease-in-out infinite;
        }
        @keyframes botbob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
