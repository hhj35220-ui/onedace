import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateAttachmentDto } from '../dto/tasks/create-attachment.dto';
import { TaskAttachmentService } from '../services/task-attachment.service';
import { AppError } from '../utils/AppError';
import { attachmentIdParamSchema, createAttachmentSchema, listAttachmentsQuerySchema, taskIdParamSchema } from '../validators/task-attachment.validator';

export class TaskAttachmentController {
  private readonly taskAttachmentService: TaskAttachmentService;

  constructor(taskAttachmentService = new TaskAttachmentService()) {
    this.taskAttachmentService = taskAttachmentService;
  }

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const payload = createAttachmentSchema.parse(req.body) as CreateAttachmentDto;
      const result = await this.taskAttachmentService.uploadAttachment(req.user.id, taskId, req.file ?? payload.file);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const query = listAttachmentsQuerySchema.parse(req.query) as { page?: number; limit?: number };
      const result = await this.taskAttachmentService.listAttachments(req.user.id, taskId, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { attachmentId } = attachmentIdParamSchema.parse(req.params) as { attachmentId: string };
      const result = await this.taskAttachmentService.deleteAttachment(req.user.id, attachmentId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }
}
