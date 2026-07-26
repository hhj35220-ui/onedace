import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateTimeEntryDto } from '../dto/tasks/create-time-entry.dto';
import { UpdateTimeEntryDto } from '../dto/tasks/update-time-entry.dto';
import { TaskTimeEntryService } from '../services/task-time-entry.service';
import { AppError } from '../utils/AppError';
import { createTimeEntrySchema, entryIdParamSchema, taskIdParamSchema, updateTimeEntrySchema } from '../validators/task-time-entry.validator';

export class TaskTimeEntryController {
  private readonly taskTimeEntryService: TaskTimeEntryService;

  constructor(taskTimeEntryService = new TaskTimeEntryService()) {
    this.taskTimeEntryService = taskTimeEntryService;
  }

  async listTimeEntries(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const result = await this.taskTimeEntryService.listTimeEntries(req.user.id, taskId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async startTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const payload = createTimeEntrySchema.parse(req.body) as CreateTimeEntryDto;
      const result = await this.taskTimeEntryService.startTimeEntry(req.user.id, taskId, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async stopTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { entryId } = entryIdParamSchema.parse(req.params) as { entryId: string };
      const result = await this.taskTimeEntryService.stopTimeEntry(req.user.id, entryId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async updateTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { entryId } = entryIdParamSchema.parse(req.params) as { entryId: string };
      const payload = updateTimeEntrySchema.parse(req.body) as UpdateTimeEntryDto;
      const result = await this.taskTimeEntryService.updateTimeEntry(req.user.id, entryId, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async deleteTimeEntry(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { entryId } = entryIdParamSchema.parse(req.params) as { entryId: string };
      const result = await this.taskTimeEntryService.deleteTimeEntry(req.user.id, entryId);
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
