import { prisma } from '../config/database';
import { log } from '../config/logger';
import { CreateTimeEntryDto } from '../dto/tasks/create-time-entry.dto';
import { UpdateTimeEntryDto } from '../dto/tasks/update-time-entry.dto';
import { AppError } from '../utils/AppError';

export class TaskTimeEntryService {
  private buildResponse(data: unknown, message: string) {
    return {
      success: true,
      message,
      data
    };
  }

  private async ensureTaskAccess(userId: string, taskId: string): Promise<{ organizationId: string }> {
    const task = await prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true, projectId: true }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await prisma.project.findFirst({
      where: { id: task.projectId, deletedAt: null },
      select: { id: true, organizationId: true }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isAdmin = actor?.role === 'OWNER' || actor?.role === 'ADMIN' || actor?.role === 'SUPER_ADMIN';

    if (isAdmin) {
      return { organizationId: project.organizationId };
    }

    const membership = await prisma.teamMember.findFirst({
      where: {
        userId,
        deletedAt: null,
        team: {
          organizationId: project.organizationId,
          deletedAt: null
        }
      },
      select: { id: true }
    });

    if (membership) {
      return { organizationId: project.organizationId };
    }

    throw new AppError('Forbidden', 403);
  }

  private async ensureTimeEntryAccess(userId: string, entryId: string): Promise<{ taskId: string; organizationId: string }> {
    const entry = await prisma.timeEntry.findFirst({
      where: { id: entryId, deletedAt: null },
      select: { id: true, taskId: true }
    });

    if (!entry) {
      throw new AppError('Time entry not found', 404);
    }

    const access = await this.ensureTaskAccess(userId, entry.taskId);
    return { taskId: entry.taskId, organizationId: access.organizationId };
  }

  private async createTaskActivity(taskId: string, userId: string, action: string, metadata: Record<string, unknown> = {}) {
    await prisma.activity.create({
      data: {
        taskId,
        userId,
        action,
        metadata: metadata as never
      }
    });
  }

  async listTimeEntries(userId: string, taskId: string) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const entries = await prisma.timeEntry.findMany({
        where: { taskId, deletedAt: null },
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      return this.buildResponse(entries, 'Time entries retrieved successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve time entries', { error, userId, taskId });
      throw new AppError('An unexpected error occurred while retrieving the time entries', 500);
    }
  }

  async startTimeEntry(userId: string, taskId: string, payload: CreateTimeEntryDto) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const existingActive = await prisma.timeEntry.findFirst({
        where: {
          taskId,
          userId,
          deletedAt: null,
          endTime: null
        },
        select: { id: true }
      });

      if (existingActive) {
        throw new AppError('An active timer already exists for this task', 409);
      }

      const entry = await prisma.timeEntry.create({
        data: {
          taskId,
          userId,
          description: payload.description?.trim() ?? null,
          startTime: payload.startTime ? new Date(payload.startTime) : new Date(),
          endTime: null,
          durationMinutes: 0
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      await this.createTaskActivity(taskId, userId, 'timer_started', { entryId: entry.id });
      log.info('Timer started', { entryId: entry.id, taskId, userId });

      return this.buildResponse(entry, 'Timer started successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to start timer', { error, userId, taskId });
      throw new AppError('An unexpected error occurred while starting the timer', 500);
    }
  }

  async stopTimeEntry(userId: string, entryId: string) {
    try {
      const access = await this.ensureTimeEntryAccess(userId, entryId);
      const entry = await prisma.timeEntry.findFirst({
        where: { id: entryId, deletedAt: null },
        select: { id: true, taskId: true, startTime: true, endTime: true, durationMinutes: true, userId: true }
      });

      if (!entry) {
        throw new AppError('Time entry not found', 404);
      }

      if (entry.userId !== userId) {
        throw new AppError('Forbidden', 403);
      }

      if (entry.endTime) {
        throw new AppError('Timer is already stopped', 409);
      }

      const endTime = new Date();
      const durationMinutes = Math.max(1, Math.round((endTime.getTime() - new Date(entry.startTime).getTime()) / 60000));

      const updatedEntry = await prisma.timeEntry.update({
        where: { id: entryId },
        data: {
          endTime,
          durationMinutes
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      await this.createTaskActivity(access.taskId, userId, 'timer_stopped', { entryId: updatedEntry.id, durationMinutes });
      log.info('Timer stopped', { entryId: updatedEntry.id, taskId: access.taskId, userId });

      return this.buildResponse(updatedEntry, 'Timer stopped successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to stop timer', { error, userId, entryId });
      throw new AppError('An unexpected error occurred while stopping the timer', 500);
    }
  }

  async updateTimeEntry(userId: string, entryId: string, payload: UpdateTimeEntryDto) {
    try {
      await this.ensureTimeEntryAccess(userId, entryId);
      const updateData: Record<string, unknown> = {};

      if (payload.description !== undefined) {
        updateData.description = payload.description?.trim() ?? null;
      }
      if (payload.durationMinutes !== undefined) {
        updateData.durationMinutes = payload.durationMinutes;
      }
      if (payload.startTime !== undefined) {
        updateData.startTime = new Date(payload.startTime);
      }
      if (payload.endTime !== undefined) {
        updateData.endTime = payload.endTime ? new Date(payload.endTime) : null;
      }

      const updatedEntry = await prisma.timeEntry.update({
        where: { id: entryId },
        data: updateData,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      return this.buildResponse(updatedEntry, 'Time entry updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update time entry', { error, userId, entryId });
      throw new AppError('An unexpected error occurred while updating the time entry', 500);
    }
    }

  async deleteTimeEntry(userId: string, entryId: string) {
    try {
      await this.ensureTimeEntryAccess(userId, entryId);

      const deletedEntry = await prisma.timeEntry.update({
        where: { id: entryId },
        data: { deletedAt: new Date() },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      return this.buildResponse(deletedEntry, 'Time entry deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete time entry', { error, userId, entryId });
      throw new AppError('An unexpected error occurred while deleting the time entry', 500);
    }
  }
}
