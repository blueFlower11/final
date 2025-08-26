'use client';

import { useEffect, useMemo, useState } from "react";
import { Board, type Cell } from "@/components/Board";
import { RobotAssistant } from "@/components/RobotAssistant";
import { requestBotMove, requestSave } from "@/lib/api";
import Link from "next/link";
import { useLang } from "@/lib/lang/LanguageContext";

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
  const { t } = useLang();

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
  
  function countOpen(b: Cell[]) {
    return b.reduce((n, c) => n + (c ? 0 : 1), 0);
  }
  
  function spotsText(n: number) {
    return `${n} ${t("bot.open")}${n === 1 ? t("bot.open1") : t("bot.openMore")}`;
  }
  
  function buildBotSpeech(
    b: Cell[],
    idx: number | null,
    who: "X" | "O",
    situation: "start" | "block" | "win" | "random"
  ) {
    const open = countOpen(b);
    const tail =
      situation === "start"
        ? ` ${spotsText(open)} — ${who} ${t("bot.chose")} ${open} ${t("bot.move")}${open === 1 ? t("bot.move1") : t("bot.moveMore")}.`
        : situation === "block"
        ? ` ${spotsText(open)} — ${t("bot.block")}`
        : situation === "win"
        ? ` ${spotsText(open)} ${t("bot.win")}`
        : ` ${spotsText(open)} — ${open} ${t("bot.random")}`;
    return `${tail}`;
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

  useEffect(() => {
    const player = Math.random() < 0.5 ? "X" : "O";
    const botStarts = player === "O";
    setPlayerSymbol(player);
    setBoard(Array(9).fill(null));
    setHL(null);
    setStatus(botStarts ? t("bot.botStart") : t("bot.youStart"));
    setTurn("X");
    setLogs([]);
    setSaved(false);
    if (botStarts) {
      (async () => {
        setBusy(true);
        const res = await requestBotMove({ board: Array(9).fill(null), player: "X", mode: params.mode });
        console.log(res);
        captureFromResponse(res);
        const idx = (res && typeof (res as any).moveIndex === "number")
          ? (res as any).moveIndex
          : Math.floor(Math.random() * 9);

        setPendingBotIdx(idx);
        const situation: "start" | "block" | "win" | "random" =
          isWinningMove(Array(9).fill(null), idx, "X") ? "win" : "start";
        setBotScript(buildBotSpeech(Array(9).fill(null), idx, "X", situation));
        setBotTalking(true);
      })().catch(() => {
        const idx = Math.floor(Math.random() * 9);
        setPendingBotIdx(idx);
        setBotScript(t("bot.botStartD"));
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
      if (outcome.winner) setStatus(outcome.winner === playerSymbol ? `${t("bot.winY")} 🎉` : `${t("bot.winB")} 🤖`);
      else setStatus(t("game.draw"));
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
    const idx = (res && typeof (res as any).moveIndex === "number") ? (res as any).moveIndex : next.findIndex(c => c === null);
    console.log(res);
    if (idx >= 0) {
      setPendingBotIdx(idx);
      const situation: "start" | "block" | "win" | "random" =
        isWinningMove(next, idx, botSymbol) ? "win"
        : isBlockingMove(next, idx, botSymbol) ? "block"
        : "random";

      setBotScript(buildBotSpeech(next, idx, botSymbol, situation));
      setBotTalking(true);
    } else {
      setBusy(false);
      setTurn(playerSymbol);
    }
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setHL(null);
    setStatus(t("bot.new"));
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
          const idx = (res && typeof (res as any).moveIndex === "number") ? (res as any).moveIndex : Math.floor(Math.random()*9);
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
            <div className="font-semibold">{t("bot.mode")}{params.mode === "learning" ? t("bot.learning") : t("bot.classic")}</div>
            <div className="text-sm text-gray-400 mt-1">
              {t("game.role")} <b>{playerSymbol}</b>.{" "}
              {busy && botTalking ? t("bot.thinking") : status}
            </div>
            {outcome && (
              <button
                onClick={reset}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white">{t("game.again")}</button>
            )}
          </div>
          <Link href="/game" className="text-sm text-gray-500 hover:underline">{`← ${t("game.back")}`}</Link>
        </div>
      </div>
    </main>
  );
}
