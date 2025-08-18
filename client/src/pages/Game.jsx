import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Board from "../components/Board";
import { calculateWinner } from "../utils/tictactoe";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3001");

export default function Game() {
  const { id } = useParams();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const winner = calculateWinner(board);

  useEffect(() => {
    socket.emit("joinGame", id);

    socket.on("moveMade", ({ index, player }) => {
      setBoard((prev) => {
        const newBoard = [...prev];
        newBoard[index] = player;
        return newBoard;
      });
      setTurn((prev) => (prev === "X" ? "O" : "X"));
    });

    return () => socket.off("moveMade");
  }, [id]);

  const handleMove = (idx) => {
    if (board[idx] || winner) return;
    socket.emit("makeMove", { gameId: id, index: idx, player: turn });
  };

  return (
    <div>
      <Board squares={board} onMove={handleMove} />
      <p>{winner ? `Winner: ${winner}` : `Turn: ${turn}`}</p>
    </div>
  );
}
