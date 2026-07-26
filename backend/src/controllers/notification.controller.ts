import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { UpdateNotificationDto } from '../dto/notifications/update-notification.dto';
import { NotificationService } from '../services/notification.service';
import { AppError } from '../utils/AppError';
import { notificationIdParamSchema, updateNotificationSchema } from '../validators/notification.validator';

export class NotificationController {
  private readonly notificationService: NotificationService;

  constructor(notificationService = new NotificationService()) {
    this.notificationService = notificationService;
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);
      const result = await this.notificationService.getNotifications(req.user.id, { page, limit });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async listUnread(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);
      const result = await this.notificationService.getUnreadNotifications(req.user.id, { page, limit });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async unreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const result = await this.notificationService.getUnreadCount(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = notificationIdParamSchema.parse(req.params) as { id: string };
      const payload = updateNotificationSchema.parse(req.body) as UpdateNotificationDto;
      const result = await this.notificationService.markRead(req.user.id, id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const result = await this.notificationService.markAllRead(req.user.id);
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

      const { id } = notificationIdParamSchema.parse(req.params) as { id: string };
      const result = await this.notificationService.deleteNotification(req.user.id, id);
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
