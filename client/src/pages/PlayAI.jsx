import React, { useState } from "react";
import Board from "../components/Board";
import api from "../services/api";
import { calculateWinner } from "../utils/tictactoe";

export default function PlayAI() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const winner = calculateWinner(board);

  const handleMove = async (idx) => {
    if (board[idx] || winner || turn !== "X") return;
    const newBoard = [...board];
    newBoard[idx] = "X";
    setBoard(newBoard);
    setTurn("O");

    const res = await api.post("/game/ai-move", { board: newBoard });
    if (res.data.move !== null) {
      newBoard[res.data.move] = "O";
      setBoard(newBoard);
    }
    setTurn("X");
  };

  return (
    <div>
      <Board squares={board} onMove={handleMove} />
      <p>{winner ? `Winner: ${winner}` : `Turn: ${turn}`}</p>
    </div>
  );
}
