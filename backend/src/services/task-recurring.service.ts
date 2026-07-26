import { prisma } from '../config/database';
import { CreateRecurringTaskDto } from '../dto/tasks/create-recurring-task.dto';
import { UpdateRecurringTaskDto } from '../dto/tasks/update-recurring-task.dto';
import { AppError } from '../utils/AppError';

export class TaskRecurringService {
  async createRecurringTask(userId: string, taskId: string, payload: CreateRecurringTaskDto) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        OR: [{ assigneeId: userId }, { creatorId: userId }],
      },
    });

    if (!task) {
      throw new AppError('Task not found or access denied', 404);
    }

    const recurrence = await prisma.recurringTask.create({
      data: {
        taskId,
        userId,
        interval: payload.interval,
        frequency: payload.frequency,
        nextRunAt: payload.nextRunAt,
        isActive: payload.isActive ?? true,
        endDate: payload.endDate,
        lastRunAt: null,
      },
      include: {
        task: true,
      },
    });

    return recurrence;
  }

  async getRecurringTask(userId: string, taskId: string) {
    const recurringTask = await prisma.recurringTask.findFirst({
      where: {
        taskId,
        userId,
      },
      include: {
        task: true,
      },
    });

    if (!recurringTask) {
      throw new AppError('Recurring task not found', 404);
    }

    return recurringTask;
  }

  async updateRecurringTask(userId: string, id: string, payload: UpdateRecurringTaskDto) {
    const recurringTask = await prisma.recurringTask.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!recurringTask) {
      throw new AppError('Recurring task not found', 404);
    }

    const updated = await prisma.recurringTask.update({
      where: { id },
      data: payload,
      include: {
        task: true,
      },
    });

    return updated;
  }

  async deleteRecurringTask(userId: string, id: string) {
    const recurringTask = await prisma.recurringTask.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!recurringTask) {
      throw new AppError('Recurring task not found', 404);
    }

    await prisma.recurringTask.delete({ where: { id } });

    return { id, deleted: true };
  }

  async runRecurringTask(userId: string, id: string) {
    const recurringTask = await prisma.recurringTask.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        task: true,
      },
    });

    if (!recurringTask) {
      throw new AppError('Recurring task not found', 404);
    }

    if (!recurringTask.isActive) {
      throw new AppError('Recurring task is inactive', 400);
    }

    const nextRunAt = new Date(recurringTask.nextRunAt);
    const now = new Date();

    if (nextRunAt > now) {
      throw new AppError('Recurring task is not due yet', 400);
    }

    const createdTask = await prisma.task.create({
      data: {
        name: recurringTask.task.name,
        description: recurringTask.task.description,
        status: recurringTask.task.status,
        priority: recurringTask.task.priority,
        dueDate: recurringTask.task.dueDate,
        projectId: recurringTask.task.projectId,
        assigneeId: recurringTask.task.assigneeId,
        creatorId: recurringTask.task.creatorId,
      },
    });

    const updatedRecurring = await prisma.recurringTask.update({
      where: { id },
      data: {
        lastRunAt: now,
        nextRunAt: this.calculateNextRunAt(recurringTask.interval, recurringTask.frequency, now),
      },
      include: {
        task: true,
      },
    });

    return {
      createdTask,
      recurringTask: updatedRecurring,
    };
  }

  private calculateNextRunAt(interval: number, frequency: string, currentDate: Date) {
    const next = new Date(currentDate);

    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + interval);
        break;
      case 'weekly':
        next.setDate(next.getDate() + interval * 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + interval);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + interval);
        break;
      default:
        next.setDate(next.getDate() + interval);
    }

    return next;
  }
}
