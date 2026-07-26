export interface ListTasksQueryDto {
  status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assigneeId?: string;
  creatorId?: string;
  projectId?: string;
  labelId?: string;
  dueFrom?: string;
  dueTo?: string;
  createdFrom?: string;
  createdTo?: string;
  completed?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'status' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  skip?: number;
}
