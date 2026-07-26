export interface ListAuditDto {
  organizationId?: string;
  userId?: string;
  entityType?: 'TASK' | 'PROJECT' | 'COMMENT' | 'ATTACHMENT' | 'LABEL' | 'CHECKLIST' | 'TIME_ENTRY' | 'DEPENDENCY' | 'NOTIFICATION' | 'CALENDAR' | 'TEAM' | 'USER';
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'ASSIGN' | 'UNASSIGN' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'IMPORT';
  startDate?: string | Date;
  endDate?: string | Date;
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
}
