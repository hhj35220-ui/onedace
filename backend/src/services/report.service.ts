import { prisma } from '../config/database';
import { ExportReportDto } from '../dto/report/export-report.dto';
import { AppError } from '../utils/AppError';

export class ReportService {
  async getTasksReport(userId: string, query: { projectId?: string; startDate?: string | Date; endDate?: string | Date }) {
    const where = this.buildTaskWhere(userId, query.projectId, query.startDate, query.endDate);

    const tasks = await prisma.task.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
        project: { select: { id: true, name: true } },
        creator: { select: { id: true, firstName: true, lastName: true } },
        assignee: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Tasks report retrieved successfully',
      data: tasks,
      reportType: 'tasks',
    };
  }

  async getProjectsReport(userId: string, query: { projectId?: string; startDate?: string | Date; endDate?: string | Date }) {
    const where = this.buildProjectWhere(userId, query.projectId, query.startDate, query.endDate);

    const projects = await prisma.project.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        priority: true,
        startDate: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
        creator: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Projects report retrieved successfully',
      data: projects,
      reportType: 'projects',
    };
  }

  async getTimeReport(userId: string, query: { projectId?: string; startDate?: string | Date; endDate?: string | Date }) {
    const where = this.buildTimeWhere(userId, query.projectId, query.startDate, query.endDate);

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      select: {
        id: true,
        description: true,
        durationMinutes: true,
        startTime: true,
        endTime: true,
        createdAt: true,
        task: { select: { id: true, name: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Time report retrieved successfully',
      data: timeEntries,
      reportType: 'time',
    };
  }

  async getProductivityReport(userId: string, query: { projectId?: string; startDate?: string | Date; endDate?: string | Date }) {
    const where = this.buildTaskWhere(userId, query.projectId, query.startDate, query.endDate);

    const tasks = await prisma.task.findMany({
      where,
      select: {
        id: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const completed = tasks.filter((task: { status: string }) => task.status === 'DONE').length;
    const pending = tasks.length - completed;

    return {
      success: true,
      message: 'Productivity report retrieved successfully',
      data: {
        totalTasks: tasks.length,
        completedTasks: completed,
        pendingTasks: pending,
        completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
      },
      reportType: 'productivity',
    };
  }

  async exportReport(userId: string, payload: ExportReportDto) {
    const reportType = payload.reportType;
    const query = {
      projectId: payload.projectId,
      startDate: payload.startDate,
      endDate: payload.endDate,
    };

    let data: unknown;
    switch (reportType) {
      case 'tasks':
        data = await this.getTasksReport(userId, query);
        break;
      case 'projects':
        data = await this.getProjectsReport(userId, query);
        break;
      case 'time':
        data = await this.getTimeReport(userId, query);
        break;
      case 'productivity':
        data = await this.getProductivityReport(userId, query);
        break;
      default:
        throw new AppError('Unsupported report type', 400);
    }

    const format = payload.format ?? 'csv';
    const exportData = this.prepareExportData(data);

    return {
      success: true,
      message: 'Report export prepared successfully',
      reportType,
      format,
      data: exportData,
      downloadHint: this.buildDownloadHint(format),
      fileName: `${reportType}.${format}`,
    };
  }

  private buildTaskWhere(userId: string, projectId?: string, startDate?: string | Date, endDate?: string | Date) {
    const where: Record<string, unknown> = {
      deletedAt: null,
      OR: [{ creatorId: userId }, { assigneeId: userId }],
    };

    if (projectId) where.projectId = projectId;
    if (startDate || endDate) {
      where.createdAt = {} as Record<string, Date>;
      if (startDate) (where.createdAt as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.createdAt as Record<string, Date>).lte = new Date(endDate);
    }

    return where;
  }

  private buildProjectWhere(userId: string, projectId?: string, startDate?: string | Date, endDate?: string | Date) {
    const where: Record<string, unknown> = {
      deletedAt: null,
      createdBy: userId,
    };

    if (projectId) where.id = projectId;
    if (startDate || endDate) {
      where.createdAt = {} as Record<string, Date>;
      if (startDate) (where.createdAt as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.createdAt as Record<string, Date>).lte = new Date(endDate);
    }

    return where;
  }

  private buildTimeWhere(userId: string, projectId?: string, startDate?: string | Date, endDate?: string | Date) {
    const where: Record<string, unknown> = {
      userId,
    };

    if (projectId) where.task = { projectId };
    if (startDate || endDate) {
      where.startTime = {} as Record<string, Date>;
      if (startDate) (where.startTime as Record<string, Date>).gte = new Date(startDate);
      if (endDate) (where.startTime as Record<string, Date>).lte = new Date(endDate);
    }

    return where;
  }

  private prepareExportData(data: unknown) {
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: unknown }).data;
    }
    return data;
  }

  private buildDownloadHint(format: string) {
    switch (format) {
      case 'xlsx':
        return 'XLSX export is prepared as workbook-compatible JSON data';
      case 'pdf':
        return 'PDF export is prepared as structured report payload';
      default:
        return 'CSV export is prepared as downloadable report content';
    }
  }
}
