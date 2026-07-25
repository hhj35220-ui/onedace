import { z } from 'zod';

const taskStatusSchema = z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED']);
const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
const isoDateSchema = z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Invalid date'
});

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, 'Task name is required').max(100, 'Task name is too long'),
  description: z.string().trim().max(2000, 'Description is too long').nullable().optional(),
  status: taskStatusSchema.optional().default('TODO'),
  priority: taskPrioritySchema.optional().default('MEDIUM'),
  dueDate: isoDateSchema.nullable().optional(),
  assigneeId: z.string().trim().uuid('Invalid assignee id').nullable().optional()
});

export const updateTaskSchema = z.object({
  name: z.string().trim().min(1, 'Task name is required').max(100, 'Task name is too long').optional(),
  description: z.string().trim().max(2000, 'Description is too long').nullable().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: isoDateSchema.nullable().optional(),
  assigneeId: z.string().trim().uuid('Invalid assignee id').nullable().optional()
});

export const listTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().trim().uuid('Invalid assignee id').optional(),
  search: z.string().trim().max(100, 'Search is too long').optional(),
  sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});

export const taskIdParamSchema = z.object({
  id: z.string().trim().uuid('Invalid task id')
});

export const projectIdParamSchema = z.object({
  projectId: z.string().trim().uuid('Invalid project id')
});
