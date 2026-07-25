export interface UpdateTaskDto {
  name?: string;
  description?: string | null;
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: string | null;
  assigneeId?: string | null;
}
