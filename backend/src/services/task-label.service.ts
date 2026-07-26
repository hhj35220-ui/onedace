import { prisma } from '../config/database';
import { log } from '../config/logger';
import { CreateLabelDto } from '../dto/tasks/create-label.dto';
import { UpdateLabelDto } from '../dto/tasks/update-label.dto';
import { AppError } from '../utils/AppError';

export class TaskLabelService {
  private buildResponse(data: unknown, message: string) {
    return {
      success: true,
      message,
      data
    };
  }

  private async ensureProjectAccess(userId: string, projectId: string): Promise<{ organizationId: string }> {
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true, organizationId: true, createdBy: true }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await this.ensureOrganizationAccess(userId, project.organizationId);

    return { organizationId: project.organizationId };
  }

  private async ensureOrganizationAccess(userId: string, organizationId: string): Promise<void> {
    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isAdmin = actor?.role === 'OWNER' || actor?.role === 'ADMIN' || actor?.role === 'SUPER_ADMIN';

    if (isAdmin) {
      return;
    }

    const organization = await prisma.organization.findFirst({
      where: { id: organizationId, deletedAt: null },
      select: { ownerId: true }
    });

    if (organization?.ownerId === userId) {
      return;
    }

    const membership = await prisma.teamMember.findFirst({
      where: {
        userId,
        deletedAt: null,
        team: {
          organizationId,
          deletedAt: null
        }
      },
      select: { id: true }
    });

    if (membership) {
      return;
    }

    throw new AppError('Forbidden', 403);
  }

  private async ensureTaskAccess(userId: string, taskId: string): Promise<{ organizationId: string }> {
    const task = await prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true, projectId: true }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    return this.ensureProjectAccess(userId, task.projectId);
  }

  async listLabels(userId: string, projectId: string) {
    try {
      const { organizationId } = await this.ensureProjectAccess(userId, projectId);

      const labels = await prisma.label.findMany({
        where: { organizationId, deletedAt: null },
        orderBy: { createdAt: 'asc' }
      });

      return this.buildResponse(labels, 'Labels retrieved successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve labels', { error, userId, projectId });
      throw new AppError('An unexpected error occurred while retrieving the labels', 500);
    }
  }

  async createLabel(userId: string, projectId: string, payload: CreateLabelDto) {
    try {
      const { organizationId } = await this.ensureProjectAccess(userId, projectId);

      const label = await prisma.label.create({
        data: {
          organizationId,
          name: payload.name.trim(),
          color: payload.color.trim().toLowerCase()
        }
      });

      return this.buildResponse(label, 'Label created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create label', { error, userId, projectId });
      throw new AppError('An unexpected error occurred while creating the label', 500);
    }
  }

  async updateLabel(userId: string, labelId: string, payload: UpdateLabelDto) {
    try {
      const label = await prisma.label.findFirst({
        where: { id: labelId, deletedAt: null },
        select: { id: true, organizationId: true }
      });

      if (!label) {
        throw new AppError('Label not found', 404);
      }

      await this.ensureOrganizationAccess(userId, label.organizationId);

      const updateData: Record<string, string> = {};
      if (payload.name !== undefined) {
        updateData.name = payload.name.trim();
      }
      if (payload.color !== undefined) {
        updateData.color = payload.color.trim().toLowerCase();
      }

      const updatedLabel = await prisma.label.update({
        where: { id: labelId },
        data: updateData
      });

      return this.buildResponse(updatedLabel, 'Label updated successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update label', { error, userId, labelId });
      throw new AppError('An unexpected error occurred while updating the label', 500);
    }
  }

  async deleteLabel(userId: string, labelId: string) {
    try {
      const label = await prisma.label.findFirst({
        where: { id: labelId, deletedAt: null },
        select: { id: true, organizationId: true }
      });

      if (!label) {
        throw new AppError('Label not found', 404);
      }

      await this.ensureOrganizationAccess(userId, label.organizationId);

      const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      const isAdmin = actor?.role === 'OWNER' || actor?.role === 'ADMIN' || actor?.role === 'SUPER_ADMIN';

      if (!isAdmin) {
        throw new AppError('Forbidden', 403);
      }

      await prisma.$transaction([
        prisma.taskLabel.deleteMany({ where: { labelId } }),
        prisma.label.update({
          where: { id: labelId },
          data: { deletedAt: new Date() }
        })
      ]);

      return this.buildResponse(null, 'Label deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete label', { error, userId, labelId });
      throw new AppError('An unexpected error occurred while deleting the label', 500);
    }
  }

  async attachLabel(userId: string, taskId: string, labelId: string) {
    try {
      const { organizationId } = await this.ensureTaskAccess(userId, taskId);

      const label = await prisma.label.findFirst({
        where: { id: labelId, deletedAt: null },
        select: { id: true, organizationId: true }
      });

      if (!label) {
        throw new AppError('Label not found', 404);
      }

      if (label.organizationId !== organizationId) {
        throw new AppError('Label does not belong to this organization', 400);
      }

      const existingLink = await prisma.taskLabel.findUnique({
        where: {
          taskId_labelId: {
            taskId,
            labelId
          }
        }
      });

      if (existingLink) {
        return this.buildResponse({ taskId, labelId }, 'Label already attached to task');
      }

      await prisma.taskLabel.create({
        data: {
          taskId,
          labelId
        }
      });

      return this.buildResponse({ taskId, labelId }, 'Label attached to task successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to attach label', { error, userId, taskId, labelId });
      throw new AppError('An unexpected error occurred while attaching the label', 500);
    }
  }

  async detachLabel(userId: string, taskId: string, labelId: string) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const label = await prisma.label.findFirst({
        where: { id: labelId, deletedAt: null },
        select: { id: true }
      });

      if (!label) {
        throw new AppError('Label not found', 404);
      }

      const existingLink = await prisma.taskLabel.findUnique({
        where: {
          taskId_labelId: {
            taskId,
            labelId
          }
        }
      });

      if (!existingLink) {
        return this.buildResponse({ taskId, labelId }, 'Label is not attached to task');
      }

      await prisma.taskLabel.delete({
        where: {
          taskId_labelId: {
            taskId,
            labelId
          }
        }
      });

      return this.buildResponse({ taskId, labelId }, 'Label detached from task successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to detach label', { error, userId, taskId, labelId });
      throw new AppError('An unexpected error occurred while detaching the label', 500);
    }
  }
}
