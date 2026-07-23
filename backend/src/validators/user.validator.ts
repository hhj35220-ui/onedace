import { z } from 'zod';

const userRoleSchema = z.enum(['OWNER', 'ADMIN', 'MANAGER', 'USER']);

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
  phone: z.string().trim().max(24).nullable().optional(),
  avatarUrl: z.string().trim().max(500).nullable().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  search: z.string().trim().optional(),
  role: userRoleSchema.optional(),
  sortBy: z.enum(['firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const adminUpdateUserSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').optional(),
  lastName: z.string().trim().min(1, 'Last name is required').optional(),
  phone: z.string().trim().max(24).nullable().optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional()
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user id')
});
