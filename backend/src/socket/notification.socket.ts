import { Server, Socket } from 'socket.io';
import { NOTIFICATION_EVENTS } from './socket.events';
import { TaskSocketPayload } from './socket.types';

export class NotificationSocketService {
  constructor(private readonly io: Server) {}

  emitNotification(payload: TaskSocketPayload) {
    if (payload.userId) {
      this.io.to(`user:${payload.userId}`).emit(NOTIFICATION_EVENTS.CREATED, payload.data);
    }
  }

  emitNotificationRead(payload: TaskSocketPayload) {
    if (payload.userId) {
      this.io.to(`user:${payload.userId}`).emit(NOTIFICATION_EVENTS.READ, payload.data);
    }
  }

  register(socket: Socket) {
    socket.on('joinNotifications', () => {
      socket.join(`user:${socket.data.userId}`);
    });
  }
}
