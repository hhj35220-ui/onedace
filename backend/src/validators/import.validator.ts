import { z } from 'zod';

export const importTasksSchema = z.object({
  organizationId: z.string().min(1),
  projectId: z.string().min(1).optional(),
  fileContent: z.string().min(1),
  format: z.enum(['csv', 'xlsx']).optional(),
  dryRun: z.boolean().optional(),
});

export const importProjectsSchema = z.object({
  organizationId: z.string().min(1),
  fileContent: z.string().min(1),
  format: z.enum(['csv', 'xlsx']).optional(),
  dryRun: z.boolean().optional(),
});
