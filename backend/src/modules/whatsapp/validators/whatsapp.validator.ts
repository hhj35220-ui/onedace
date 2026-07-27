import { z } from 'zod';

export const connectWhatsAppSchema = z.object({
  organizationId: z.string().trim().uuid('Organization id must be a valid UUID'),
  sessionKey: z.string().trim().min(1).max(255).optional(),
});

export const reconnectWhatsAppSchema = z.object({
  organizationId: z.string().trim().uuid('Organization id must be a valid UUID'),
  sessionKey: z.string().trim().min(1).max(255).optional(),
});

export const sendWhatsAppMessageSchema = z.object({
  organizationId: z.string().trim().uuid('Organization id must be a valid UUID'),
  sessionKey: z.string().trim().min(1).max(255).optional(),
  recipient: z.string().trim().min(1).max(255),
  content: z.string().trim().min(1).max(5000),
  messageType: z.enum(['text', 'image', 'document']).optional().default('text'),
});
