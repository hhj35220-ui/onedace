import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { ChangePasswordDto } from '../dto/users/change-password.dto';
import { AdminUpdateUserDto } from '../dto/users/admin-update-user.dto';
import { ListUsersQueryDto } from '../dto/users/list-users-query.dto';
import { UpdateProfileDto } from '../dto/users/update-profile.dto';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/AppError';
import { adminUpdateUserSchema, changePasswordSchema, listUsersQuerySchema, updateProfileSchema, userIdParamSchema } from '../validators/user.validator';

export class UserController {
  private readonly userService: UserService;

  constructor(userService = new UserService()) {
    this.userService = userService;
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const result = await this.userService.getProfile(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = updateProfileSchema.parse(req.body) as UpdateProfileDto;
      const result = await this.userService.updateProfile(req.user.id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      const payload = changePasswordSchema.parse(req.body) as ChangePasswordDto;
      const result = await this.userService.changePassword(req.user.id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listUsersQuerySchema.parse(req.query) as ListUsersQueryDto;
      const result = await this.userService.listUsers(query);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = userIdParamSchema.parse(req.params) as { id: string };
      const result = await this.userService.getUserById(id);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = userIdParamSchema.parse(req.params) as { id: string };
      const payload = adminUpdateUserSchema.parse(req.body) as AdminUpdateUserDto;
      const result = await this.userService.updateUserById(id, payload);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = userIdParamSchema.parse(req.params) as { id: string };
      const result = await this.userService.deleteUserById(id);
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
