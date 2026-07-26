import { z } from 'zod';

export const taskIdParamSchema = z.object({
  taskId: z.string().trim().uuid('Invalid task id')
});

export const attachmentIdParamSchema = z.object({
  attachmentId: z.string().trim().uuid('Invalid attachment id')
});

export const listAttachmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});

export const createAttachmentSchema = z.object({
  file: z.any().optional()
});
