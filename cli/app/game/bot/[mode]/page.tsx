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
  const [heatmap, setHeatmap] = useState<(string|null)[] | null>(null);

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

  function probsToHeatmap(probabilities: number[], b: Cell[]) {
    if (params.mode === "static") {
      return b.map(c => (c ? null : "white"));
    }

    const empties = probabilities
      .map((p, i) => (b[i] ? null : p))
      .filter((v): v is number => v != null);

    if (empties.length === 0) return Array(9).fill(null);

    const pMin = Math.min(...empties);
    const pMax = Math.max(...empties);
    const span = Math.max(1e-9, pMax - pMin);

    const lerpColor = (c1: [number, number, number], c2: [number, number, number], t: number) => {
      const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
      const rgb = [mix(c1[0], c2[0]), mix(c1[1], c2[1]), mix(c1[2], c2[2])];
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    };

    const RED: [number, number, number]   = [251, 234, 234]; // #fbeaea
    const WHITE: [number, number, number] = [255, 255, 255]; // white
    const GREEN: [number, number, number] = [223, 245, 225]; // #dff5e1

    return probabilities.map((p, i) => {
      if (b[i]) return null;
      const t = (p - pMin) / span; 
      if (t <= 0.5) {
        const tt = t / 0.5;
        return lerpColor(RED, WHITE, tt);
      } else {
        const tt = (t - 0.5) / 0.5;
        return lerpColor(WHITE, GREEN, tt);
      }
    });
  }

  function getSituation(b: Cell[], idx: number | null, who: "X" | "O"): "start" | "block" | "win" | "random" {
    if (idx == null || idx < 0) return "random";
    if (countOpen(b) === 9) return "start";
    if (isWinningMove(b, idx, who)) return "win";
    if (isBlockingMove(b, idx, who)) return "block";
    return "random";
  }

  function previewOptionsThenPick(probabilities: number[] | undefined, idx: number, currentBoard: Cell[], who: "X" | "O") {
    if (!Number.isInteger(idx)) return;

    if (params.mode === "static") {
      const situation = getSituation(currentBoard, idx, who);
      const speech = buildBotSpeech(currentBoard, idx, who, situation);
      setBotScript(speech);
      setBotTalking(true);
      setTimeout(() => {
        revealPendingBotMove();
      }, 1500);
      return;
    }

    const heat = probabilities ? probsToHeatmap(probabilities, currentBoard) : null;

    setHeatmap(heat);
    setBotScript(t("game.options"));
    setBotTalking(true);

    setTimeout(() => {
      setBotScript(t("game.rand"));
      setBotTalking(true);
      setHeatmap(null);
      revealPendingBotMove();
    }, 3000);
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
    setHeatmap(null);

    if (botStarts) {
      (async () => {
        setBusy(true);
        const res = await requestBotMove({ board: Array(9).fill(null), player: "X", mode: params.mode });
        captureFromResponse(res);

        const idx = (res && typeof (res as any).moveIndex === "number")
          ? (res as any).moveIndex
          : Math.floor(Math.random() * 9);
        
          const probabilities: number[] | undefined =
          (Array.isArray((res as any)?.moveNumbers) && (res as any).moveNumbers.length === 9)
            ? (res as any).moveNumbers
            : (Array.isArray((res as any)?.moveNumbers) && (res as any).moveNumbers.length === 9)
              ? (res as any).moveNumbers
              : undefined;

        setPendingBotIdx(idx);

        previewOptionsThenPick(probabilities, idx, Array(9).fill(null), "X");
      })().catch(() => {
        const idx = Math.floor(Math.random() * 9);
        setPendingBotIdx(idx);
        setBotScript(t("bot.botStartD"));
        setBotTalking(true);
        setBusy(true);
      });
    }
  // eslint-disable-next-line react-hooks/exhausti, mode: "smart" | "stupid"ve-deps
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

    const probabilities: number[] | undefined =
      (Array.isArray((res as any)?.moveNumbers) && (res as any).moveNumbers.length === 9)
        ? (res as any).moveNumbers
        : (Array.isArray((res as any)?.moveNumbers) && (res as any).moveNumbers.length === 9)
          ? (res as any).moveNumbers
          : undefined;

    if (idx >= 0) {
      setPendingBotIdx(idx);
      previewOptionsThenPick(probabilities, idx, next, botSymbol);
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
    setHeatmap(null);
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

          const probabilities: number[] | undefined =
            (Array.isArray((res as any)?.moveNumbers) && (res as any).moveNumbers.length === 9)
              ? (res as any).moveNumbers
              : (Array.isArray((res as any)?.moveNumbers) && (res as any).moveNumbers.length === 9)
                ? (res as any).moveNumbers
                : undefined;

          setPendingBotIdx(idx);
          previewOptionsThenPick(probabilities, idx, Array(9).fill(null), "X");
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
            heatmap={heatmap || undefined}
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
