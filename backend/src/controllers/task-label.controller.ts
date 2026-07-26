import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateLabelDto } from '../dto/tasks/create-label.dto';
import { UpdateLabelDto } from '../dto/tasks/update-label.dto';
import { TaskLabelService } from '../services/task-label.service';
import { AppError } from '../utils/AppError';
import { createLabelSchema, labelIdParamSchema, projectIdParamSchema, taskIdParamSchema, updateLabelSchema } from '../validators/task-label.validator';

export class TaskLabelController {
  private readonly taskLabelService: TaskLabelService;

  constructor(taskLabelService = new TaskLabelService()) {
    this.taskLabelService = taskLabelService;
  }

  async listLabels(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { projectId } = projectIdParamSchema.parse(req.params) as { projectId: string };
      const result = await this.taskLabelService.listLabels(req.user.id, projectId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async createLabel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { projectId } = projectIdParamSchema.parse(req.params) as { projectId: string };
      const payload = createLabelSchema.parse(req.body) as CreateLabelDto;
      const result = await this.taskLabelService.createLabel(req.user.id, projectId, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async updateLabel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { labelId } = labelIdParamSchema.parse(req.params) as { labelId: string };
      const payload = updateLabelSchema.parse(req.body) as UpdateLabelDto;
      const result = await this.taskLabelService.updateLabel(req.user.id, labelId, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async deleteLabel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { labelId } = labelIdParamSchema.parse(req.params) as { labelId: string };
      const result = await this.taskLabelService.deleteLabel(req.user.id, labelId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async attachLabel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const { labelId } = labelIdParamSchema.parse(req.params) as { labelId: string };
      const result = await this.taskLabelService.attachLabel(req.user.id, taskId, labelId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async detachLabel(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const { labelId } = labelIdParamSchema.parse(req.params) as { labelId: string };
      const result = await this.taskLabelService.detachLabel(req.user.id, taskId, labelId);
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
