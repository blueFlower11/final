'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Board, type Cell } from "@/components/Board";
import { getSocket } from "@/lib/socket";
import { QRBlock } from "@/components/QRBlock";
import Link from "next/link";

function genRoom() {
  return Math.random().toString(36).slice(2, 8);
}

function useQuery() {
  const qs = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  return (key: string) => qs?.get(key) ?? null;
}

export default function FriendGame() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X"|"O">("X");
  const [winner, setWinner] = useState<"X"|"O"|null>(null);
  const [draw, setDraw] = useState(false);
  const [connected, setConnected] = useState(false);

  const getQ = useQuery();
  const [room, setRoom] = useState<string>(() => getQ("room") || genRoom());
  const [role, setRole] = useState<"X"|"O"|"spectator">(() => (getQ("as") === "X" || getQ("as") === "O") ? (getQ("as") as "X"|"O") : "spectator");

  const socketRef = useRef<any>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.get("room")) {
      url.searchParams.set("room", room);
      window.history.replaceState({}, "", url.toString());
    }
  }, [room]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.emit("join", { room, role });
    socket.on("state", (payload: {board: Cell[]; turn: "X"|"O"; winner?: "X"|"O"|null; draw?: boolean;}) => {
      setBoard(payload.board);
      setTurn(payload.turn);
      setWinner(payload.winner ?? null);
      setDraw(!!payload.draw);
    });
    return () => {
      socket.off("state");
    };
  }, [room, role]);

  function doMove(i: number) {
    if (winner || draw) return;
    if (board[i]) return;
    if ((role === "X" && turn !== "X") || (role === "O" && turn !== "O")) return;
    socketRef.current?.emit("move", { room, index: i, symbol: role });
  }

  const joinUrlX = useMemo(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("room", room);
    u.searchParams.set("as", "X");
    return u.toString();
  }, [room]);

  const joinUrlO = useMemo(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("room", room);
    u.searchParams.set("as", "O");
    return u.toString();
  }, [room]);

  const isSpectator = role === "spectator";
  const header = isSpectator ? "Spectator board (play from phones)" : `You are ${role}`;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|android|mobile/.test(ua));
  }, []);

  const otherRole = role === "X" ? "O" : role === "O" ? "X" : "X";

  return (
    <main className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[380px,1fr] gap-8">
        <div className="flex flex-col items-center gap-4">
          <Board board={board} onClick={doMove} disabled={isSpectator || (role === "X" && turn !== "X") || (role === "O" && turn !== "O") || !!winner || draw} />
          <div className="text-center">
            <div className="font-semibold">{header}</div>
            <div className="text-sm text-gray-600 mt-1">Turn: <b>{turn}</b></div>
            {winner && <div className="mt-1">Winner: <b>{winner}</b></div>}
            {draw && !winner && <div className="mt-1">It\'s a draw.</div>}
          </div>
          <Link href="/game" className="text-sm text-gray-500 hover:underline">← Back</Link>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="font-semibold">Connect phones</div>
            <div className="text-sm text-gray-600">Scan to join this room: <b>{room}</b></div>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              {isMobile && !isSpectator ? (
                <QRBlock label={`Share with your friend (join as ${otherRole})`} url={otherRole === "X" ? joinUrlX : joinUrlO} />
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
          {!connected && <div className="text-sm text-red-600">Connecting to game server…</div>}
        </div>
      </div>
    </main>
  );
}
