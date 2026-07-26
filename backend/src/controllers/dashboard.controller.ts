import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { DashboardQueryDto } from '../dto/dashboard/dashboard-query.dto';
import { DashboardService } from '../services/dashboard.service';
import { AppError } from '../utils/AppError';
import { dashboardQuerySchema } from '../validators/dashboard.validator';

export class DashboardController {
  private readonly dashboardService: DashboardService;

  constructor(dashboardService = new DashboardService()) {
    this.dashboardService = dashboardService;
  }

  async overview(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = dashboardQuerySchema.parse(req.query) as DashboardQueryDto;
      const result = await this.dashboardService.getOverview(req.user.id, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async tasks(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = dashboardQuerySchema.parse(req.query) as DashboardQueryDto;
      const result = await this.dashboardService.getTaskStats(req.user.id, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async projects(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = dashboardQuerySchema.parse(req.query) as DashboardQueryDto;
      const result = await this.dashboardService.getProjectStats(req.user.id, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async time(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = dashboardQuerySchema.parse(req.query) as DashboardQueryDto;
      const result = await this.dashboardService.getTimeStats(req.user.id, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async productivity(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = dashboardQuerySchema.parse(req.query) as DashboardQueryDto;
      const result = await this.dashboardService.getProductivityStats(req.user.id, query);
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
