import { prisma } from '../config/database';
import { log } from '../config/logger';
import { CreateChecklistDto } from '../dto/tasks/create-checklist.dto';
import { CreateChecklistItemDto } from '../dto/tasks/create-checklist-item.dto';
import { UpdateChecklistDto } from '../dto/tasks/update-checklist.dto';
import { UpdateChecklistItemDto } from '../dto/tasks/update-checklist-item.dto';
import { AppError } from '../utils/AppError';

export class TaskChecklistService {
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

  private async ensureChecklistAccess(userId: string, checklistId: string): Promise<{ taskId: string; organizationId: string }> {
    const checklist = await prisma.checklist.findFirst({
      where: { id: checklistId, deletedAt: null },
      select: { id: true, taskId: true }
    });

    if (!checklist) {
      throw new AppError('Checklist not found', 404);
    }

    const access = await this.ensureTaskAccess(userId, checklist.taskId);
    return { taskId: checklist.taskId, organizationId: access.organizationId };
  }

  private async ensureChecklistItemAccess(userId: string, itemId: string): Promise<{ checklistId: string; taskId: string; organizationId: string }> {
    const item = await prisma.checklistItem.findFirst({
      where: { id: itemId, deletedAt: null },
      select: { id: true, checklistId: true }
    });

    if (!item) {
      throw new AppError('Checklist item not found', 404);
    }

    const checklist = await prisma.checklist.findFirst({
      where: { id: item.checklistId, deletedAt: null },
      select: { id: true, taskId: true }
    });

    if (!checklist) {
      throw new AppError('Checklist not found', 404);
    }

    const access = await this.ensureTaskAccess(userId, checklist.taskId);
    return { checklistId: item.checklistId, taskId: checklist.taskId, organizationId: access.organizationId };
  }

  async listChecklists(userId: string, taskId: string) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const checklists = await prisma.checklist.findMany({
        where: { taskId, deletedAt: null },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        include: {
          items: {
            where: { deletedAt: null },
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
            include: {
              completedByUser: { select: { id: true, firstName: true, lastName: true, email: true } }
            }
          }
        }
      });

      return this.buildResponse(checklists, 'Checklists retrieved successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve checklists', { error, userId, taskId });
      throw new AppError('An unexpected error occurred while retrieving the checklists', 500);
    }
  }

  async createChecklist(userId: string, taskId: string, payload: CreateChecklistDto) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const checklist = await prisma.checklist.create({
        data: {
          taskId,
          title: payload.title.trim(),
          position: payload.position ?? 0
        },
        include: {
          items: {
            where: { deletedAt: null },
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
            include: {
              completedByUser: { select: { id: true, firstName: true, lastName: true, email: true } }
            }
          }
        }
      });

      return this.buildResponse(checklist, 'Checklist created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create checklist', { error, userId, taskId });
      throw new AppError('An unexpected error occurred while creating the checklist', 500);
    }
  }

  async updateChecklist(userId: string, checklistId: string, payload: UpdateChecklistDto) {
    try {
      await this.ensureChecklistAccess(userId, checklistId);
      const updateData: Record<string, unknown> = {};

      if (payload.title !== undefined) {
        updateData.title = payload.title.trim();
      }
      if (payload.position !== undefined) {
        updateData.position = payload.position;
      }

      const checklist = await prisma.checklist.update({
        where: { id: checklistId },
        data: updateData,
        include: {
          items: {
            where: { deletedAt: null },
            orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
            include: {
              completedByUser: { select: { id: true, firstName: true, lastName: true, email: true } }
            }
          }
        }
      });

      return this.buildResponse(checklist, 'Checklist updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update checklist', { error, userId, checklistId });
      throw new AppError('An unexpected error occurred while updating the checklist', 500);
    }
  }

  async deleteChecklist(userId: string, checklistId: string) {
    try {
      const checklist = await prisma.checklist.findFirst({
        where: { id: checklistId, deletedAt: null },
        select: { id: true, taskId: true }
      });

      if (!checklist) {
        throw new AppError('Checklist not found', 404);
      }

      const task = await prisma.task.findFirst({
        where: { id: checklist.taskId, deletedAt: null },
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

      if (!isAdmin) {
        throw new AppError('Forbidden', 403);
      }

      await prisma.$transaction([
        prisma.checklistItem.updateMany({ where: { checklistId }, data: { deletedAt: new Date() } }),
        prisma.checklist.update({ where: { id: checklistId }, data: { deletedAt: new Date() } })
      ]);

      return this.buildResponse(null, 'Checklist deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete checklist', { error, userId, checklistId });
      throw new AppError('An unexpected error occurred while deleting the checklist', 500);
    }
  }

  async createChecklistItem(userId: string, checklistId: string, payload: CreateChecklistItemDto) {
    try {
      await this.ensureChecklistAccess(userId, checklistId);

      const item = await prisma.checklistItem.create({
        data: {
          checklistId,
          content: payload.content.trim(),
          position: payload.position ?? 0
        },
        include: {
          completedByUser: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      return this.buildResponse(item, 'Checklist item created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create checklist item', { error, userId, checklistId });
      throw new AppError('An unexpected error occurred while creating the checklist item', 500);
    }
  }

  async updateChecklistItem(userId: string, itemId: string, payload: UpdateChecklistItemDto) {
    try {
      await this.ensureChecklistItemAccess(userId, itemId);
      const updateData: Record<string, unknown> = {};

      if (payload.content !== undefined) {
        updateData.content = payload.content.trim();
      }
      if (payload.position !== undefined) {
        updateData.position = payload.position;
      }

      const item = await prisma.checklistItem.update({
        where: { id: itemId },
        data: updateData,
        include: {
          completedByUser: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      return this.buildResponse(item, 'Checklist item updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update checklist item', { error, userId, itemId });
      throw new AppError('An unexpected error occurred while updating the checklist item', 500);
    }
  }

  async toggleChecklistItem(userId: string, itemId: string) {
    try {
      await this.ensureChecklistItemAccess(userId, itemId);
      const item = await prisma.checklistItem.findFirst({
        where: { id: itemId, deletedAt: null },
        select: { id: true, completed: true, completedAt: true, completedBy: true }
      });

      if (!item) {
        throw new AppError('Checklist item not found', 404);
      }

      const completed = !item.completed;
      const itemUpdate = await prisma.checklistItem.update({
        where: { id: itemId },
        data: {
          completed,
          completedAt: completed ? new Date() : null,
          completedBy: completed ? userId : null
        },
        include: {
          completedByUser: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      return this.buildResponse(itemUpdate, completed ? 'Checklist item marked as complete' : 'Checklist item marked as incomplete');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to toggle checklist item', { error, userId, itemId });
      throw new AppError('An unexpected error occurred while toggling the checklist item', 500);
    }
  }

  async deleteChecklistItem(userId: string, itemId: string) {
    try {
      await this.ensureChecklistItemAccess(userId, itemId);

      const item = await prisma.checklistItem.update({
        where: { id: itemId },
        data: { deletedAt: new Date() },
        include: {
          completedByUser: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      return this.buildResponse(item, 'Checklist item deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete checklist item', { error, userId, itemId });
      throw new AppError('An unexpected error occurred while deleting the checklist item', 500);
    }
  }
}
