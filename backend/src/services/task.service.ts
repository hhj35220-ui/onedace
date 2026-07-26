import { prisma } from '../config/database';
import { log } from '../config/logger';
import { Prisma } from '@prisma/client';
import { CreateTaskDto } from '../dto/tasks/create-task.dto';
import { ListTasksQueryDto } from '../dto/tasks/list-tasks-query.dto';
import { UpdateTaskDto } from '../dto/tasks/update-task.dto';
import { AppError } from '../utils/AppError';

export class TaskService {
  private buildResponse(task: Record<string, unknown>) {
    return {
      success: true,
      message: 'Task processed successfully',
      data: task
    };
  }

  private async ensureProjectAccess(userId: string, projectId: string, allowCreator = false): Promise<{ organizationId: string }> {
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true, organizationId: true, createdBy: true }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isOwnerOrAdmin = actor?.role === 'OWNER' || actor?.role === 'ADMIN' || actor?.role === 'SUPER_ADMIN';

    if (allowCreator && project.createdBy === userId) {
      return { organizationId: project.organizationId };
    }

    if (isOwnerOrAdmin) {
      return { organizationId: project.organizationId };
    }

    const organization = await prisma.organization.findFirst({
      where: { id: project.organizationId, deletedAt: null },
      select: { ownerId: true }
    });

    if (organization?.ownerId === userId) {
      return { organizationId: project.organizationId };
    }

    throw new AppError('Forbidden', 403);
  }

  private async validateAssignee(assigneeId: string | null | undefined, organizationId: string): Promise<void> {
    if (!assigneeId) {
      return;
    }

    const assignee = await prisma.user.findUnique({ where: { id: assigneeId }, select: { id: true } });
    if (!assignee) {
      throw new AppError('Assignee not found', 404);
    }

    const membership = await prisma.teamMember.findFirst({
      where: {
        userId: assigneeId,
        deletedAt: null,
        team: {
          organizationId,
          deletedAt: null
        }
      },
      select: { id: true }
    });

    if (!membership) {
      throw new AppError('Assignee is not a member of the organization', 403);
    }
  }

  private async createActivity(taskId: string, userId: string, action: string, metadata: Record<string, unknown> = {}) {
    await prisma.activity.create({
      data: {
        taskId,
        userId,
        action,
        metadata: metadata as Prisma.JsonObject
      }
    });
  }

  async createTask(userId: string, projectId: string, payload: CreateTaskDto) {
    try {
      const { organizationId } = await this.ensureProjectAccess(userId, projectId, true);
      await this.validateAssignee(payload.assigneeId ?? null, organizationId);

      const task = await prisma.task.create({
        data: {
          projectId,
          creatorId: userId,
          assigneeId: payload.assigneeId ?? null,
          name: payload.name.trim(),
          description: payload.description?.trim() ?? null,
          status: payload.status ?? 'TODO',
          priority: payload.priority ?? 'MEDIUM',
          dueDate: payload.dueDate ? new Date(payload.dueDate) : null
        },
        include: {
          project: { select: { id: true, name: true } },
          creator: { select: { id: true, firstName: true, lastName: true, email: true } },
          assignee: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      await this.createActivity(task.id, userId, 'task_created', { projectId, name: task.name });
      log.info('Task created', { taskId: task.id, projectId, userId });
      return this.buildResponse(task);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create task', { error, userId, projectId });
      throw new AppError('An unexpected error occurred while creating the task', 500);
    }
  }

  async getTasks(userId: string, projectId: string, query: ListTasksQueryDto) {
    try {
      const effectiveProjectId = query.projectId ?? projectId;
      await this.ensureProjectAccess(userId, effectiveProjectId);

      const filters: Prisma.TaskWhereInput[] = [{ projectId: effectiveProjectId, deletedAt: null }];

      if (query.status) {
        filters.push({ status: query.status });
      }
      if (query.priority) {
        filters.push({ priority: query.priority });
      }
      if (query.assigneeId) {
        filters.push({ assigneeId: query.assigneeId });
      }
      if (query.creatorId) {
        filters.push({ creatorId: query.creatorId });
      }
      if (query.labelId) {
        filters.push({ taskLabels: { some: { labelId: query.labelId } } });
      }
      if (query.completed !== undefined) {
        filters.push(query.completed ? { status: 'DONE' } : { NOT: { status: 'DONE' } });
      }
      if (query.search) {
        filters.push({
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } }
          ]
        });
      }
      if (query.dueFrom || query.dueTo) {
        const dueDateFilter: Prisma.DateTimeFilter<'Task'> = {};
        if (query.dueFrom) {
          dueDateFilter.gte = new Date(query.dueFrom);
        }
        if (query.dueTo) {
          const endOfDay = new Date(query.dueTo);
          endOfDay.setHours(23, 59, 59, 999);
          dueDateFilter.lte = endOfDay;
        }
        filters.push({ dueDate: dueDateFilter });
      }
      if (query.createdFrom || query.createdTo) {
        const createdAtFilter: Prisma.DateTimeFilter<'Task'> = {};
        if (query.createdFrom) {
          createdAtFilter.gte = new Date(query.createdFrom);
        }
        if (query.createdTo) {
          const endOfDay = new Date(query.createdTo);
          endOfDay.setHours(23, 59, 59, 999);
          createdAtFilter.lte = endOfDay;
        }
        filters.push({ createdAt: createdAtFilter });
      }

      const where: Prisma.TaskWhereInput = filters.length > 1 ? { AND: filters } : filters[0];

      const sortBy = query.sortBy ?? 'createdAt';
      const sortOrder = query.sortOrder ?? 'desc';
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const skip = query.skip ?? (page - 1) * limit;

      const [tasks, total] = await prisma.$transaction([
        prisma.task.findMany({
          where,
          orderBy: { [sortBy]: sortOrder } as Prisma.TaskOrderByWithRelationInput,
          skip,
          take: limit,
          include: {
            project: { select: { id: true, name: true } },
            creator: { select: { id: true, firstName: true, lastName: true, email: true } },
            assignee: { select: { id: true, firstName: true, lastName: true, email: true } }
          }
        }),
        prisma.task.count({ where })
      ]);

      return {
        success: true,
        message: 'Tasks retrieved successfully',
        data: {
          tasks,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve tasks', { error, userId, projectId, query });
      throw new AppError('An unexpected error occurred while retrieving the tasks', 500);
    }
  }

  async getTaskById(userId: string, taskId: string) {
    try {
      const existingTask = await prisma.task.findFirst({
        where: { id: taskId, deletedAt: null },
        select: { id: true, projectId: true }
      });

      if (!existingTask) {
        throw new AppError('Task not found', 404);
      }

      await this.ensureProjectAccess(userId, existingTask.projectId);

      const task = await prisma.task.findFirst({
        where: { id: taskId, deletedAt: null },
        include: {
          project: { select: { id: true, name: true } },
          creator: { select: { id: true, firstName: true, lastName: true, email: true } },
          assignee: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      return this.buildResponse(task);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve task', { error, userId, taskId });
      throw new AppError('An unexpected error occurred while retrieving the task', 500);
    }
  }

  async updateTask(userId: string, taskId: string, payload: UpdateTaskDto) {
    try {
      const existingTask = await prisma.task.findFirst({
        where: { id: taskId, deletedAt: null },
        select: { id: true, projectId: true, assigneeId: true }
      });

      if (!existingTask) {
        throw new AppError('Task not found', 404);
      }

      const { organizationId } = await this.ensureProjectAccess(userId, existingTask.projectId, true);
      if (payload.assigneeId !== undefined) {
        await this.validateAssignee(payload.assigneeId ?? null, organizationId);
      }

      const updateData: Record<string, unknown> = {};
      if (payload.name !== undefined) {
        updateData.name = payload.name.trim();
      }
      if (payload.description !== undefined) {
        updateData.description = payload.description?.trim() ?? null;
      }
      if (payload.status !== undefined) {
        updateData.status = payload.status;
      }
      if (payload.priority !== undefined) {
        updateData.priority = payload.priority;
      }
      if (payload.dueDate !== undefined) {
        updateData.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
      }
      if (payload.assigneeId !== undefined) {
        updateData.assigneeId = payload.assigneeId ?? null;
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: updateData,
        include: {
          project: { select: { id: true, name: true } },
          creator: { select: { id: true, firstName: true, lastName: true, email: true } },
          assignee: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      if (payload.status !== undefined) {
        await this.createActivity(taskId, userId, 'status_changed', { status: payload.status });
      }
      if (payload.priority !== undefined) {
        await this.createActivity(taskId, userId, 'priority_changed', { priority: payload.priority });
      }
      if (payload.assigneeId !== undefined && payload.assigneeId !== existingTask.assigneeId) {
        await this.createActivity(taskId, userId, 'task_assigned', { assigneeId: payload.assigneeId });
      }
      if (payload.name !== undefined || payload.description !== undefined || payload.dueDate !== undefined) {
        await this.createActivity(taskId, userId, 'task_updated', { fields: Object.keys(updateData) });
      }

      log.info('Task updated', { taskId, userId });
      return this.buildResponse(updatedTask);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update task', { error, userId, taskId });
      throw new AppError('An unexpected error occurred while updating the task', 500);
    }
  }

  async getTaskAnalytics(userId: string, projectId: string, groupBy: 'status' | 'priority') {
    try {
      await this.ensureProjectAccess(userId, projectId);

      const tasks = await prisma.task.findMany({
        where: { projectId, deletedAt: null },
        select: {
          status: true,
          priority: true
        }
      });

      const buckets = tasks.reduce<Record<string, number>>((acc, task) => {
        const key = groupBy === 'status' ? task.status : task.priority;
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {});

      return {
        success: true,
        message: 'Task analytics retrieved successfully',
        data: {
          projectId,
          groupBy,
          buckets
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve task analytics', { error, userId, projectId, groupBy });
      throw new AppError('An unexpected error occurred while retrieving task analytics', 500);
    }
  }

  async deleteTask(userId: string, taskId: string) {
    try {
      const task = await prisma.task.findFirst({
        where: { id: taskId, deletedAt: null },
        select: { id: true, projectId: true }
      });

      if (!task) {
        throw new AppError('Task not found', 404);
      }

      await this.ensureProjectAccess(userId, task.projectId, false);
      await prisma.task.update({
        where: { id: taskId },
        data: { deletedAt: new Date() }
      });

      await this.createActivity(taskId, userId, 'task_deleted', {});
      log.info('Task archived', { taskId, userId });
      return {
        success: true,
        message: 'Task archived successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to archive task', { error, userId, taskId });
      throw new AppError('An unexpected error occurred while archiving the task', 500);
    }
  }
}
