export interface SocketUserContext {
  userId: string;
  organizationId?: string;
  projectIds: string[];
  taskIds: string[];
}

export interface SocketEventPayload {
  event: string;
  data: Record<string, unknown>;
  room?: string;
}

export interface TaskSocketPayload {
  taskId?: string;
  projectId?: string;
  organizationId?: string;
  userId?: string;
  data?: Record<string, unknown>;
}
