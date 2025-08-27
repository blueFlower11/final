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

// "use client";

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
//   const [turn, setTurn] = useState<"X" | "O">("X");
//   const [winner, setWinner] = useState<"X" | "O" | null>(null);
//   const [draw, setDraw] = useState(false);
//   const [connected, setConnected] = useState(false);

//   const [room, setRoom] = useState<string>("");
//   const [role, setRole] = useState<"X" | "O" | "spectator">("spectator");
//   const [currentUrl, setCurrentUrl] = useState<string>("");

//   const [isMobile, setIsMobile] = useState(false);
//   const socketRef = useRef<any>(null);

//   useEffect(() => {
//     if (typeof navigator === "undefined") return;
//     const ua = navigator.userAgent.toLowerCase();
//     setIsMobile(/iphone|ipad|android|mobile/.test(ua));
//   }, []);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const url = new URL(window.location.href);
//     const qs = new URLSearchParams(url.search);

//     const qRoom = qs.get("room");
//     const qRole = qs.get("as");

//     const initialRoom = qRoom || genRoom();
//     setRoom(initialRoom);

//     let initialRole: "X" | "O" | "spectator" = "spectator";
//     if (!isMobile) {
//       initialRole = "spectator";
//     } else if (qRole === "X" || qRole === "O") {
//       initialRole = qRole;
//     } else {
//       initialRole = "X"; 
//       qs.set("as", "X");
//     }
//     setRole(initialRole);

//     if (!qRoom) qs.set("room", initialRoom);
//     if (isMobile && !qRole) qs.set("as", "X");

//     url.search = qs.toString();
//     window.history.replaceState({}, "", url.toString());
//     setCurrentUrl(url.toString());
//   }, [isMobile]);

//   useEffect(() => {
//     if (!room) return;
//     const socket = getSocket();
//     socketRef.current = socket;

//     const onConnect = () => setConnected(true);
//     const onState = (payload: {
//       board: Cell[];
//       turn: "X" | "O";
//       winner?: "X" | "O" | null;
//       draw?: boolean;
//     }) => {
//       setBoard(payload.board);
//       setTurn(payload.turn);
//       setWinner(payload.winner ?? null);
//       setDraw(!!payload.draw);
//     };

//     socket.on("connect", onConnect);
//     socket.on("state", onState);

//     socket.emit("join", { room, role });

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("state", onState);
//     };
//   }, [room, role]);

//   function doMove(i: number) {
//     if (winner || draw) return;
//     if (board[i]) return;
//     if ((role === "X" && turn !== "X") || (role === "O" && turn !== "O")) return;
//     socketRef.current?.emit("move", { room, index: i, symbol: role });
//   }

//   const joinUrlFor = (as: "X" | "O") => {
//     if (!currentUrl || !room) return "";
//     const u = new URL(currentUrl);
//     u.searchParams.set("room", room);
//     u.searchParams.set("as", as);
//     return u.toString();
//   };
//   const joinUrlX = joinUrlFor("X");
//   const joinUrlO = joinUrlFor("O");

//   const isSpectator = role === "spectator";
//   const otherRole = role === "X" ? "O" : role === "O" ? "X" : "X";

//   if (!isMobile) {
//     return (
//       <main className="min-h-screen flex items-center justify-center px-6 py-10">
//         <div className="w-full max-w-5xl flex flex-col items-center gap-6">
//           <div className="flex flex-col items-center gap-3">
//             <Board
//               board={board}
//               onClick={() => {}}
//               disabled
//             />
//             <div className="text-center">
//               <div className="font-semibold">{t("game.spectator")}</div>
//               <div className="text-sm text-gray-600 mt-1">
//                 {t("game.turn")}<b>{turn}</b>
//               </div>
//               {winner && (
//                 <div className="mt-1">
//                   {t("game.winner")}<b>{winner}</b>
//                 </div>
//               )}
//               {draw && !winner && <div className="mt-1">{t("game.draw")}</div>}
//             </div>
//           </div>

//           <div className="w-full grid sm:grid-cols-2 gap-6">
//             <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
//               <div className="font-semibold">{t("game.joinX")}</div>
//               <div className="text-sm text-gray-600">{t("game.scan")}<b>{room || "…"}</b></div>
//               <div className="mt-4">
//                 <QRBlock label={t("game.joinX")} url={joinUrlX} />
//               </div>
//             </div>
//             <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
//               <div className="font-semibold">{t("game.joinO")}</div>
//               <div className="text-sm text-gray-600">{t("game.scan")}<b>{room || "…"}</b></div>
//               <div className="mt-4">
//                 <QRBlock label={t("game.joinO")} url={joinUrlO} />
//               </div>
//             </div>
//           </div>

//           {!connected && (
//             <div className="text-sm text-red-600">{t("game.server")}</div>
//           )}

//           <Link href="/game" className="text-sm text-gray-500 hover:underline">
//             {`← ${t("game.back")}`}
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen px-6 py-8">
//       <div className="max-w-md mx-auto flex flex-col items-center gap-4">
//         <Board
//           board={board}
//           onClick={doMove}
//           disabled={
//             isSpectator ||
//             (role === "X" && turn !== "X") ||
//             (role === "O" && turn !== "O") ||
//             !!winner ||
//             draw
//           }
//         />

//         <div className="text-center">
//           <div className="font-semibold">
//             {isSpectator ? t("game.spectator") : `${t("game.role")} ${role}`}
//           </div>
//           <div className="text-sm text-gray-600 mt-1">
//             {t("game.turn")}<b>{turn}</b>
//           </div>
//           {winner && (
//             <div className="mt-1">
//               {t("game.winner")}<b>{winner}</b>
//             </div>
//           )}
//           {draw && !winner && <div className="mt-1">{t("game.draw")}</div>}
//         </div>

//         {!isSpectator && (
//           <div className="w-full p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
//             <div className="font-semibold">{t("game.connect")}</div>
//             <div className="text-sm text-gray-600">
//               {t("game.scan")}<b>{room || "…"}</b>
//             </div>
//             <div className="mt-4">
//               <QRBlock
//                 label={`${t("game.share") } ${otherRole}`}
//                 url={otherRole === "X" ? joinUrlX : joinUrlO}
//               />
//             </div>
//             <div className="text-xs text-gray-500 mt-3">{t("game.phones")}</div>
//           </div>
//         )}

//         {!connected && (
//           <div className="text-sm text-red-600">{t("game.server")}</div>
//         )}

//         <Link href="/game" className="text-sm text-gray-500 hover:underline">
//           {`← ${t("game.back")}`}
//         </Link>
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

  const socketRef = useRef<any>(null);

  // Initialize room/role purely from URL (no UA sniffing)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const qs = new URLSearchParams(url.search);

    const qRoom = qs.get("room");
    const qRole = qs.get("as");

    const initialRoom = qRoom || genRoom();
    setRoom(initialRoom);

    let initialRole: "X" | "O" | "spectator" = "spectator";
    if (qRole === "X" || qRole === "O") {
      initialRole = qRole;
    } else {
      // Keep spectator by default if no ?as provided
      qs.set("as", "spectator");
    }
    setRole(initialRole);

    if (!qRoom) qs.set("room", initialRoom);

    url.search = qs.toString();
    window.history.replaceState({}, "", url.toString());
    setCurrentUrl(url.toString());
  }, []);

  // Socket wiring — join after room & role are finalized
  useEffect(() => {
    if (!room || !role) return;
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
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
    socket.on("disconnect", onDisconnect);
    socket.on("state", onState);

    socket.emit("join", { room, role });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("state", onState);
    };
  }, [room, role]);

  function doMove(i: number) {
    if (winner || draw) return;
    if (board[i]) return;
    if ((role === "X" && turn !== "X") || (role === "O" && turn !== "O")) return;
    socketRef.current?.emit("move", { room, index: i, symbol: role });
  }

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

          {/* Helpful turn hint when board is disabled due to turn */}
          {!isSpectator &&
            !winner &&
            !draw &&
            role !== turn && (
              <div className="text-xs text-gray-500 mt-1">
                {t("game.waitTurn") ?? `It’s ${turn}’s turn.`}
              </div>
            )}

          {winner && (
            <div className="mt-1">
              {t("game.winner")}<b>{winner}</b>
            </div>
          )}
          {draw && !winner && <div className="mt-1">{t("game.draw")}</div>}
        </div>

        {/* Share QR for the *other* role when you’re a player */}
        {!isSpectator && (
          <div className="w-full p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="font-semibold">{t("game.connect")}</div>
            <div className="text-sm text-gray-600">
              {t("game.scan")}<b>{room || "…"}</b>
            </div>
            <div className="mt-4">
              <QRBlock
                label={`${t("game.share")} ${otherRole}`}
                url={otherRole === "X" ? joinUrlX : joinUrlO}
              />
            </div>
            <div className="text-xs text-gray-500 mt-3">{t("game.phones")}</div>
          </div>
        )}

        {/* If you’re a spectator (default when no ?as), show join QR for both roles */}
        {isSpectator && (
          <div className="w-full grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="font-semibold">{t("game.joinX")}</div>
              <div className="text-sm text-gray-600">
                {t("game.scan")}<b>{room || "…"}</b>
              </div>
              <div className="mt-3">
                <QRBlock label={t("game.joinX")} url={joinUrlX} />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="font-semibold">{t("game.joinO")}</div>
              <div className="text-sm text-gray-600">
                {t("game.scan")}<b>{room || "…"}</b>
              </div>
              <div className="mt-3">
                <QRBlock label={t("game.joinO")} url={joinUrlO} />
              </div>
            </div>
          </div>
        )}

        {/* Clearer connection banner (useful for in-app browsers that break WS) */}
        {!connected && (
          <div className="w-full text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
            {t("game.server")}
            <div className="text-xs text-red-600 mt-1">
              {t("game.openExternal") ??
                "If you opened this from a QR, try opening in your default browser (Safari/Chrome)."}
            </div>
          </div>
        )}

        <Link href="/game" className="text-sm text-gray-500 hover:underline mt-2">
          {`← ${t("game.back")}`}
        </Link>
      </div>
    </main>
  );
}
