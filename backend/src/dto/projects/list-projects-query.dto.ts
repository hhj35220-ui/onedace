export interface ListProjectsQueryDto {
  organizationId?: string;
  teamId?: string;
  status?: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
