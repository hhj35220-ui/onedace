import { z } from 'zod';

export const taskIdParamSchema = z.object({
  taskId: z.string().trim().uuid('Invalid task id')
});

export const entryIdParamSchema = z.object({
  entryId: z.string().trim().uuid('Invalid time entry id')
});

export const createTimeEntrySchema = z.object({
  description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
  startTime: z.string().datetime().optional(),
  durationMinutes: z.number().int().min(0).optional()
});

export const updateTimeEntrySchema = z.object({
  description: z.string().trim().max(500, 'Description must be at most 500 characters').optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().nullable().optional(),
  durationMinutes: z.number().int().min(0).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});
