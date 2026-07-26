import { z } from 'zod';

export const reportQuerySchema = z.object({
  projectId: z.string().min(1).optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
});

export const exportReportSchema = z.object({
  reportType: z.enum(['tasks', 'projects', 'time', 'productivity']),
  projectId: z.string().min(1).optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
  format: z.enum(['csv', 'xlsx', 'pdf']).optional(),
});
