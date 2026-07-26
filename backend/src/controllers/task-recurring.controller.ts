import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateRecurringTaskDto } from '../dto/tasks/create-recurring-task.dto';
import { UpdateRecurringTaskDto } from '../dto/tasks/update-recurring-task.dto';
import { TaskRecurringService } from '../services/task-recurring.service';
import { AppError } from '../utils/AppError';
import { createRecurringTaskSchema, recurringIdParamSchema, taskIdParamSchema, updateRecurringTaskSchema } from '../validators/task-recurring.validator';

export class TaskRecurringController {
  private readonly taskRecurringService: TaskRecurringService;

  constructor(taskRecurringService = new TaskRecurringService()) {
    this.taskRecurringService = taskRecurringService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const payload = createRecurringTaskSchema.parse(req.body) as CreateRecurringTaskDto;
      const result = await this.taskRecurringService.createRecurringTask(req.user.id, taskId, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getByTask(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const result = await this.taskRecurringService.getRecurringTask(req.user.id, taskId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = recurringIdParamSchema.parse(req.params) as { id: string };
      const payload = updateRecurringTaskSchema.parse(req.body) as UpdateRecurringTaskDto;
      const result = await this.taskRecurringService.updateRecurringTask(req.user.id, id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = recurringIdParamSchema.parse(req.params) as { id: string };
      const result = await this.taskRecurringService.deleteRecurringTask(req.user.id, id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = recurringIdParamSchema.parse(req.params) as { id: string };
      const result = await this.taskRecurringService.runRecurringTask(req.user.id, id);
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
