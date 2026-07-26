import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateTaskDto } from '../dto/tasks/create-task.dto';
import { ListTasksQueryDto } from '../dto/tasks/list-tasks-query.dto';
import { UpdateTaskDto } from '../dto/tasks/update-task.dto';
import { TaskService } from '../services/task.service';
import { AppError } from '../utils/AppError';
import { createTaskSchema, listTasksQuerySchema, projectIdParamSchema, taskAnalyticsQuerySchema, taskIdParamSchema, updateTaskSchema } from '../validators/task.validator';

export class TaskController {
  private readonly taskService: TaskService;

  constructor(taskService = new TaskService()) {
    this.taskService = taskService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { projectId } = projectIdParamSchema.parse(req.params) as { projectId: string };
      const payload = createTaskSchema.parse(req.body) as CreateTaskDto;
      const result = await this.taskService.createTask(req.user.id, projectId, payload);
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

      const { projectId } = projectIdParamSchema.parse(req.params) as { projectId: string };
      const query = listTasksQuerySchema.parse(req.query) as ListTasksQueryDto;
      const result = await this.taskService.getTasks(req.user.id, projectId, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = taskIdParamSchema.parse(req.params) as { id: string };
      const result = await this.taskService.getTaskById(req.user.id, id);
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

      const { id } = taskIdParamSchema.parse(req.params) as { id: string };
      const payload = updateTaskSchema.parse(req.body) as UpdateTaskDto;
      const result = await this.taskService.updateTask(req.user.id, id, payload);
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

      const { id } = taskIdParamSchema.parse(req.params) as { id: string };
      const result = await this.taskService.deleteTask(req.user.id, id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async analytics(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { projectId } = projectIdParamSchema.parse(req.params) as { projectId: string };
      const query = taskAnalyticsQuerySchema.parse(req.query) as { groupBy: 'status' | 'priority' };
      const result = await this.taskService.getTaskAnalytics(req.user.id, projectId, query.groupBy);
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
