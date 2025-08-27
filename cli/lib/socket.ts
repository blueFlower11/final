'use client';

import { io, Socket } from 'socket.io-client';
import { API_BASE } from './config';

let socket: Socket | undefined;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_BASE, {
      transports: ['polling', 'websocket'],
      path: '/socket.io',
      withCredentials: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      timeout: 12000,
    });

    socket.on('connect', () => console.log('[socket] connected', socket!.id));
    socket.on('connect_error', (e) => console.warn('[socket] connect_error', e.message || e));
    socket.on('error', (e) => console.warn('[socket] error', e));
    socket.on('disconnect', (r) => console.log('[socket] disconnected', r));
  }
  return socket;
}
