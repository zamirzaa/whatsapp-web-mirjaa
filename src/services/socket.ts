import { io as socketIO, Socket } from 'socket.io-client';
import { getAuthToken } from './api';

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (!socket && getAuthToken()) {
    initSocket();
  }
  return socket;
}

export function initSocket(): Socket {
  if (socket) {
    socket.disconnect();
  }

  const token = getAuthToken();
  const socketUrl =
    window.location.port === '5173'
      ? `http://${window.location.hostname}:3001`
      : window.location.origin;

  socket = socketIO(socketUrl, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('⚡ Socket connected to WhatsApp Web realtime backend:', socket?.id);
  });

  socket.on('disconnect', reason => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', err => {
    console.warn('Socket connection error:', err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
