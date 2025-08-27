// 'use client';
// import { io, Socket } from "socket.io-client";
// import { API_BASE } from "./config";

// let socket: Socket | null = null;

// export function getSocket(): Socket {
//   if (!socket) {
//     socket = io(API_BASE, { transports: ["websocket"] });
//   }
//   return socket;
// }

'use client';

import { io, Socket } from 'socket.io-client';
import { API_BASE } from './config';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE, {
      // allow fallback so mobile in-app browsers can connect
      transports: ['polling', 'websocket'],
      path: '/socket.io',
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      timeout: 12000,
    });

    // Optional debug logging
    socket.on('connect', () => console.log('[socket] connected', socket.id));
    socket.on('connect_error', (e) => console.warn('[socket] connect_error', e.message || e));
    socket.on('error', (e) => console.warn('[socket] error', e));
    socket.on('disconnect', (r) => console.log('[socket] disconnected', r));
  }
  return socket;
}
