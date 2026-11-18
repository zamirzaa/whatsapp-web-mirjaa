import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { verifyToken, type AuthenticatedUser } from './auth';
import { db } from './db';

export let io: SocketIOServer;

const onlineUsers = new Map<string, Set<string>>(); // userId -> Set<socketId>

export function initSocketServer(server: HTTPServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    const user = verifyToken(token);
    if (!user) {
      return next(new Error('Authentication error: Invalid token'));
    }

    (socket as any).user = user;
    next();
  });

  io.on('connection', socket => {
    const user: AuthenticatedUser = (socket as any).user;
    const userId = user.id;

    // Track online state
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
      db.prepare('UPDATE users SET is_online = 1 WHERE id = ?').run(userId);
      io.emit('user:online', { userId, isOnline: true });
    }
    onlineUsers.get(userId)?.add(socket.id);

    // Join user's individual room for direct notifications
    socket.join(`user_${userId}`);

    // Join all conversations user belongs to
    const userConversations = db.prepare(`
      SELECT conversation_id FROM conversation_members WHERE user_id = ?
    `).all(userId) as any[];

    for (const conv of userConversations) {
      socket.join(conv.conversation_id);
    }

    // Typing status event
    socket.on('conversation:typing', (data: { chatId: string; isTyping: boolean }) => {
      socket.to(data.chatId).emit('conversation:typing', {
        chatId: data.chatId,
        userId,
        userName: user.displayName,
        isTyping: data.isTyping,
      });
    });

    // Message delivery & read receipts
    socket.on('message:read', (data: { chatId: string; messageId?: string }) => {
      db.prepare(`
        UPDATE messages
        SET status = 'read'
        WHERE conversation_id = ? AND sender_id != ? AND status != 'read'
      `).run(data.chatId, userId);

      socket.to(data.chatId).emit('message:read', {
        chatId: data.chatId,
        readByUserId: userId,
      });
    });

    // WebRTC Signaling
    socket.on('call:initiate', (data: {
      recipientId: string;
      chatId?: string;
      type: 'audio' | 'video';
    }) => {
      const callData = {
        caller: {
          id: user.id,
          name: user.displayName,
          username: user.username,
        },
        type: data.type,
        chatId: data.chatId,
      };

      io.to(`user_${data.recipientId}`).emit('call:incoming', callData);
    });

    socket.on('call:accept', (data: { callerId: string }) => {
      io.to(`user_${data.callerId}`).emit('call:accepted', {
        acceptedBy: user.id,
      });
    });

    socket.on('call:reject', (data: { callerId: string }) => {
      io.to(`user_${data.callerId}`).emit('call:rejected', {
        rejectedBy: user.id,
      });
    });

    socket.on('call:end', (data: { recipientId: string }) => {
      io.to(`user_${data.recipientId}`).emit('call:ended', {
        endedBy: user.id,
      });
    });

    // WebRTC PeerConnection SDP & ICE candidates
    socket.on('webrtc:offer', (data: { targetUserId: string; sdp: any }) => {
      io.to(`user_${data.targetUserId}`).emit('webrtc:offer', {
        senderId: user.id,
        sdp: data.sdp,
      });
    });

    socket.on('webrtc:answer', (data: { targetUserId: string; sdp: any }) => {
      io.to(`user_${data.targetUserId}`).emit('webrtc:answer', {
        senderId: user.id,
        sdp: data.sdp,
      });
    });

    socket.on('webrtc:ice-candidate', (data: { targetUserId: string; candidate: any }) => {
      io.to(`user_${data.targetUserId}`).emit('webrtc:ice-candidate', {
        senderId: user.id,
        candidate: data.candidate,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          db.prepare('UPDATE users SET is_online = 0, last_seen = ? WHERE id = ?').run(nowStr, userId);
          io.emit('user:offline', { userId, isOnline: false, lastSeen: nowStr });
        }
      }
    });
  });
}
