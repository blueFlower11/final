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

function pickBotLine(who: "X" | "O", situation?: "start" | "block" | "win" | "random") {
  const piece = who;
  const phrases = {
    start: [
      `I'll start with ${piece} here.`,
      `Opening move! ${piece} sets the tone.`,
      `${piece} in a strong spot to begin.`,
    ],
    block: [
      `I see that threat — blocking with ${piece}.`,
      `Not so fast! ${piece} stops your line.`,
      `I'll block your plan using ${piece}.`,
    ],
    win: [
      `This should clinch it with ${piece}.`,
      `Dropping ${piece} here to finish the job.`,
      `Looks winning — ${piece} goes there.`,
    ],
    random: [
      `Hmm, ${piece} feels right here.`,
      `Let’s try ${piece} in this spot.`,
      `I’ll place ${piece} there and see.`,
    ]
  } as const;

  const pool = phrases[situation || "random"];
  return pool[Math.floor(Math.random() * pool.length)];
}

function isWinningMove(b: Cell[], idx: number, sym: "X"|"O") {
  const test = b.slice();
  test[idx] = sym;
  const out = checkWinner(test);
  return !!(out && out.winner === sym);
}
function isBlockingMove(b: Cell[], idx: number, sym: "X"|"O") {
  const opp: "X"|"O" = sym === "X" ? "O" : "X";
  const test = b.slice();
  test[idx] = opp;
  const out = checkWinner(test);
  return !!(out && out.winner === opp);
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
  const [botTalking, setBotTalking] = useState(false);
  const [botScript, setBotScript] = useState<string>("");
  const [pendingBotIdx, setPendingBotIdx] = useState<number|null>(null);

  const botSymbol = playerSymbol === "X" ? "O" : "X";

  function captureFromResponse(res: any) {
    if (!res) return;
    const boardId = (res as any).boardId ?? (res as any).id ?? (res as any).board_id;
    const dbPosition =
      (res as any).dbPosition ??
      (res as any).position ??
      undefined;
  
    if (Number.isInteger(boardId) && Number.isInteger(dbPosition)) {
      setLogs(prev => [...prev, { boardId: Number(boardId), position: Number(dbPosition) }]);
    }
  }

  function revealPendingBotMove() {
    if (pendingBotIdx == null) return;
    setBoard(prev => prev.map((c, j) => j === pendingBotIdx ? botSymbol : c));
    setPendingBotIdx(null);
    setTurn(playerSymbol);
    setBotTalking(false);
    setBusy(false);
  }

  useEffect(() => {
    const player = Math.random() < 0.5 ? "X" : "O";
    const botStarts = player === "O";
    setPlayerSymbol(player);
    setBoard(Array(9).fill(null));
    setHL(null);
    setStatus(botStarts ? "Bot starts." : "You start!");
    setTurn("X");
    setLogs([]);
    setSaved(false);
    if (botStarts) {
      (async () => {
        setBusy(true);
        const res = await requestBotMove({ board: Array(9).fill(null), player: "X", mode: params.mode });
        captureFromResponse(res);
        const idx = (res && typeof (res as any).index === "number")
          ? (res as any).index
          : Math.floor(Math.random() * 9);

        setPendingBotIdx(idx);
        const situation: "start" | "block" | "win" | "random" =
          isWinningMove(Array(9).fill(null), idx, "X") ? "win" : "start";
        setBotScript(pickBotLine("X", situation));
        setBotTalking(true);
      })().catch(() => {
        const idx = Math.floor(Math.random() * 9);
        setPendingBotIdx(idx);
        setBotScript(`I'll start here to control the board.`);
        setBotTalking(true);
        setBusy(true);
      });
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

  useEffect(() => {
    if (!outcome || saved) return;
    if (outcome.winner !== undefined) {
      const result =
        outcome.winner
          ? (outcome.winner === botSymbol ? "win" : "lose")
          : (outcome.draw ? "draw" : "draw");
  
      const table = params.mode === "learning" ? "smart" : "stupid";
  
      const list = logs.filter(
        it => Number.isInteger(it.boardId) && Number.isInteger(it.position)
      );
  
      if (list.length > 0) {
        requestSave({ list, result, table }).then(() => setSaved(true));
      } else {
        setSaved(true);
      }
    }
  }, [outcome, saved, logs, params.mode, botSymbol]);

  async function handleClick(i: number) {
    if (busy) return;
    if (outcome) return;
    if (turn !== playerSymbol) return;
    if (board[i]) return;

    const next = board.slice();
    next[i] = playerSymbol;
    setBoard(next);
    setTurn(botSymbol);

    const after = checkWinner(next);
    if (after) return;

    setBusy(true);
    const res = await requestBotMove({ board: next, player: botSymbol, mode: params.mode });
    captureFromResponse(res);
    const idx = (res && typeof (res as any).index === "number") ? (res as any).index : next.findIndex(c => c === null);

    if (idx >= 0) {
      setPendingBotIdx(idx);
      const situation: "start" | "block" | "win" | "random" =
        isWinningMove(next, idx, botSymbol) ? "win"
        : isBlockingMove(next, idx, botSymbol) ? "block"
        : "random";

      setBotScript(pickBotLine(botSymbol, situation));
      setBotTalking(true);
    } else {
      setBusy(false);
      setTurn(playerSymbol);
    }
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setHL(null);
    setStatus("New game!");
    setLogs([]);
    setSaved(false);
    const player = Math.random() < 0.5 ? "X" : "O";
    const botStarts = player === "O";
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
    <main className="min-h-screen px-6 py-8 flex items-center justify-center">
      <div className="max-w-5xl w-full grid md:grid-cols-[380px,1fr] gap-8 items-center">
        <RobotAssistant
          talking={botTalking}
          text={botScript}
          onFinished={revealPendingBotMove}
        />

        <div className="flex flex-col items-center gap-4">
          <Board
            board={board}
            onClick={handleClick}
            disabled={busy || !!outcome || turn !== playerSymbol}
            highlight={hl}
          />
          <div className="text-center">
            <div className="font-semibold">Mode: {params.mode === "learning" ? "Learning bot" : "Classic bot"}</div>
            <div className="text-sm text-gray-400 mt-1">
              You are <b>{playerSymbol}</b>.{" "}
              {busy && botTalking ? "Bot is thinking…" : status}
            </div>
            {outcome && (
              <button
                onClick={reset}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white"
               data-i18n="auto.play-again">Play again</button>
            )}
          </div>
          <Link href="/game" className="text-sm text-gray-500 hover:underline">← Back</Link>
        </div>
      </div>
    </main>
  );
}
