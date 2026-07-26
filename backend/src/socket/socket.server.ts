import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { log } from '../config/logger';
import { TaskSocketService } from './task.socket';
import { NotificationSocketService } from './notification.socket';
import { PresenceSocketService } from './presence.socket';
import { SocketUserContext } from './socket.types';

export class SocketServer {
  private io: Server;
  private readonly taskSocketService: TaskSocketService;
  private readonly notificationSocketService: NotificationSocketService;
  private readonly presenceSocketService: PresenceSocketService;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    this.taskSocketService = new TaskSocketService(this.io);
    this.notificationSocketService = new NotificationSocketService(this.io);
    this.presenceSocketService = new PresenceSocketService(this.io);

    this.initialize();
  }

  private initialize() {
    this.io.of('/tasks').use(this.authenticate.bind(this));
    this.io.of('/notifications').use(this.authenticate.bind(this));
    this.io.of('/presence').use(this.authenticate.bind(this));

    this.io.of('/tasks').on('connection', (socket) => this.handleTaskConnection(socket));
    this.io.of('/notifications').on('connection', (socket) => this.handleNotificationConnection(socket));
    this.io.of('/presence').on('connection', (socket) => this.handlePresenceConnection(socket));
  }

  private authenticate(socket: Socket, next: (err?: Error) => void) {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, config.JWT_SECRET) as { sub?: string };
      if (!decoded.sub) {
        return next(new Error('Authentication error'));
      }

      socket.data.userId = decoded.sub;
      socket.data.organizationId = socket.handshake.auth.organizationId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  }

  private handleTaskConnection(socket: Socket) {
    const context = this.buildContext(socket);
    this.joinBaseRooms(socket, context);
    this.taskSocketService.register(socket);

    socket.on('joinProject', (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('leaveProject', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on('disconnect', () => {
      log.info('Task socket disconnected', { userId: context.userId });
    });
  }

  private handleNotificationConnection(socket: Socket) {
    const context = this.buildContext(socket);
    this.joinBaseRooms(socket, context);
    this.notificationSocketService.register(socket);

    socket.on('disconnect', () => {
      log.info('Notification socket disconnected', { userId: context.userId });
    });
  }

  private handlePresenceConnection(socket: Socket) {
    const context = this.buildContext(socket);
    this.joinBaseRooms(socket, context);
    this.presenceSocketService.register(socket);

    socket.emit('presence:init', { userId: context.userId });
    this.presenceSocketService.emitPresenceOnline(context.userId, { userId: context.userId });

    socket.on('disconnect', () => {
      this.presenceSocketService.emitPresenceOffline(context.userId, { userId: context.userId });
      log.info('Presence socket disconnected', { userId: context.userId });
    });
  }

  private buildContext(socket: Socket): SocketUserContext {
    return {
      userId: socket.data.userId,
      organizationId: socket.data.organizationId,
      projectIds: [],
      taskIds: []
    };
  }

  private joinBaseRooms(socket: Socket, context: SocketUserContext) {
    if (context.organizationId) {
      socket.join(`organization:${context.organizationId}`);
    }
    socket.join(`user:${context.userId}`);
  }

  getIo() {
    return this.io;
  }
}
