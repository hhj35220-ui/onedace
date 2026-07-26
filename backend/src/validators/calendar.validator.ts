import { z } from 'zod';

export const connectCalendarSchema = z.object({
  provider: z.enum(['GOOGLE', 'OUTLOOK', 'ICS']),
  externalCalendarId: z.string().min(1).optional(),
  accessToken: z.string().min(1).optional(),
  refreshToken: z.string().min(1).optional(),
  tokenExpiresAt: z.string().datetime().or(z.date()).optional(),
  syncEnabled: z.boolean().optional(),
});

export const syncCalendarSchema = z.object({
  taskId: z.string().min(1).optional(),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE']).optional(),
});
