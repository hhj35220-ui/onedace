export interface CalendarSyncDto {
  taskId?: string;
  action?: 'CREATE' | 'UPDATE' | 'DELETE';
}
