import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { prisma } from '../config/database';
import { config } from '../config/env';
import { AppError } from '../utils/AppError';

export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'USER' | 'SUPER_ADMIN';

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

const getBearerToken = (authorizationHeader: string | undefined): string => {
  if (!authorizationHeader) {
    throw new AppError('Authentication token is required', 401);
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    throw new AppError('Authentication token is required', 401);
  }

  return token;
};

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = getBearerToken(req.header('authorization'));

    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload & {
      sub?: string;
      email?: string;
      role?: string;
    };

    if (!decoded || typeof decoded !== 'object' || typeof decoded.sub !== 'string') {
      throw new AppError('Invalid token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true
      }
    });

    if (!user) {
      throw new AppError('Invalid token', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    if (error instanceof Error && error.name === 'TokenExpiredError') {
      next(new AppError('Token has expired', 401));
      return;
    }

    if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError')) {
      next(new AppError('Invalid token', 401));
      return;
    }

    next(new AppError('Invalid token', 401));
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      next(new AppError('Forbidden', 403));
      return;
    }

    next();
  };
};
