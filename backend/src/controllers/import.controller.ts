import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ImportProjectsDto } from '../dto/import/import-projects.dto';
import { ImportTasksDto } from '../dto/import/import-tasks.dto';
import { ImportService } from '../services/import.service';
import { AppError } from '../utils/AppError';
import { importProjectsSchema, importTasksSchema } from '../validators/import.validator';

export class ImportController {
  private readonly importService: ImportService;

  constructor(importService = new ImportService()) {
    this.importService = importService;
  }

  async importTasks(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = importTasksSchema.parse(req.body) as ImportTasksDto;
      const result = await this.importService.importTasks(req.user.id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async importProjects(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = importProjectsSchema.parse(req.body) as ImportProjectsDto;
      const result = await this.importService.importProjects(req.user.id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getTasksTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const result = await this.importService.getTasksTemplate(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async getProjectsTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const result = await this.importService.getProjectsTemplate(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
}
