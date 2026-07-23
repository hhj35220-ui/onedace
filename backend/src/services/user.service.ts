import bcrypt from 'bcryptjs';

import { Prisma } from '@prisma/client';

import { prisma } from '../config/database';
import { log } from '../config/logger';
import { AdminUpdateUserDto } from '../dto/users/admin-update-user.dto';
import { ChangePasswordDto } from '../dto/users/change-password.dto';
import { ListUsersQueryDto } from '../dto/users/list-users-query.dto';
import { UpdateProfileDto } from '../dto/users/update-profile.dto';
import { AppError } from '../utils/AppError';

export class UserService {
  async getProfile(userId: string) {
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
          updatedAt: true
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return {
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          ...user,
          avatarUrl: user.avatar
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve profile', { error });
      throw new AppError('An unexpected error occurred while retrieving the profile', 500);
    }
  }

  async updateProfile(userId: string, payload: UpdateProfileDto) {
    try {
      const data: Record<string, string | null> = {};

      if (payload.firstName !== undefined) {
        data.firstName = payload.firstName.trim();
      }
      if (payload.lastName !== undefined) {
        data.lastName = payload.lastName.trim();
      }
      if (payload.phone !== undefined) {
        data.phone = payload.phone?.trim() ?? null;
      }
      if (payload.avatarUrl !== undefined) {
        data.avatar = payload.avatarUrl?.trim() ?? null;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data,
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
          updatedAt: true
        }
      });

      log.info('Profile updated', { userId });

      return {
        success: true,
        message: 'Profile updated successfully',
        data: {
          ...user,
          avatarUrl: user.avatar
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update profile', { error, userId });
      throw new AppError('An unexpected error occurred while updating the profile', 500);
    }
  }

  async changePassword(userId: string, payload: ChangePasswordDto) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, password: true }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isCurrentPasswordValid = await bcrypt.compare(payload.currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });

        await tx.refreshToken.deleteMany({
          where: { userId: user.id }
        });
      });

      log.info('Password changed', { userId });

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to change password', { error, userId });
      throw new AppError('An unexpected error occurred while changing the password', 500);
    }
  }

  async listUsers(query: ListUsersQueryDto) {
    try {
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const search = query.search?.trim();
      const role = query.role as 'OWNER' | 'ADMIN' | 'MANAGER' | 'USER' | undefined;
      const sortBy = query.sortBy ?? 'createdAt';
      const sortOrder = query.sortOrder ?? 'desc';

      const where: Prisma.UserWhereInput = {
        AND: [
          search
            ? {
                OR: [
                  { firstName: { contains: search, mode: 'insensitive' as const } },
                  { lastName: { contains: search, mode: 'insensitive' as const } },
                  { email: { contains: search, mode: 'insensitive' as const } }
                ]
              }
            : {}
        ],
        ...(role ? { role } : {})
      };

      const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
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
            updatedAt: true
          }
        }),
        prisma.user.count({ where })
      ]);

      return {
        success: true,
        message: 'Users retrieved successfully',
        data: {
          users: users.map((user) => ({ ...user, avatarUrl: user.avatar })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      log.error('Failed to list users', { error });
      throw new AppError('An unexpected error occurred while listing users', 500);
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findFirst({
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
          updatedAt: true
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: {
          ...user,
          avatarUrl: user.avatar
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve user', { error, userId });
      throw new AppError('An unexpected error occurred while retrieving the user', 500);
    }
  }

  async updateUserById(userId: string, payload: AdminUpdateUserDto) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true, isActive: true } });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const data: Record<string, unknown> = {};

      if (payload.firstName !== undefined) {
        data.firstName = payload.firstName.trim();
      }
      if (payload.lastName !== undefined) {
        data.lastName = payload.lastName.trim();
      }
      if (payload.phone !== undefined) {
        data.phone = payload.phone?.trim() ?? null;
      }
      if (payload.role !== undefined) {
        data.role = payload.role as 'OWNER' | 'ADMIN' | 'MANAGER' | 'USER';
      }
      if (payload.isActive !== undefined) {
        data.isActive = payload.isActive;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
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
          updatedAt: true
        }
      });

      if (payload.role !== undefined && payload.role !== user.role) {
        log.info('User role updated', { userId, role: payload.role });
      }

      if (payload.isActive !== undefined && payload.isActive !== user.isActive) {
        log.info(payload.isActive ? 'User activated' : 'User deactivated', { userId });
      }

      log.info('User updated by admin', { userId });

      return {
        success: true,
        message: 'User updated successfully',
        data: {
          ...updatedUser,
          avatarUrl: updatedUser.avatar
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update user by admin', { error, userId });
      throw new AppError('An unexpected error occurred while updating the user', 500);
    }
  }

  async deleteUserById(userId: string) {
    try {
      const existingUser = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });

      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { isActive: false }
        });
        await tx.refreshToken.deleteMany({ where: { userId } });
      });

      log.info('User deleted', { userId });

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete user', { error, userId });
      throw new AppError('An unexpected error occurred while deleting the user', 500);
    }
  }
}
