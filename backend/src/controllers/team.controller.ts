import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { CreateTeamDto } from '../dto/teams/create-team.dto';
import { UpdateTeamDto } from '../dto/teams/update-team.dto';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from '../dto/teams/team-member.dto';
import { TeamService } from '../services/team.service';
import { AppError } from '../utils/AppError';
import { createTeamMemberSchema, createTeamSchema, teamIdParamSchema, teamMemberUserIdParamSchema, updateTeamMemberSchema, updateTeamSchema, organizationIdParamSchema } from '../validators/team.validator';

export class TeamController {
  private readonly teamService: TeamService;

  constructor(teamService = new TeamService()) {
    this.teamService = teamService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { organizationId } = organizationIdParamSchema.parse(req.params) as { organizationId: string };
      const payload = createTeamSchema.parse(req.body) as CreateTeamDto;
      const result = await this.teamService.create(req.user.id, organizationId, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async listByOrganization(req: Request, res: Response, next: NextFunction) {
    try {
      const { organizationId } = organizationIdParamSchema.parse(req.params) as { organizationId: string };
      const result = await this.teamService.listByOrganization(organizationId);
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
      const { id } = teamIdParamSchema.parse(req.params) as { id: string };
      const result = await this.teamService.getById(id);
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

      const { id } = teamIdParamSchema.parse(req.params) as { id: string };
      const payload = updateTeamSchema.parse(req.body) as UpdateTeamDto;
      const result = await this.teamService.update(req.user.id, id, payload);
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

      const { id } = teamIdParamSchema.parse(req.params) as { id: string };
      const result = await this.teamService.remove(req.user.id, id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = teamIdParamSchema.parse(req.params) as { id: string };
      const payload = createTeamMemberSchema.parse(req.body) as CreateTeamMemberDto;
      const result = await this.teamService.addMember(req.user.id, id, payload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async updateMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = teamIdParamSchema.parse(req.params) as { id: string };
      const { memberUserId } = teamMemberUserIdParamSchema.parse(req.params) as { memberUserId: string };
      const payload = updateTeamMemberSchema.parse(req.body) as UpdateTeamMemberDto;
      const result = await this.teamService.updateMember(req.user.id, id, memberUserId, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const { id } = teamIdParamSchema.parse(req.params) as { id: string };
      const { memberUserId } = teamMemberUserIdParamSchema.parse(req.params) as { memberUserId: string };
      const result = await this.teamService.removeMember(req.user.id, id, memberUserId);
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
