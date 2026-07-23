export interface ListUsersQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
