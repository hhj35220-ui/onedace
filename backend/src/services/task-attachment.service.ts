import fs from 'fs';
import path from 'path';
import multer from 'multer';

import { prisma } from '../config/database';
import { log } from '../config/logger';
import { AppError } from '../utils/AppError';

const uploadDir = path.resolve(__dirname, '../../uploads/tasks');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'text/plain'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error('Unsupported file type'));
  }
});

export const uploadAttachmentMiddleware = upload.single('file');

export class TaskAttachmentService {
  private async ensureTaskAccess(userId: string, taskId: string): Promise<{ taskId: string; projectId: string }> {
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
      return { taskId: task.id, projectId: task.projectId };
    }

    const organization = await prisma.organization.findFirst({
      where: { id: project.organizationId, deletedAt: null },
      select: { ownerId: true }
    });

    if (organization?.ownerId === userId) {
      return { taskId: task.id, projectId: task.projectId };
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

  async uploadAttachment(userId: string, taskId: string, file: Express.Multer.File | undefined) {
    try {
      if (!file) {
        throw new AppError('Attachment file is required', 400);
      }

      await this.ensureTaskAccess(userId, taskId);

      const attachment = await prisma.attachment.create({
        data: {
          taskId,
          uploadedBy: userId,
          originalName: file.originalname,
          fileName: file.filename,
          mimeType: file.mimetype,
          fileSize: file.size,
          filePath: path.relative(path.resolve(__dirname, '../../'), file.path).replace(/\\/g, '/')
        }
      });

      await this.createActivity(taskId, userId, 'attachment_uploaded', { attachmentId: attachment.id, fileName: attachment.fileName, taskId });
      log.info('Attachment uploaded', { attachmentId: attachment.id, taskId, userId });

      return {
        success: true,
        message: 'Attachment uploaded successfully',
        data: attachment
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to upload attachment', { error, taskId, userId });
      throw new AppError('An unexpected error occurred while uploading the attachment', 500);
    }
  }

  async listAttachments(userId: string, taskId: string, query: { page?: number; limit?: number }) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const skip = (page - 1) * limit;

      const [attachments, total] = await prisma.$transaction([
        prisma.attachment.findMany({
          where: { taskId, deletedAt: null },
          orderBy: { createdAt: 'asc' },
          skip,
          take: limit
        }),
        prisma.attachment.count({ where: { taskId, deletedAt: null } })
      ]);

      return {
        success: true,
        message: 'Attachments retrieved successfully',
        data: {
          attachments,
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

      log.error('Failed to retrieve attachments', { error, taskId, userId });
      throw new AppError('An unexpected error occurred while retrieving the attachments', 500);
    }
  }

  async deleteAttachment(userId: string, attachmentId: string) {
    try {
      const attachment = await prisma.attachment.findFirst({
        where: { id: attachmentId, deletedAt: null },
        select: { id: true, taskId: true, uploadedBy: true }
      });

      if (!attachment) {
        throw new AppError('Attachment not found', 404);
      }

      const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      const isAdmin = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

      if (!isAdmin && attachment.uploadedBy !== userId) {
        throw new AppError('Forbidden', 403);
      }

      await prisma.attachment.update({
        where: { id: attachmentId },
        data: { deletedAt: new Date() }
      });

      await this.createActivity(attachment.taskId, userId, 'attachment_deleted', { attachmentId: attachment.id, fileName: attachment.id, taskId: attachment.taskId });
      log.info('Attachment deleted', { attachmentId, userId });

      return {
        success: true,
        message: 'Attachment deleted successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete attachment', { error, attachmentId, userId });
      throw new AppError('An unexpected error occurred while deleting the attachment', 500);
    }
  }
}
