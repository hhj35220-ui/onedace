import { z } from 'zod';

const projectStatusSchema = z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']);
const projectPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
const isoDateSchema = z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Invalid date'
});

export const createProjectSchema = z.object({
  organizationId: z.string().trim().uuid('Invalid organization id'),
  teamId: z.string().trim().uuid('Invalid team id').nullable().optional(),
  name: z.string().trim().min(1, 'Project name is required').max(100, 'Project name is too long'),
  description: z.string().trim().max(1000, 'Description is too long').nullable().optional(),
  status: projectStatusSchema.optional().default('PLANNING'),
  priority: projectPrioritySchema.optional().default('MEDIUM'),
  startDate: isoDateSchema.nullable().optional(),
  dueDate: isoDateSchema.nullable().optional()
});

export const updateProjectSchema = z.object({
  teamId: z.string().trim().uuid('Invalid team id').nullable().optional(),
  name: z.string().trim().min(1, 'Project name is required').max(100, 'Project name is too long').optional(),
  description: z.string().trim().max(1000, 'Description is too long').nullable().optional(),
  status: projectStatusSchema.optional(),
  priority: projectPrioritySchema.optional(),
  startDate: isoDateSchema.nullable().optional(),
  dueDate: isoDateSchema.nullable().optional()
});

export const listProjectsQuerySchema = z.object({
  organizationId: z.string().trim().uuid('Invalid organization id').optional(),
  teamId: z.string().trim().uuid('Invalid team id').optional(),
  status: projectStatusSchema.optional(),
  priority: projectPrioritySchema.optional(),
  search: z.string().trim().max(100, 'Search is too long').optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});

export const projectIdParamSchema = z.object({
  id: z.string().trim().uuid('Invalid project id')
});
