import { z } from 'zod';

export const createRecurringTaskSchema = z.object({
  interval: z.number().int().positive(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  nextRunAt: z.string().datetime().or(z.date()),
  isActive: z.boolean().optional(),
  endDate: z.string().datetime().or(z.date()).nullable().optional(),
});

export const updateRecurringTaskSchema = z.object({
  interval: z.number().int().positive().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  nextRunAt: z.string().datetime().or(z.date()).optional(),
  isActive: z.boolean().optional(),
  endDate: z.string().datetime().or(z.date()).nullable().optional(),
}).partial();

export const taskIdParamSchema = z.object({
  taskId: z.string().min(1),
});

export const recurringIdParamSchema = z.object({
  id: z.string().min(1),
});
