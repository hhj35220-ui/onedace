export interface ExportReportDto {
  reportType: 'tasks' | 'projects' | 'time' | 'productivity';
  projectId?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  format?: 'csv' | 'xlsx' | 'pdf';
}
