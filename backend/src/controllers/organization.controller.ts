import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateOrganizationDto } from '../dto/organizations/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/organizations/update-organization.dto';
import { OrganizationService } from '../services/organization.service';
import { AppError } from '../utils/AppError';
import { createOrganizationSchema, updateOrganizationSchema, organizationIdParamSchema } from '../validators/organization.validator';

export class OrganizationController {
  private readonly organizationService: OrganizationService;

  constructor(organizationService = new OrganizationService()) {
    this.organizationService = organizationService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = createOrganizationSchema.parse(req.body) as CreateOrganizationDto;
      const result = await this.organizationService.create(req.user.id, payload);
      res.status(201).json(result);
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
      const { id } = organizationIdParamSchema.parse(req.params) as { id: string };
      const result = await this.organizationService.getById(id);
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

      const { id } = organizationIdParamSchema.parse(req.params) as { id: string };
      const payload = updateOrganizationSchema.parse(req.body) as UpdateOrganizationDto;
      const result = await this.organizationService.update(req.user.id, id, payload);
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

      const { id } = organizationIdParamSchema.parse(req.params) as { id: string };
      const result = await this.organizationService.remove(req.user.id, id);
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
