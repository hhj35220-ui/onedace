export interface UpdateRecurringTaskDto {
  interval?: number;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextRunAt?: string | Date;
  isActive?: boolean;
  endDate?: string | Date | null;
}
