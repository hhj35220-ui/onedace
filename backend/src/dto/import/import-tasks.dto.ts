export interface ImportTasksDto {
  organizationId: string;
  projectId?: string;
  fileContent: string;
  format?: 'csv' | 'xlsx';
  dryRun?: boolean;
}
