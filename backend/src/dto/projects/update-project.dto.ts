export interface UpdateProjectDto {
  teamId?: string | null;
  name?: string;
  description?: string | null;
  status?: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  startDate?: string | null;
  dueDate?: string | null;
}
