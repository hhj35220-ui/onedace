import { z } from 'zod';

const dateFilterSchema = z.union([z.string().date(), z.string().datetime(), z.date()]);

export const reportQuerySchema = z.object({
  projectId: z.string().min(1).optional(),
  startDate: dateFilterSchema.optional(),
  endDate: dateFilterSchema.optional(),
});

export const exportReportSchema = z.object({
  reportType: z.enum(['tasks', 'projects', 'time', 'productivity']),
  projectId: z.string().min(1).optional(),
  startDate: dateFilterSchema.optional(),
  endDate: dateFilterSchema.optional(),
  format: z.enum(['csv', 'xlsx', 'pdf']).optional(),
});
