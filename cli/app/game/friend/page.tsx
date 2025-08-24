'use client';

import { useEffect, useRef, useState } from "react";
import { Board, type Cell } from "@/components/Board";
import { getSocket } from "@/lib/socket";
import { QRBlock } from "@/components/QRBlock";
import Link from "next/link";
import { useLang } from "@/lib/lang/LanguageContext";

function genRoom() {
  return Math.random().toString(36).slice(2, 8);
}

export default function FriendGame() {
  const { t } = useLang();

  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X"|"O">("X");
  const [winner, setWinner] = useState<"X"|"O"|null>(null);
  const [draw, setDraw] = useState(false);
  const [connected, setConnected] = useState(false);

  const [room, setRoom] = useState<string>("");
  const [role, setRole] = useState<"X"|"O"|"spectator">("spectator");
  const [currentUrl, setCurrentUrl] = useState<string>("");

  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentUrl(window.location.href);

    const qs = new URLSearchParams(window.location.search);
    const qRoom = qs.get("room");
    const qRole = qs.get("as");
    const initialRoom = qRoom || genRoom();
    setRoom(initialRoom);
    if (qRole === "X" || qRole === "O") setRole(qRole);
    if (!qRoom) {
      const url = new URL(window.location.href);
      url.searchParams.set("room", initialRoom);
      window.history.replaceState({}, "", url.toString());
      setCurrentUrl(url.toString());
    }
  }, []);

  useEffect(() => {
    if (!room) return;
    const socket = getSocket();
    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.emit("join", { room, role });
    const onState = (payload: {board: Cell[]; turn: "X"|"O"; winner?: "X"|"O"|null; draw?: boolean;}) => {
      setBoard(payload.board);
      setTurn(payload.turn);
      setWinner(payload.winner ?? null);
      setDraw(!!payload.draw);
    };
    socket.on("state", onState);
    return () => {
      socket.off("state", onState);
    };
  }, [room, role]);

  function doMove(i: number) {
    if (winner || draw) return;
    if (board[i]) return;
    if ((role === "X" && turn !== "X") || (role === "O" && turn !== "O")) return;
    socketRef.current?.emit("move", { room, index: i, symbol: role });
  }

  const joinUrlX = (() => {
    if (!currentUrl || !room) return "";
    const u = new URL(currentUrl);
    u.searchParams.set("room", room);
    u.searchParams.set("as", "X");
    return u.toString();
  })();

  const joinUrlO = (() => {
    if (!currentUrl || !room) return "";
    const u = new URL(currentUrl);
    u.searchParams.set("room", room);
    u.searchParams.set("as", "O");
    return u.toString();
  })();

  const isSpectator = role === "spectator";

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|android|mobile/.test(ua));
  }, []);

  const otherRole = role === "X" ? "O" : role === "O" ? "X" : "X";

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[380px,1fr] gap-8">
        <div className="flex flex-col items-center gap-4">
          <Board
            board={board}
            onClick={doMove}
            disabled={isSpectator || (role === "X" && turn !== "X") || (role === "O" && turn !== "O") || !!winner || draw}
          />
          <div className="text-center">
            <div className="font-semibold">{isSpectator ? t("game.spectator") : `${t("game.role")} ${role}`}</div>
            <div className="text-sm text-gray-600 mt-1">{t("game.turn")}<b>{turn}</b></div>
            {winner && <div className="mt-1">{t("game.winner")}<b>{winner}</b></div>}
            {draw && !winner && <div className="mt-1">{t("game.draw")}</div>}
          </div>
          <Link href="/game" className="text-sm text-gray-500 hover:underline">{`← ${t("game.back")}`}</Link>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="font-semibold">{t("game.connect")}</div>
            <div className="text-sm text-gray-600">{t("game.scan")}<b>{room || "…"}</b></div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {isMobile && !isSpectator ? (
                <QRBlock
                  label={`${t("game.share")} ${otherRole})`}
                  url={otherRole === "X" ? joinUrlX : joinUrlO}
                />
              ) : (
                <>
                  <QRBlock label={t("game.joinX")} url={joinUrlX} />
                  <QRBlock label={t("game.joinO")} url={joinUrlO} />
                </>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-3">
              {isMobile ? t("game.phones") : t("game.screen")}
            </div>
          </div>
          {!connected && <div className="text-sm text-red-600">{t("game.server")}</div>}
        </div>
      </div>
    </main>
  );
}
