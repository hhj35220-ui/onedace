import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AuditService } from '../services/audit.service';
import { AppError } from '../utils/AppError';
import { listAuditQuerySchema, auditIdParamSchema, entityAuditParamSchema } from '../validators/audit.validator';
import { ListAuditDto } from '../dto/audit/list-audit.dto';

export class AuditController {
  private readonly auditService: AuditService;

  constructor(auditService = new AuditService()) {
    this.auditService = auditService;
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const query = listAuditQuerySchema.parse(req.query) as ListAuditDto;
      const result = await this.auditService.listAuditLogs(req.user.id, query);
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

      const { id } = auditIdParamSchema.parse(req.params) as { id: string };
      const result = await this.auditService.getAuditLogById(req.user.id, id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getByEntity(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { entityType, entityId } = entityAuditParamSchema.parse(req.params) as { entityType: string; entityId: string };
      const result = await this.auditService.getAuditLogsByEntity(req.user.id, entityType, entityId);
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
