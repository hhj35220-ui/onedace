import { z } from 'zod';

export const taskIdParamSchema = z.object({
  taskId: z.string().trim().uuid('Invalid task id')
});

export const dependencyIdParamSchema = z.object({
  dependencyId: z.string().trim().uuid('Invalid dependency id')
});

export const createDependencySchema = z.object({
  dependsOnTaskId: z.string().trim().uuid('Invalid dependency task id')
});
