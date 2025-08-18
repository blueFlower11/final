import React from "react";
import Square from "./Square";

export default function Board({ squares, onMove }) {
  return (
    <div className="board">
      {squares.map((val, idx) => (
        <Square key={idx} value={val} onClick={() => onMove(idx)} />
      ))}
    </div>
  );
}
