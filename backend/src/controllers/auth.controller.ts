import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/AppError';
import { loginSchema, registerSchema } from '../validators/auth.validator';

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = registerSchema.parse(req.body) as RegisterDto;
      const result = await this.authService.register(payload);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = loginSchema.parse(req.body) as LoginDto;
      const result = await this.authService.login(payload);

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? 'Validation failed';
        return next(new AppError(message, 400));
      }

      return next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body?.refreshToken as string | undefined;

      if (!refreshToken) {
        return next(new AppError('Refresh token is required', 400));
      }

      const result = await this.authService.refreshToken(refreshToken);
      res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body?.refreshToken as string | undefined;

      if (!refreshToken) {
        return next(new AppError('Refresh token is required', 400));
      }

      const result = await this.authService.logout(refreshToken);
      res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }

  async forgotPassword(_req: Request, _res: Response) {
    return await this.authService.forgotPassword();
  }

  async resetPassword(_req: Request, _res: Response) {
    return await this.authService.resetPassword();
  }

  async verifyEmail(_req: Request, _res: Response) {
    return await this.authService.verifyEmail();
  }

  async me(_req: Request, _res: Response) {
    return await this.authService.me();
  }
}
