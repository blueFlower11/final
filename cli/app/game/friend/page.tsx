'use client';

import { useEffect, useRef, useState } from "react";
import { Board, type Cell } from "@/components/Board";
import { getSocket } from "@/lib/socket";
import { QRBlock } from "@/components/QRBlock";
import Link from "next/link";

function genRoom() {
  return Math.random().toString(36).slice(2, 8);
}

export default function FriendGame() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X"|"O">("X");
  const [winner, setWinner] = useState<"X"|"O"|null>(null);
  const [draw, setDraw] = useState(false);
  const [connected, setConnected] = useState(false);

  // URL/role are derived client-side only (avoid window during SSR)
  const [room, setRoom] = useState<string>("");
  const [role, setRole] = useState<"X"|"O"|"spectator">("spectator");
  const [currentUrl, setCurrentUrl] = useState<string>("");

  const socketRef = useRef<any>(null);

  // Client-only initialization
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentUrl(window.location.href);

    const qs = new URLSearchParams(window.location.search);
    const qRoom = qs.get("room");
    const qRole = qs.get("as");
    const initialRoom = qRoom || genRoom();
    setRoom(initialRoom);
    if (qRole === "X" || qRole === "O") setRole(qRole);
    // Ensure URL has room persisted
    if (!qRoom) {
      const url = new URL(window.location.href);
      url.searchParams.set("room", initialRoom);
      window.history.replaceState({}, "", url.toString());
      setCurrentUrl(url.toString());
    }
  }, []);

  // Socket wiring
  useEffect(() => {
    if (!room) return; // wait until client has set a room
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

  // Build join links on client only
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
            <div className="font-semibold">{isSpectator ? "Spectator board (play from phones)" : `You are ${role}`}</div>
            <div className="text-sm text-gray-600 mt-1">Turn: <b>{turn}</b></div>
            {winner && <div className="mt-1">Winner: <b>{winner}</b></div>}
            {draw && !winner && <div className="mt-1" data-i18n="auto.it-s-a-draw">It's a draw.</div>}
          </div>
          <Link href="/game" className="text-sm text-gray-500 hover:underline">← Back</Link>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="font-semibold" data-i18n="auto.connect-phones">Connect phones</div>
            <div className="text-sm text-gray-600">Scan to join this room: <b>{room || "…"}</b></div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {isMobile && !isSpectator ? (
                <QRBlock
                  label={`Share with your friend (join as ${otherRole})`}
                  url={otherRole === "X" ? joinUrlX : joinUrlO}
                />
              ) : (
                <>
                  <QRBlock label="Join as X" url={joinUrlX} />
                  <QRBlock label="Join as O" url={joinUrlO} />
                </>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-3">
              {isMobile ? "Both players can play from their phones." : "On a big screen, keep this page open as the board. Players make moves from their phones."}
            </div>
          </div>
          {!connected && <div className="text-sm text-red-600" data-i18n="auto.connecting-to-game-server">Connecting to game server…</div>}
        </div>
      </div>
    </main>
  );
}
