'use client';

import { useEffect, useMemo, useState } from "react";
import { Board, type Cell } from "@/components/Board";
import { RobotAssistant } from "@/components/RobotAssistant";
import { requestBotMove, requestSave } from "@/lib/api";
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
  const [logs, setLogs] = useState<Array<{ boardId: number; position: number }>>([]);
  const [saved, setSaved] = useState(false);

  const botSymbol = playerSymbol === "X" ? "O" : "X";

  function captureFromResponse(res: any) {
    if (!res) return;
    const boardId = (res as any).boardId ?? (res as any).id ?? (res as any).board_id;
    // dbPosition is the index in the matched DB orientation — this is what /save needs
    const dbPosition =
      (res as any).dbPosition ??
      (res as any).position ?? // fallback if server ever used "position"
      undefined;
  
    if (Number.isInteger(boardId) && Number.isInteger(dbPosition)) {
      setLogs(prev => [...prev, { boardId: Number(boardId), position: Number(dbPosition) }]);
    }
  }

  // Initialize a new game on mount or mode change
  useEffect(() => {
    const player = Math.random() < 0.5 ? "X" : "O";
    const botStarts = player === "O"; // if player is O, bot (X) starts
    setPlayerSymbol(player);
    setBoard(Array(9).fill(null));
    setHL(null);
    setStatus(botStarts ? "Bot starts." : "You start!");
    setTurn("X");
    setLogs([]);
    setSaved(false);
    if (botStarts) {
      setBusy(true);
      requestBotMove({ board: Array(9).fill(null), player: "X", mode: params.mode })
        .then(res => {
          captureFromResponse(res);
          const idx = (res && typeof (res as any).index === "number") ? (res as any).index : Math.floor(Math.random()*9);
          setBoard(prev => prev.map((c, i) => i === idx ? "X" : c));
          setTurn("O");
        })
        .finally(() => setBusy(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.mode]);

  const outcome = useMemo(() => checkWinner(board), [board]);

  useEffect(() => {
    if (!outcome) return;
    if (outcome.winner !== undefined) {
      if (outcome.winner) setStatus(outcome.winner === playerSymbol ? "You win! 🎉" : "Bot wins. 🤖");
      else setStatus("It's a draw.");
      setHL(outcome.line || null);
    }
  }, [outcome, playerSymbol]);

  // When game finishes, send accumulated logs once
  useEffect(() => {
    if (!outcome || saved) return;
    if (outcome.winner !== undefined) {
      // result from the BOT’s perspective
      const result =
        outcome.winner
          ? (outcome.winner === botSymbol ? "win" : "lose")
          : (outcome.draw ? "draw" : "draw"); // safe default
  
      // table mapping: learning -> smart (updates), static -> stupid (skips)
      const table = params.mode === "learning" ? "smart" : "stupid";
  
      // only send valid items
      const list = logs.filter(
        it => Number.isInteger(it.boardId) && Number.isInteger(it.position)
      );
  
      if (list.length > 0) {
        requestSave({ list, result, table }).then(() => setSaved(true));
      } else {
        setSaved(true);
      }
    }
    // include deps that affect the computed values
  }, [outcome, saved, logs, params.mode, botSymbol]);

  async function handleClick(i: number) {
    if (busy) return;
    if (outcome) return;
    if (turn !== playerSymbol) return;
    if (board[i]) return;

    // Player move
    const next = board.slice();
    console.log(next);
    next[i] = playerSymbol;
    setBoard(next);
    setTurn(botSymbol);

    const after = checkWinner(next);
    if (after) return; // game finished

    // Bot's turn
    setBusy(true);
    const res = await requestBotMove({ board: next, player: botSymbol, mode: params.mode });
    captureFromResponse(res);
    const idx = (res && typeof (res as any).index === "number") ? (res as any).index : next.findIndex(c => c === null);
    if (idx >= 0) {
      setBoard(prev => prev.map((c, j) => j === idx ? botSymbol : c));
      setTurn(playerSymbol);
    }
    setBusy(false);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setHL(null);
    setStatus("New game!");
    setLogs([]);
    setSaved(false);
    const player = Math.random() < 0.5 ? "X" : "O";
    const botStarts = player === "O"; // if player is O, bot (X) starts
    setPlayerSymbol(player);
    setTurn("X");
    if (botStarts) {
      setBusy(true);
      requestBotMove({ board: Array(9).fill(null), player: "X", mode: params.mode })
        .then(res => {
          captureFromResponse(res);
          const idx = (res && typeof (res as any).index === "number") ? (res as any).index : Math.floor(Math.random()*9);
          setBoard(prev => prev.map((c, i) => i === idx ? "X" : c));
          setTurn("O");
        })
        .finally(() => setBusy(false));
    }
  }

  return (
    <main className="min-h-screen px-6 py-8 flex items-start justify-center">
      <div className="max-w-5xl w-full grid md:grid-cols-[380px,1fr] gap-8">
        <div className="flex flex-col items-center gap-4">
          <Board board={board} onClick={handleClick} disabled={busy || !!outcome || turn !== playerSymbol} highlight={hl} />
          <div className="text-center">
            <div className="font-semibold">Mode: {params.mode === "learning" ? "Learning bot" : "Classic bot"}</div>
            <div className="text-sm text-gray-600 mt-1">You are <b>{playerSymbol}</b>. {status}</div>
            {outcome && <button onClick={reset} className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white">Play again</button>}
          </div>
          <Link href="/game" className="text-sm text-gray-500 hover:underline">← Back</Link>
        </div>
        <RobotAssistant busy={busy} board={board} mode={params.mode} />
      </div>
    </main>
  );
}
