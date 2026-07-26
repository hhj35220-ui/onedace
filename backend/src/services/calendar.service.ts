import { prisma } from '../config/database';
import { ConnectCalendarDto } from '../dto/calendar/connect-calendar.dto';
import { CalendarSyncDto } from '../dto/calendar/calendar-sync.dto';
import { AppError } from '../utils/AppError';

export class CalendarService {
  async connectCalendar(userId: string, payload: ConnectCalendarDto) {
    const existing = await prisma.calendarIntegration.findFirst({
      where: {
        userId,
        provider: payload.provider,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new AppError('One integration per provider per user is allowed', 409);
    }

    const integration = await prisma.calendarIntegration.create({
      data: {
        userId,
        provider: payload.provider,
        externalCalendarId: payload.externalCalendarId,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        tokenExpiresAt: payload.tokenExpiresAt ? new Date(payload.tokenExpiresAt) : null,
        syncEnabled: payload.syncEnabled ?? true,
      },
    });

    return {
      success: true,
      message: 'Calendar integration connected',
      data: integration,
    };
  }

  async disconnectCalendar(userId: string) {
    const integration = await prisma.calendarIntegration.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!integration) {
      throw new AppError('No active calendar integration found', 404);
    }

    await prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,
      message: 'Calendar integration disconnected',
    };
  }

  async getCalendarStatus(userId: string) {
    const integration = await prisma.calendarIntegration.findFirst({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        provider: true,
        externalCalendarId: true,
        syncEnabled: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: integration ?? null,
    };
  }

  async syncTasks(userId: string, payload: CalendarSyncDto) {
    const integration = await prisma.calendarIntegration.findFirst({
      where: { userId, deletedAt: null },
    });

    if (!integration) {
      throw new AppError('No active calendar integration found', 404);
    }

    const tasks = await prisma.task.findMany({
      where: {
        deletedAt: null,
        creatorId: userId,
        ...(payload.taskId ? { id: payload.taskId } : {}),
      },
      select: {
        id: true,
        name: true,
        description: true,
        dueDate: true,
        priority: true,
      },
    });

    const logs = [] as Array<{ id: string; taskId: string; action: string; status: string; message: string | null; syncedAt: Date }>;

    for (const task of tasks) {
      const action = payload.action ?? 'CREATE';
      const result = await this.syncTask(integration.id, task.id, action);
      logs.push(result);
    }

    return {
      success: true,
      message: 'Calendar sync processed',
      data: {
        integrationId: integration.id,
        count: logs.length,
        logs,
      },
    };
  }

  async generateICS(userId: string) {
    const tasks = await prisma.task.findMany({
      where: {
        deletedAt: null,
        creatorId: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        dueDate: true,
        priority: true,
      },
      orderBy: { dueDate: 'asc' },
    });

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OnePlace Enterprise//Calendar//EN',
      'CALSCALE:GREGORIAN',
    ];

    for (const task of tasks) {
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${task.id}@oneplace.enterprise`);
      lines.push(`SUMMARY:${this.escapeICS(task.name)}`);
      lines.push(`DESCRIPTION:${this.escapeICS(task.description ?? '')}`);
      if (task.dueDate) {
        lines.push(`DTSTART:${this.toICSDate(task.dueDate)}`);
        lines.push(`DTEND:${this.toICSDate(task.dueDate)}`);
      }
      lines.push(`PRIORITY:${this.priorityToNumber(task.priority)}`);
      lines.push('END:VEVENT');
    }

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  async syncTask(integrationId: string, taskId: string, action: 'CREATE' | 'UPDATE' | 'DELETE' = 'CREATE') {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, name: true },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const log = await prisma.calendarSyncLog.create({
      data: {
        integrationId,
        taskId,
        action,
        status: 'SUCCESS',
        message: `Task ${action.toLowerCase()} synced`,
        syncedAt: new Date(),
      },
    });

    return log;
  }

  async removeTask(integrationId: string, taskId: string) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const log = await prisma.calendarSyncLog.create({
      data: {
        integrationId,
        taskId,
        action: 'DELETE',
        status: 'SUCCESS',
        message: 'Task removed from calendar sync',
        syncedAt: new Date(),
      },
    });

    return log;
  }

  private escapeICS(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  private toICSDate(date: Date): string {
    const value = new Date(date);
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private priorityToNumber(priority: string | null | undefined): string {
    switch (priority) {
      case 'CRITICAL': return '1';
      case 'HIGH': return '2';
      case 'MEDIUM': return '3';
      case 'LOW': return '4';
      default: return '3';
    }
  }
}
