import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateProjectDto } from '../dto/projects/create-project.dto';
import { UpdateProjectDto } from '../dto/projects/update-project.dto';
import { ListProjectsQueryDto } from '../dto/projects/list-projects-query.dto';
import { ProjectService } from '../services/project.service';
import { AppError } from '../utils/AppError';
import { createProjectSchema, listProjectsQuerySchema, projectIdParamSchema, updateProjectSchema } from '../validators/project.validator';

export class ProjectController {
  private readonly projectService: ProjectService;

  constructor(projectService = new ProjectService()) {
    this.projectService = projectService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = createProjectSchema.parse(req.body) as CreateProjectDto;
      const result = await this.projectService.createProject(req.user.id, payload);
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

      const query = listProjectsQuerySchema.parse(req.query) as ListProjectsQueryDto;
      const result = await this.projectService.getProjects(req.user.id, query);
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

      const { id } = projectIdParamSchema.parse(req.params) as { id: string };
      const result = await this.projectService.getProjectById(req.user.id, id);
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

      const { id } = projectIdParamSchema.parse(req.params) as { id: string };
      const payload = updateProjectSchema.parse(req.body) as UpdateProjectDto;
      const result = await this.projectService.updateProject(req.user.id, id, payload);
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

      const { id } = projectIdParamSchema.parse(req.params) as { id: string };
      const result = await this.projectService.deleteProject(req.user.id, id);
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
