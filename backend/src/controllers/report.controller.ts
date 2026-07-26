import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ExportReportDto } from '../dto/report/export-report.dto';
import { ReportService } from '../services/report.service';
import { AppError } from '../utils/AppError';
import { exportReportSchema, reportQuerySchema } from '../validators/report.validator';

export class ReportController {
  private readonly reportService: ReportService;

  constructor(reportService = new ReportService()) {
    this.reportService = reportService;
  }

  async getTasksReport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = reportQuerySchema.parse(req.query);
      const result = await this.reportService.getTasksReport(req.user.id, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getProjectsReport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = reportQuerySchema.parse(req.query);
      const result = await this.reportService.getProjectsReport(req.user.id, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getTimeReport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = reportQuerySchema.parse(req.query);
      const result = await this.reportService.getTimeReport(req.user.id, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getProductivityReport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = reportQuerySchema.parse(req.query);
      const result = await this.reportService.getProductivityReport(req.user.id, query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async exportReport(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = exportReportSchema.parse(req.body) as ExportReportDto;
      const result = await this.reportService.exportReport(req.user.id, payload);
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
