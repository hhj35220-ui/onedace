import { randomBytes } from 'crypto';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { prisma } from '../config/database';
import { config } from '../config/env';
import { log } from '../config/logger';
import { firebaseAdminConfigStatus, firebaseAuth, firebaseAdminInitialized } from '../config/firebase';
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';
import { AppError } from '../utils/AppError';

export class AuthService {
  async register(payload: RegisterDto) {
    try {
      const normalizedEmail = payload.email.toLowerCase().trim();

      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail }
      });

      if (existingUser) {
        throw new AppError('Email already exists', 409);
      }

      const hashedPassword = await bcrypt.hash(payload.password, 12);

      const user = await prisma.user.create({
        data: {
          firstName: payload.firstName.trim(),
          lastName: payload.lastName.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          role: 'USER',
          isActive: true,
          emailVerified: false
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      return {
        success: true,
        message: 'Account created successfully',
        data: user
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Registration failed', { error });
      throw new AppError('An unexpected error occurred while creating the account', 500);
    }
  }

  async login(payload: LoginDto) {
    try {
      const normalizedEmail = payload.email.toLowerCase().trim();

      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          password: true,
          isActive: true,
          createdAt: true,
          organizations: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            take: 1,
            select: { id: true, name: true, slug: true }
          }
        }
      });

      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      if (user.isActive === false) {
        throw new AppError('Invalid credentials', 401);
      }

      const isPasswordValid = await bcrypt.compare(payload.password, user.password);

      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      const accessToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role
        },
        config.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshTokenValue = randomBytes(48).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await prisma.refreshToken.create({
        data: {
          token: refreshTokenValue,
          userId: user.id,
          expiresAt
        }
      });

      const userResponse = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        organizationId: user.organizations[0]?.id ?? null,
        organization: user.organizations[0] ?? null
      };

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          accessToken,
          refreshToken: refreshTokenValue
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Login failed', { error });
      throw new AppError('An unexpected error occurred while logging in', 500);
    }
  }

  async loginWithFirebase(idToken: string) {
    const tokenReceived = Boolean(idToken && idToken.trim().length > 0);
    const tokenLength = idToken.trim().length;

    const decodeTokenMetadata = (value: string) => {
      try {
        if (!value || !value.includes('.')) {
          return null;
        }

        const parts = value.split('.');
        if (parts.length < 2) {
          return null;
        }

        const payloadSegment = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = payloadSegment.padEnd(Math.ceil(payloadSegment.length / 4) * 4, '=');
        const decoded = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));

        return {
          iss: decoded.iss ?? null,
          aud: decoded.aud ?? null,
          project_id: decoded.project_id ?? null,
          email: decoded.email ?? null,
          email_verified: decoded.email_verified ?? null,
          exp: decoded.exp ?? null
        };
      } catch {
        return null;
      }
    };

    try {
      if (!firebaseAdminInitialized || !firebaseAuth || typeof firebaseAuth.verifyIdToken !== 'function') {
        throw new AppError('Firebase Admin is not initialized', 500);
      }

      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      const email = String(decodedToken.email || '').toLowerCase().trim();

      if (!email) {
        throw new AppError('Firebase authenticated user does not have an email address', 400);
      }

      let user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          organizations: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            take: 1,
            select: { id: true, name: true, slug: true }
          }
        }
      });

      if (!user) {
        const emailVerified = Boolean(decodedToken.email_verified ?? decodedToken.emailVerified ?? true);
        const fullName = String(decodedToken.name || decodedToken.displayName || '').trim();
        const displayParts = fullName ? fullName.split(/\s+/).filter(Boolean) : [];
        const firstName = displayParts[0] || email.split('@')[0] || 'User';
        const lastName = displayParts.slice(1).join(' ') || 'User';

        if (!emailVerified) {
          throw new AppError('Firebase email is not verified', 401);
        }

        user = await prisma.user.create({
          data: {
            firstName,
            lastName,
            email,
            password: await bcrypt.hash(randomBytes(32).toString('hex'), 12),
            role: 'USER',
            isActive: true,
            emailVerified: true,
            avatar: decodedToken.picture || null
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            organizations: {
              where: { deletedAt: null },
              orderBy: { createdAt: 'asc' },
              take: 1,
              select: { id: true, name: true, slug: true }
            }
          }
        });
      }

      if (user.isActive === false) {
        throw new AppError('Invalid credentials', 401);
      }

      const accessToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role
        },
        config.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshTokenValue = randomBytes(48).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await prisma.refreshToken.create({
        data: {
          token: refreshTokenValue,
          userId: user.id,
          expiresAt
        }
      });

      const userResponse = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        organizationId: user.organizations[0]?.id ?? null,
        organization: user.organizations[0] ?? null
      };

      return {
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          accessToken,
          refreshToken: refreshTokenValue
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const firebaseError = error as { code?: string; message?: string; stack?: string } | undefined;
      const decodedTokenMetadata = decodeTokenMetadata(idToken);

      log.error('Firebase login verification failed', {
        tokenReceived,
        tokenLength,
        firebaseAdminInitialized,
        firebaseAdminConfig: firebaseAdminConfigStatus,
        firebaseErrorCode: firebaseError?.code ?? null,
        firebaseErrorMessage: firebaseError?.message ?? String(error),
        tokenIssuer: decodedTokenMetadata?.iss ?? null,
        tokenAudience: decodedTokenMetadata?.aud ?? null,
        tokenProjectId: decodedTokenMetadata?.project_id ?? null,
        tokenEmail: decodedTokenMetadata?.email ?? null,
        tokenEmailVerified: decodedTokenMetadata?.email_verified ?? null,
        stack: firebaseError?.stack ?? undefined
      });

      const code = firebaseError?.code ? String(firebaseError.code) : 'unknown';
      const message = firebaseError?.message ? String(firebaseError.message) : 'Firebase token verification failed';
      const statusCode = /invalid|expired|mismatch|audience|issuer|project/i.test(code + ' ' + message) ? 401 : 500;

      throw new AppError(`Firebase authentication failed: ${code} - ${message}`, statusCode);
    }
  }

  async refreshToken(token: string) {
    try {
      const refreshTokenRecord = await prisma.refreshToken.findUnique({
        where: { token }
      });

      if (!refreshTokenRecord) {
        throw new AppError('Invalid refresh token', 401);
      }

      if (refreshTokenRecord.revokedAt) {
        throw new AppError('Refresh token has been revoked', 401);
      }

      if (refreshTokenRecord.expiresAt <= new Date()) {
        throw new AppError('Refresh token has expired', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: refreshTokenRecord.userId }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const accessToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role
        },
        config.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const newRefreshTokenValue = randomBytes(48).toString('hex');
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await prisma.$transaction([
        prisma.refreshToken.update({
          where: { id: refreshTokenRecord.id },
          data: { revokedAt: new Date() }
        }),
        prisma.refreshToken.create({
          data: {
            token: newRefreshTokenValue,
            userId: user.id,
            expiresAt
          }
        })
      ]);

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken: newRefreshTokenValue
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Refresh token failed', { error });
      throw new AppError('An unexpected error occurred while refreshing the token', 500);
    }
  }

  async logout(token: string) {
    try {
      const refreshTokenRecord = await prisma.refreshToken.findUnique({
        where: { token }
      });

      if (!refreshTokenRecord) {
        throw new AppError('Invalid refresh token', 401);
      }

      await prisma.refreshToken.update({
        where: { id: refreshTokenRecord.id },
        data: { revokedAt: new Date() }
      });

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Logout failed', { error });
      throw new AppError('An unexpected error occurred while logging out', 500);
    }
  }

  async forgotPassword(email: string) {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, email: true }
      });

      if (!user) {
        return {
          success: true,
          message: 'If the email exists, password reset instructions have been generated.',
          data: null
        };
      }

      const resetToken = jwt.sign(
        {
          sub: user.id,
          email: user.email,
          purpose: 'password_reset'
        },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        success: true,
        message: 'Password reset token generated successfully',
        data: {
          resetToken
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Forgot password failed', { error, email });
      throw new AppError('An unexpected error occurred while generating password reset instructions', 500);
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload & {
        sub?: string;
        email?: string;
        purpose?: string;
      };

      if (!decoded || typeof decoded !== 'object' || typeof decoded.sub !== 'string' || decoded.purpose !== 'password_reset') {
        throw new AppError('Invalid password reset token', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, email: true }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (decoded.email && decoded.email !== user.email) {
        throw new AppError('Invalid password reset token', 401);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });

        await tx.refreshToken.deleteMany({
          where: { userId: user.id }
        });
      });

      return {
        success: true,
        message: 'Password reset successfully',
        data: null
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new AppError('Password reset token has expired', 401);
      }

      if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError')) {
        throw new AppError('Invalid password reset token', 401);
      }

      log.error('Reset password failed', { error });
      throw new AppError('An unexpected error occurred while resetting the password', 500);
    }
  }

  async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as jwt.JwtPayload & {
        sub?: string;
        email?: string;
        purpose?: string;
      };

      if (!decoded || typeof decoded !== 'object' || typeof decoded.sub !== 'string' || decoded.purpose !== 'email_verification') {
        throw new AppError('Invalid email verification token', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: { id: true, email: true, emailVerified: true }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (decoded.email && decoded.email !== user.email) {
        throw new AppError('Invalid email verification token', 401);
      }

      if (!user.emailVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true }
        });
      }

      return {
        success: true,
        message: 'Email verified successfully',
        data: null
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new AppError('Email verification token has expired', 401);
      }

      if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError')) {
        throw new AppError('Invalid email verification token', 401);
      }

      log.error('Verify email failed', { error });
      throw new AppError('An unexpected error occurred while verifying the email', 500);
    }
  }

  async me(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          organizations: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'asc' },
            take: 1,
            select: { id: true, name: true, slug: true }
          }
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return {
        success: true,
        message: 'Authenticated user retrieved successfully',
        data: {
          ...user,
          organizationId: user.organizations[0]?.id ?? null,
          organization: user.organizations[0] ?? null,
          organizations: undefined,
          avatarUrl: user.avatar
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Retrieve authenticated user failed', { error, userId });
      throw new AppError('An unexpected error occurred while retrieving the authenticated user', 500);
    }
  }
}
