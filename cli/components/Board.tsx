'use client';

import React from "react";

export type Cell = "X" | "O" | null;

export function Board({
  board,
  onClick,
  disabled,
  highlight,
}: {
  board: Cell[];
  onClick: (i: number) => void;
  disabled?: boolean;
  highlight?: number[] | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 w-[min(90vw,360px)]">
      {board.map((cell, i) => {
        const isHL = highlight?.includes(i);
        return (
          <button
            key={i}
            onClick={() => !disabled && onClick(i)}
            disabled={disabled || !!cell}
            className={`aspect-square rounded-2xl border-2 text-4xl font-bold flex items-center justify-center transition
              ${isHL ? "border-pink-500 bg-pink-50" : "border-gray-300 bg-white hover:bg-gray-50 active:scale-[0.98]"} 
              disabled:cursor-not-allowed disabled:opacity-75
            `}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}
