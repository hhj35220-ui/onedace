import { z } from 'zod';

const isoDateSchema = z.string().trim().refine((value) => !Number.isNaN(Date.parse(value)), {
  message: 'Invalid date'
});

export const dashboardQuerySchema = z.object({
  organizationId: z.string().trim().uuid('Invalid organization id').optional(),
  projectId: z.string().trim().uuid('Invalid project id').optional(),
  assigneeId: z.string().trim().uuid('Invalid assignee id').optional(),
  startDate: isoDateSchema.optional(),
  endDate: isoDateSchema.optional()
}).refine((data) => !data.startDate || !data.endDate || new Date(data.startDate) <= new Date(data.endDate), {
  message: 'startDate must be on or before endDate',
  path: ['endDate']
});
