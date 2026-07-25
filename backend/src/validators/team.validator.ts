import { z } from 'zod';

const teamMemberRoleSchema = z.enum(['ADMIN', 'MEMBER']);

export const createTeamSchema = z.object({
  name: z.string().trim().min(1, 'Team name is required').max(100, 'Team name is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional(),
  color: z.string().trim().max(24, 'Color is too long').optional()
});

export const updateTeamSchema = z.object({
  name: z.string().trim().min(1, 'Team name is required').max(100, 'Team name is too long').optional(),
  description: z.string().trim().max(500, 'Description is too long').nullable().optional(),
  color: z.string().trim().max(24, 'Color is too long').nullable().optional()
});

export const createTeamMemberSchema = z.object({
  userId: z.string().uuid('Invalid user id'),
  role: teamMemberRoleSchema.optional().default('MEMBER')
});

export const updateTeamMemberSchema = z.object({
  role: teamMemberRoleSchema
});

export const teamIdParamSchema = z.object({
  id: z.string().uuid('Invalid team id')
});

export const organizationIdParamSchema = z.object({
  organizationId: z.string().uuid('Invalid organization id')
});

export const teamMemberUserIdParamSchema = z.object({
  memberUserId: z.string().uuid('Invalid member user id')
});
