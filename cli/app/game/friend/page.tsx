// 'use client';

// import { useEffect, useRef, useState } from "react";
// import { Board, type Cell } from "@/components/Board";
// import { getSocket } from "@/lib/socket";
// import { QRBlock } from "@/components/QRBlock";
// import Link from "next/link";
// import { useLang } from "@/lib/lang/LanguageContext";

// function genRoom() {
//   return Math.random().toString(36).slice(2, 8);
// }

// export default function FriendGame() {
//   const { t } = useLang();

//   const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
//   const [turn, setTurn] = useState<"X"|"O">("X");
//   const [winner, setWinner] = useState<"X"|"O"|null>(null);
//   const [draw, setDraw] = useState(false);
//   const [connected, setConnected] = useState(false);

//   const [room, setRoom] = useState<string>("");
//   const [role, setRole] = useState<"X"|"O"|"spectator">("spectator");
//   const [currentUrl, setCurrentUrl] = useState<string>("");

//   const socketRef = useRef<any>(null);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     setCurrentUrl(window.location.href);

//     const qs = new URLSearchParams(window.location.search);
//     const qRoom = qs.get("room");
//     const qRole = qs.get("as");
//     const initialRoom = qRoom || genRoom();
//     setRoom(initialRoom);
//     if (qRole === "X" || qRole === "O") setRole(qRole);
//     if (!qRoom) {
//       const url = new URL(window.location.href);
//       url.searchParams.set("room", initialRoom);
//       window.history.replaceState({}, "", url.toString());
//       setCurrentUrl(url.toString());
//     }
//   }, []);

//   useEffect(() => {
//     if (!room) return;
//     const socket = getSocket();
//     socketRef.current = socket;
//     socket.on("connect", () => setConnected(true));
//     socket.emit("join", { room, role });
//     const onState = (payload: {board: Cell[]; turn: "X"|"O"; winner?: "X"|"O"|null; draw?: boolean;}) => {
//       setBoard(payload.board);
//       setTurn(payload.turn);
//       setWinner(payload.winner ?? null);
//       setDraw(!!payload.draw);
//     };
//     socket.on("state", onState);
//     return () => {
//       socket.off("state", onState);
//     };
//   }, [room, role]);

//   function doMove(i: number) {
//     if (winner || draw) return;
//     if (board[i]) return;
//     if ((role === "X" && turn !== "X") || (role === "O" && turn !== "O")) return;
//     socketRef.current?.emit("move", { room, index: i, symbol: role });
//   }

//   const joinUrlX = (() => {
//     if (!currentUrl || !room) return "";
//     const u = new URL(currentUrl);
//     u.searchParams.set("room", room);
//     u.searchParams.set("as", "X");
//     return u.toString();
//   })();

//   const joinUrlO = (() => {
//     if (!currentUrl || !room) return "";
//     const u = new URL(currentUrl);
//     u.searchParams.set("room", room);
//     u.searchParams.set("as", "O");
//     return u.toString();
//   })();

//   const isSpectator = role === "spectator";

//   const [isMobile, setIsMobile] = useState(false);
//   useEffect(() => {
//     if (typeof navigator === "undefined") return;
//     const ua = navigator.userAgent.toLowerCase();
//     setIsMobile(/iphone|ipad|android|mobile/.test(ua));
//   }, []);

//   const otherRole = role === "X" ? "O" : role === "O" ? "X" : "X";

//   return (
//     <main className="min-h-screen px-6 py-8">
//       <div className="max-w-6xl mx-auto grid lg:grid-cols-[380px,1fr] gap-8">
//         <div className="flex flex-col items-center gap-4">
//           <Board
//             board={board}
//             onClick={doMove}
//             disabled={isSpectator || (role === "X" && turn !== "X") || (role === "O" && turn !== "O") || !!winner || draw}
//           />
//           <div className="text-center">
//             <div className="font-semibold">{isSpectator ? t("game.spectator") : `${t("game.role")} ${role}`}</div>
//             <div className="text-sm text-gray-600 mt-1">{t("game.turn")}<b>{turn}</b></div>
//             {winner && <div className="mt-1">{t("game.winner")}<b>{winner}</b></div>}
//             {draw && !winner && <div className="mt-1">{t("game.draw")}</div>}
//           </div>
//           <Link href="/game" className="text-sm text-gray-500 hover:underline">{`← ${t("game.back")}`}</Link>
//         </div>

//         <div className="space-y-4">
//           <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
//             <div className="font-semibold">{t("game.connect")}</div>
//             <div className="text-sm text-gray-600">{t("game.scan")}<b>{room || "…"}</b></div>
//             <div className="mt-4 grid sm:grid-cols-2 gap-4">
//               {isMobile && !isSpectator ? (
//                 <QRBlock
//                   label={`${t("game.share")} ${otherRole})`}
//                   url={otherRole === "X" ? joinUrlX : joinUrlO}
//                 />
//               ) : (
//                 <>
//                   <QRBlock label={t("game.joinX")} url={joinUrlX} />
//                   <QRBlock label={t("game.joinO")} url={joinUrlO} />
//                 </>
//               )}
//             </div>
//             <div className="text-xs text-gray-500 mt-3">
//               {isMobile ? t("game.phones") : t("game.screen")}
//             </div>
//           </div>
//           {!connected && <div className="text-sm text-red-600">{t("game.server")}</div>}
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

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
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [draw, setDraw] = useState(false);
  const [connected, setConnected] = useState(false);

  const [room, setRoom] = useState<string>("");
  const [role, setRole] = useState<"X" | "O" | "spectator">("spectator");
  const [currentUrl, setCurrentUrl] = useState<string>("");

  const [isMobile, setIsMobile] = useState(false);
  const socketRef = useRef<any>(null);

  // Detect device once on mount
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent.toLowerCase();
    setIsMobile(/iphone|ipad|android|mobile/.test(ua));
  }, []);

  // Bootstrapping: room + role + URL sync
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const qs = new URLSearchParams(url.search);

    const qRoom = qs.get("room");
    const qRole = qs.get("as");

    // Room setup
    const initialRoom = qRoom || genRoom();
    setRoom(initialRoom);

    // Role setup:
    // - On desktop/laptop: always spectator (master screen).
    // - On phone: if no role param, auto-assign X and write it to URL, so the other phone can scan O.
    let initialRole: "X" | "O" | "spectator" = "spectator";
    if (!isMobile) {
      initialRole = "spectator";
    } else if (qRole === "X" || qRole === "O") {
      initialRole = qRole;
    } else {
      initialRole = "X"; // first phone becomes X by default
      qs.set("as", "X");
    }
    setRole(initialRole);

    // Ensure URL has room and (on mobile) maybe role
    if (!qRoom) qs.set("room", initialRoom);
    if (isMobile && !qRole) qs.set("as", "X");

    url.search = qs.toString();
    window.history.replaceState({}, "", url.toString());
    setCurrentUrl(url.toString());
  }, [isMobile]);

  // Socket lifecycle
  useEffect(() => {
    if (!room) return;
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onState = (payload: {
      board: Cell[];
      turn: "X" | "O";
      winner?: "X" | "O" | null;
      draw?: boolean;
    }) => {
      setBoard(payload.board);
      setTurn(payload.turn);
      setWinner(payload.winner ?? null);
      setDraw(!!payload.draw);
    };

    socket.on("connect", onConnect);
    socket.on("state", onState);

    // Join (or re-join) whenever room/role changes
    socket.emit("join", { room, role });

    return () => {
      socket.off("connect", onConnect);
      socket.off("state", onState);
    };
  }, [room, role]);

  function doMove(i: number) {
    if (winner || draw) return;
    if (board[i]) return;
    if ((role === "X" && turn !== "X") || (role === "O" && turn !== "O")) return;
    socketRef.current?.emit("move", { room, index: i, symbol: role });
  }

  // Helper URLs for QR codes
  const joinUrlFor = (as: "X" | "O") => {
    if (!currentUrl || !room) return "";
    const u = new URL(currentUrl);
    u.searchParams.set("room", room);
    u.searchParams.set("as", as);
    return u.toString();
  };
  const joinUrlX = joinUrlFor("X");
  const joinUrlO = joinUrlFor("O");

  const isSpectator = role === "spectator";
  const otherRole = role === "X" ? "O" : role === "O" ? "X" : "X";

  // ===== Layout variants =====
  // Desktop/laptop (master screen): centered board + two QR codes below.
  if (!isMobile) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-5xl flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <Board
              board={board}
              onClick={() => {}}
              disabled
            />
            <div className="text-center">
              <div className="font-semibold">{t("game.spectator")}</div>
              <div className="text-sm text-gray-600 mt-1">
                {t("game.turn")}<b>{turn}</b>
              </div>
              {winner && (
                <div className="mt-1">
                  {t("game.winner")}<b>{winner}</b>
                </div>
              )}
              {draw && !winner && <div className="mt-1">{t("game.draw")}</div>}
            </div>
          </div>

          <div className="w-full grid sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="font-semibold">{t("game.joinX")}</div>
              <div className="text-sm text-gray-600">{t("game.scan")}<b>{room || "…"}</b></div>
              <div className="mt-4">
                <QRBlock label={t("game.joinX")} url={joinUrlX} />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="font-semibold">{t("game.joinO")}</div>
              <div className="text-sm text-gray-600">{t("game.scan")}<b>{room || "…"}</b></div>
              <div className="mt-4">
                <QRBlock label={t("game.joinO")} url={joinUrlO} />
              </div>
            </div>
          </div>

          {!connected && (
            <div className="text-sm text-red-600">{t("game.server")}</div>
          )}

          <Link href="/game" className="text-sm text-gray-500 hover:underline">
            {`← ${t("game.back")}`}
          </Link>
        </div>
      </main>
    );
  }

  // Phone: player's own board (clickable when it's their turn) + a single QR for the other player.
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="max-w-md mx-auto flex flex-col items-center gap-4">
        <Board
          board={board}
          onClick={doMove}
          disabled={
            isSpectator ||
            (role === "X" && turn !== "X") ||
            (role === "O" && turn !== "O") ||
            !!winner ||
            draw
          }
        />

        <div className="text-center">
          <div className="font-semibold">
            {isSpectator ? t("game.spectator") : `${t("game.role")} ${role}`}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {t("game.turn")}<b>{turn}</b>
          </div>
          {winner && (
            <div className="mt-1">
              {t("game.winner")}<b>{winner}</b>
            </div>
          )}
          {draw && !winner && <div className="mt-1">{t("game.draw")}</div>}
        </div>

        {/* Single QR that invites the *other* role */}
        {!isSpectator && (
          <div className="w-full p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="font-semibold">{t("game.connect")}</div>
            <div className="text-sm text-gray-600">
              {t("game.scan")}<b>{room || "…"}</b>
            </div>
            <div className="mt-4">
              <QRBlock
                label={`${t("game.share") } ${otherRole}`}
                url={otherRole === "X" ? joinUrlX : joinUrlO}
              />
            </div>
            <div className="text-xs text-gray-500 mt-3">{t("game.phones")}</div>
          </div>
        )}

        {!connected && (
          <div className="text-sm text-red-600">{t("game.server")}</div>
        )}

        <Link href="/game" className="text-sm text-gray-500 hover:underline">
          {`← ${t("game.back")}`}
        </Link>
      </div>
    </main>
  );
}
