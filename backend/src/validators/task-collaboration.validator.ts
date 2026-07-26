import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, 'Comment content is required').max(5000, 'Comment is too long')
});

export const updateCommentSchema = z.object({
  content: z.string().trim().min(1, 'Comment content is required').max(5000, 'Comment is too long').optional()
});

export const taskIdParamSchema = z.object({
  taskId: z.string().trim().uuid('Invalid task id')
});

export const commentIdParamSchema = z.object({
  id: z.string().trim().uuid('Invalid comment id')
});

export const listCommentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});
