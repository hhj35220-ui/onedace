import { Server, Socket } from 'socket.io';
import { PRESENCE_EVENTS } from './socket.events';

export class PresenceSocketService {
  constructor(private readonly io: Server) {}

  emitPresenceOnline(userId: string, data: Record<string, unknown> = {}) {
    this.io.to(`user:${userId}`).emit(PRESENCE_EVENTS.ONLINE, data);
  }

  emitPresenceOffline(userId: string, data: Record<string, unknown> = {}) {
    this.io.to(`user:${userId}`).emit(PRESENCE_EVENTS.OFFLINE, data);
  }

  emitTyping(userId: string, data: Record<string, unknown> = {}) {
    this.io.to(`user:${userId}`).emit(PRESENCE_EVENTS.TYPING, data);
  }

  emitStopTyping(userId: string, data: Record<string, unknown> = {}) {
    this.io.to(`user:${userId}`).emit(PRESENCE_EVENTS.STOP_TYPING, data);
  }

  register(socket: Socket) {
    socket.on('typing', (payload: Record<string, unknown>) => {
      socket.broadcast.emit(PRESENCE_EVENTS.TYPING, { ...payload, userId: socket.data.userId });
    });

    socket.on('stopTyping', (payload: Record<string, unknown>) => {
      socket.broadcast.emit(PRESENCE_EVENTS.STOP_TYPING, { ...payload, userId: socket.data.userId });
    });
  }
}
