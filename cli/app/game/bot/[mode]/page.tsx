'use client';

import { useEffect, useMemo, useState } from "react";
import { Board, type Cell } from "@/components/Board";
import { RobotAssistant } from "@/components/RobotAssistant";
import { requestBotMove } from "@/lib/api";
import Link from "next/link";

function checkWinner(b: Cell[]) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b2,c] of lines) {
    if (b[a] && b[a] === b[b2] && b[a] === b[c]) return { winner: b[a], line: [a,b2,c] as number[] };
  }
  if (b.every(Boolean)) return { winner: null, line: null, draw: true };
  return null;
}

export default function BotGame({ params }: { params: { mode: "learning" | "static" } }) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X"|"O">("X");
  const [playerSymbol, setPlayerSymbol] = useState<"X"|"O">("X");
  const [busy, setBusy] = useState(false);
  const [hl, setHL] = useState<number[]|null>(null);
  const [status, setStatus] = useState<string>("");

  const botSymbol = playerSymbol === "X" ? "O" : "X";

  useEffect(() => {
    // Randomize who starts
    const first: "player"|"bot" = Math.random() < 0.5 ? "player" : "bot";
    const player = Math.random() < 0.5 ? "X" : "O";
    setPlayerSymbol(player);
    setTurn("X"); // turn is always "X" to start logically
    setBoard(Array(9).fill(null));
    setHL(null);
    setStatus(first === "player" ? "You start!" : "Bot starts.");
    if (first === "bot") {
      // If bot is X
      const botIsX = player === "O";
      if (botIsX) {
        setBusy(true);
        requestBotMove({ board: Array(9).fill(null), player: "X", mode: params.mode })
          .then(res => {
            const idx = res?.index ?? Math.floor(Math.random()*9);
            setBoard(prev => prev.map((c, i) => i === idx ? "X" : c));
            setTurn("O");
          })
          .finally(() => setBusy(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.mode]);

  const outcome = useMemo(() => checkWinner(board), [board]);

  useEffect(() => {
    if (outcome?.winner !== undefined) {
      if (outcome.winner) setStatus(outcome.winner === playerSymbol ? "You win! 🎉" : "Bot wins. 🤖");
      else setStatus("It's a draw.");
      setHL(outcome.line || null);
    }
  }, [outcome, playerSymbol]);

  async function handleClick(i: number) {
    if (busy) return;
    if (outcome) return;
    if (turn !== playerSymbol) return;
    if (board[i]) return;

    // Player move
    const next = board.slice();
    next[i] = playerSymbol;
    setBoard(next);
    setTurn(botSymbol);

    const after = checkWinner(next);
    if (after) return; // game finished

    // Bot's turn
    setBusy(True as unknown as boolean)
