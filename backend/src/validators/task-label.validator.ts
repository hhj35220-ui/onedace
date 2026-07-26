import { z } from 'zod';

export const projectIdParamSchema = z.object({
  projectId: z.string().trim().uuid('Invalid project id')
});

export const taskIdParamSchema = z.object({
  taskId: z.string().trim().uuid('Invalid task id')
});

export const labelIdParamSchema = z.object({
  labelId: z.string().trim().uuid('Invalid label id')
});

export const createLabelSchema = z.object({
  name: z.string().trim().min(1, 'Label name is required').max(30, 'Label name must be at most 30 characters'),
  color: z.string().trim().regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/, 'Color must be a valid hex value')
});

export const updateLabelSchema = z.object({
  name: z.string().trim().min(1, 'Label name is required').max(30, 'Label name must be at most 30 characters').optional(),
  color: z.string().trim().regex(/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/, 'Color must be a valid hex value').optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});
