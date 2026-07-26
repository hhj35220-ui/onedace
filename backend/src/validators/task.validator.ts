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
  creatorId: z.string().trim().uuid('Invalid creator id').optional(),
  projectId: z.string().trim().uuid('Invalid project id').optional(),
  labelId: z.string().trim().uuid('Invalid label id').optional(),
  dueFrom: isoDateSchema.optional(),
  dueTo: isoDateSchema.optional(),
  createdFrom: isoDateSchema.optional(),
  createdTo: isoDateSchema.optional(),
  completed: z.coerce.boolean().optional(),
  search: z.string().trim().max(100, 'Search is too long').optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'status', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  skip: z.coerce.number().int().min(0).optional()
}).refine((data) => !data.dueFrom || !data.dueTo || new Date(data.dueFrom) <= new Date(data.dueTo), {
  message: 'dueFrom must be on or before dueTo',
  path: ['dueTo']
}).refine((data) => !data.createdFrom || !data.createdTo || new Date(data.createdFrom) <= new Date(data.createdTo), {
  message: 'createdFrom must be on or before createdTo',
  path: ['createdTo']
});

export const taskIdParamSchema = z.object({
  id: z.string().trim().uuid('Invalid task id')
});

export const projectIdParamSchema = z.object({
  projectId: z.string().trim().uuid('Invalid project id')
});

export const taskAnalyticsQuerySchema = z.object({
  groupBy: z.enum(['status', 'priority']).optional().default('status')
});
