import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateChecklistDto } from '../dto/tasks/create-checklist.dto';
import { CreateChecklistItemDto } from '../dto/tasks/create-checklist-item.dto';
import { UpdateChecklistDto } from '../dto/tasks/update-checklist.dto';
import { UpdateChecklistItemDto } from '../dto/tasks/update-checklist-item.dto';
import { TaskChecklistService } from '../services/task-checklist.service';
import { AppError } from '../utils/AppError';
import { checklistIdParamSchema, checklistItemIdParamSchema, createChecklistItemSchema, createChecklistSchema, taskIdParamSchema, updateChecklistItemSchema, updateChecklistSchema } from '../validators/task-checklist.validator';

export class TaskChecklistController {
  private readonly taskChecklistService: TaskChecklistService;

  constructor(taskChecklistService = new TaskChecklistService()) {
    this.taskChecklistService = taskChecklistService;
  }

  async listChecklists(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const result = await this.taskChecklistService.listChecklists(req.user.id, taskId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async createChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { taskId } = taskIdParamSchema.parse(req.params) as { taskId: string };
      const payload = createChecklistSchema.parse(req.body) as CreateChecklistDto;
      const result = await this.taskChecklistService.createChecklist(req.user.id, taskId, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async updateChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { checklistId } = checklistIdParamSchema.parse(req.params) as { checklistId: string };
      const payload = updateChecklistSchema.parse(req.body) as UpdateChecklistDto;
      const result = await this.taskChecklistService.updateChecklist(req.user.id, checklistId, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async deleteChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { checklistId } = checklistIdParamSchema.parse(req.params) as { checklistId: string };
      const result = await this.taskChecklistService.deleteChecklist(req.user.id, checklistId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async createChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { checklistId } = checklistIdParamSchema.parse(req.params) as { checklistId: string };
      const payload = createChecklistItemSchema.parse(req.body) as CreateChecklistItemDto;
      const result = await this.taskChecklistService.createChecklistItem(req.user.id, checklistId, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async updateChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { itemId } = checklistItemIdParamSchema.parse(req.params) as { itemId: string };
      const payload = updateChecklistItemSchema.parse(req.body) as UpdateChecklistItemDto;
      const result = await this.taskChecklistService.updateChecklistItem(req.user.id, itemId, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async toggleChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { itemId } = checklistItemIdParamSchema.parse(req.params) as { itemId: string };
      const result = await this.taskChecklistService.toggleChecklistItem(req.user.id, itemId);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async deleteChecklistItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { itemId } = checklistItemIdParamSchema.parse(req.params) as { itemId: string };
      const result = await this.taskChecklistService.deleteChecklistItem(req.user.id, itemId);
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
