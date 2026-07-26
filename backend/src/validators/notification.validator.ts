import { z } from 'zod';

export const notificationIdParamSchema = z.object({
  id: z.string().trim().uuid('Invalid notification id')
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});
