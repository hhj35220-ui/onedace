import { prisma } from '../config/database';
import { log } from '../config/logger';
import { CreateCommentDto } from '../dto/tasks/create-comment.dto';
import { UpdateCommentDto } from '../dto/tasks/update-comment.dto';
import { AppError } from '../utils/AppError';

export class TaskCollaborationService {
  private async ensureTaskAccess(userId: string, taskId: string): Promise<{ taskId: string }> {
    const task = await prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true, projectId: true, creatorId: true }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await prisma.project.findFirst({
      where: { id: task.projectId, deletedAt: null },
      select: { organizationId: true, createdBy: true }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isStaff = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

    if (isStaff || task.creatorId === userId || project.createdBy === userId) {
      return { taskId: task.id };
    }

    const organization = await prisma.organization.findFirst({
      where: { id: project.organizationId, deletedAt: null },
      select: { ownerId: true }
    });

    if (organization?.ownerId === userId) {
      return { taskId: task.id };
    }

    throw new AppError('Forbidden', 403);
  }

  private async createActivity(taskId: string, userId: string, action: string, metadata: Record<string, unknown> = {}) {
    await prisma.activity.create({
      data: {
        taskId,
        userId,
        action,
        metadata: metadata as never
      }
    });
  }

  async createComment(userId: string, taskId: string, payload: CreateCommentDto) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const comment = await prisma.comment.create({
        data: {
          taskId,
          userId,
          content: payload.content.trim()
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      await this.createActivity(taskId, userId, 'comment_added', { commentId: comment.id });
      log.info('Comment created', { commentId: comment.id, taskId, userId });

      return {
        success: true,
        message: 'Comment created successfully',
        data: comment
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create comment', { error, taskId, userId });
      throw new AppError('An unexpected error occurred while creating the comment', 500);
    }
  }

  async listComments(userId: string, taskId: string, query: { page?: number; limit?: number }) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const skip = (page - 1) * limit;

      const [comments, total] = await prisma.$transaction([
        prisma.comment.findMany({
          where: { taskId, deletedAt: null },
          orderBy: { createdAt: 'asc' },
          skip,
          take: limit,
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } }
          }
        }),
        prisma.comment.count({ where: { taskId, deletedAt: null } })
      ]);

      return {
        success: true,
        message: 'Comments retrieved successfully',
        data: {
          comments,
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

      log.error('Failed to retrieve comments', { error, taskId, userId });
      throw new AppError('An unexpected error occurred while retrieving the comments', 500);
    }
  }

  async updateComment(userId: string, commentId: string, payload: UpdateCommentDto) {
    try {
      const comment = await prisma.comment.findFirst({
        where: { id: commentId, deletedAt: null },
        select: { id: true, taskId: true, userId: true }
      });

      if (!comment) {
        throw new AppError('Comment not found', 404);
      }

      const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      const isAdmin = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

      if (!isAdmin && comment.userId !== userId) {
        throw new AppError('Forbidden', 403);
      }

      const updated = await prisma.comment.update({
        where: { id: commentId },
        data: { content: payload.content?.trim() ?? undefined },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      await this.createActivity(comment.taskId, userId, 'comment_edited', { commentId: updated.id });
      log.info('Comment updated', { commentId: updated.id, userId });

      return {
        success: true,
        message: 'Comment updated successfully',
        data: updated
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update comment', { error, commentId, userId });
      throw new AppError('An unexpected error occurred while updating the comment', 500);
    }
  }

  async deleteComment(userId: string, commentId: string) {
    try {
      const comment = await prisma.comment.findFirst({
        where: { id: commentId, deletedAt: null },
        select: { id: true, taskId: true, userId: true }
      });

      if (!comment) {
        throw new AppError('Comment not found', 404);
      }

      const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      const isAdmin = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

      if (!isAdmin && comment.userId !== userId) {
        throw new AppError('Forbidden', 403);
      }

      await prisma.comment.update({
        where: { id: commentId },
        data: { deletedAt: new Date() }
      });

      await this.createActivity(comment.taskId, userId, 'comment_deleted', { commentId: comment.id });
      log.info('Comment deleted', { commentId, userId });

      return {
        success: true,
        message: 'Comment deleted successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete comment', { error, commentId, userId });
      throw new AppError('An unexpected error occurred while deleting the comment', 500);
    }
  }

  async getActivity(userId: string, taskId: string) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const activities = await prisma.activity.findMany({
        where: { taskId },
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      return {
        success: true,
        message: 'Task activity retrieved successfully',
        data: activities
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve activity', { error, taskId, userId });
      throw new AppError('An unexpected error occurred while retrieving the task activity', 500);
    }
  }
}
