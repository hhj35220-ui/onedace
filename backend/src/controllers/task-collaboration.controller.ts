import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateCommentDto } from '../dto/tasks/create-comment.dto';
import { UpdateCommentDto } from '../dto/tasks/update-comment.dto';
import { TaskCollaborationService } from '../services/task-collaboration.service';
import { AppError } from '../utils/AppError';
import { commentIdParamSchema, createCommentSchema, listCommentsQuerySchema, taskIdParamSchema, updateCommentSchema } from '../validators/task-collaboration.validator';

export class TaskCollaborationController {
  private readonly taskCollaborationService: TaskCollaborationService;

  constructor(taskCollaborationService = new TaskCollaborationService()) {
    this.taskCollaborationService = taskCollaborationService;
  }

  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const payload = createCommentSchema.parse(req.body) as CreateCommentDto;
      const result = await this.taskCollaborationService.createComment(req.user.id, taskId, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async listComments(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const query = listCommentsQuerySchema.parse(req.query) as { page?: number; limit?: number };
      const result = await this.taskCollaborationService.listComments(req.user.id, taskId, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = commentIdParamSchema.parse(req.params) as { id: string };
      const payload = updateCommentSchema.parse(req.body) as UpdateCommentDto;
      const result = await this.taskCollaborationService.updateComment(req.user.id, id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = commentIdParamSchema.parse(req.params) as { id: string };
      const result = await this.taskCollaborationService.deleteComment(req.user.id, id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getActivity(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const result = await this.taskCollaborationService.getActivity(req.user.id, taskId);
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
