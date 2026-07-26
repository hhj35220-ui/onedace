import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateDependencyDto } from '../dto/tasks/create-dependency.dto';
import { TaskDependencyService } from '../services/task-dependency.service';
import { AppError } from '../utils/AppError';
import { createDependencySchema, dependencyIdParamSchema, taskIdParamSchema } from '../validators/task-dependency.validator';

export class TaskDependencyController {
  private readonly taskDependencyService: TaskDependencyService;

  constructor(taskDependencyService = new TaskDependencyService()) {
    this.taskDependencyService = taskDependencyService;
  }

  async listDependencies(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const result = await this.taskDependencyService.listDependencies(req.user.id, taskId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async createDependency(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const payload = createDependencySchema.parse(req.body) as CreateDependencyDto;
      const result = await this.taskDependencyService.createDependency(req.user.id, taskId, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async deleteDependency(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { dependencyId } = dependencyIdParamSchema.parse(req.params) as { dependencyId: string };
      const result = await this.taskDependencyService.deleteDependency(req.user.id, dependencyId);
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
