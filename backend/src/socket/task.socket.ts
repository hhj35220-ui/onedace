import { Server, Socket } from 'socket.io';
import { TASK_EVENTS } from './socket.events';
import { TaskSocketPayload } from './socket.types';

export class TaskSocketService {
  constructor(private readonly io: Server) {}

  emitTaskCreated(payload: TaskSocketPayload) {
    this.io.to(`organization:${payload.organizationId}`).emit(TASK_EVENTS.CREATED, payload.data);
  }

  emitTaskUpdated(payload: TaskSocketPayload) {
    if (payload.taskId) {
      this.io.to(`task:${payload.taskId}`).emit(TASK_EVENTS.UPDATED, payload.data);
    }
    if (payload.projectId) {
      this.io.to(`project:${payload.projectId}`).emit(TASK_EVENTS.UPDATED, payload.data);
    }
  }

  emitTaskDeleted(payload: TaskSocketPayload) {
    if (payload.taskId) {
      this.io.to(`task:${payload.taskId}`).emit(TASK_EVENTS.DELETED, payload.data);
    }
  }

  emitTaskAssigned(payload: TaskSocketPayload) {
    if (payload.userId) {
      this.io.to(`user:${payload.userId}`).emit(TASK_EVENTS.ASSIGNED, payload.data);
    }
  }

  emitTaskCompleted(payload: TaskSocketPayload) {
    if (payload.taskId) {
      this.io.to(`task:${payload.taskId}`).emit(TASK_EVENTS.COMPLETED, payload.data);
    }
  }

  emitTaskStatusChanged(payload: TaskSocketPayload) {
    if (payload.taskId) {
      this.io.to(`task:${payload.taskId}`).emit(TASK_EVENTS.STATUS_CHANGED, payload.data);
    }
  }

  register(socket: Socket) {
    socket.on('joinTask', (taskId: string) => {
      socket.join(`task:${taskId}`);
    });

    socket.on('leaveTask', (taskId: string) => {
      socket.leave(`task:${taskId}`);
    });
  }
}
