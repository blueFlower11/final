import React from "react";

export type Cell = "X" | "O" | null;

type BoardProps = {
  board: Cell[];
  onClick: (i: number) => void;
  disabled?: boolean;
  highlight?: number[] | null;
  heatmap?: (string | null)[];
};

export function BoardFriend({
  board,
  onClick,
  disabled = false,
  highlight = null,
  heatmap,
}: BoardProps) {
  return (
    <div
      className="grid grid-cols-3 gap-2"
      style={{
        width: 320,
        touchAction: "manipulation",         
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const value = board[i];
        const isHighlighted = highlight?.includes(i) ?? false;

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) onClick(i);
        };

        const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) onClick(i);
        };

        return (
          <button
            key={i}
            type="button"
            onClick={handleClick}
            onTouchStart={handleTouch}
            aria-disabled={disabled}
            disabled={false}
            className={[
              "flex items-center justify-center",
              "h-24 w-24 rounded-xl border text-4xl font-bold select-none",
              isHighlighted ? "border-blue-500" : "border-gray-300",
              disabled ? "opacity-60 cursor-not-allowed" : "active:scale-[0.98] transition-transform",
            ].join(" ")}
            style={{
              background: heatmap?.[i] ?? "white",
              pointerEvents: "auto",
              position: "relative",
              zIndex: 0,
            }}
          >
            {value ?? ""}
          </button>
        );
      })}
    </div>
  );
}
