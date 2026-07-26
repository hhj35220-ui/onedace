export interface ImportProjectsDto {
  organizationId: string;
  fileContent: string;
  format?: 'csv' | 'xlsx';
  dryRun?: boolean;
}
