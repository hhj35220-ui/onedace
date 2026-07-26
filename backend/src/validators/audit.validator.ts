import { z } from 'zod';

export const listAuditQuerySchema = z.object({
  organizationId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  entityType: z.enum(['TASK','PROJECT','COMMENT','ATTACHMENT','LABEL','CHECKLIST','TIME_ENTRY','DEPENDENCY','NOTIFICATION','CALENDAR','TEAM','USER']).optional(),
  action: z.enum(['CREATE','UPDATE','DELETE','RESTORE','ASSIGN','UNASSIGN','LOGIN','LOGOUT','EXPORT','IMPORT']).optional(),
  startDate: z.string().datetime().or(z.date()).optional(),
  endDate: z.string().datetime().or(z.date()).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const auditIdParamSchema = z.object({
  id: z.string().min(1),
});

export const entityAuditParamSchema = z.object({
  entityType: z.enum(['TASK','PROJECT','COMMENT','ATTACHMENT','LABEL','CHECKLIST','TIME_ENTRY','DEPENDENCY','NOTIFICATION','CALENDAR','TEAM','USER']),
  entityId: z.string().min(1),
});
