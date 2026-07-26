import { ProjectPriority, ProjectStatus, TaskPriority, TaskStatus } from '@prisma/client';

import { prisma } from '../config/database';
import { ImportProjectsDto } from '../dto/import/import-projects.dto';
import { ImportTasksDto } from '../dto/import/import-tasks.dto';
import { AppError } from '../utils/AppError';

export class ImportService {

  async importTasks(userId: string, payload: ImportTasksDto) {
    await this.ensureOrganizationAccess(userId, payload.organizationId);

    if (!payload.fileContent) {
      throw new AppError('File content is required', 400);
    }

    const rows = this.parseRows(payload.fileContent, payload.format ?? 'csv');
    const errors: Array<{ row: number; message: string }> = [];
    let importedCount = 0;

    const seen = new Set<string>();

    for (const [index, row] of rows.entries()) {
      const key = `${row.title ?? ''}|${row.description ?? ''}|${row.projectId ?? ''}`;
      if (seen.has(key)) {
        errors.push({ row: index + 2, message: 'Duplicate row skipped' });
        continue;
      }
      seen.add(key);

      if (!row.title) {
        errors.push({ row: index + 2, message: 'Title is required' });
        continue;
      }

      if (payload.dryRun) {
        importedCount += 1;
        continue;
      }

      const project = await prisma.project.findFirst({
        where: { id: row.projectId ?? payload.projectId, deletedAt: null },
      });

      if (!project) {
        errors.push({ row: index + 2, message: 'Project not found' });
        continue;
      }

      await prisma.task.create({
        data: {
          projectId: project.id,
          creatorId: userId,
          name: row.title,
          description: row.description ?? null,
          status: (row.status as TaskStatus | undefined) ?? 'TODO',
          priority: (row.priority as TaskPriority | undefined) ?? 'MEDIUM',
          dueDate: row.dueDate ? new Date(row.dueDate) : null,
        },
      });

      importedCount += 1;
    }

    return {
      success: true,
      message: 'Task import completed',
      importedCount,
      failedRows: errors,
      dryRun: payload.dryRun ?? false,
    };
  }

  async importProjects(userId: string, payload: ImportProjectsDto) {
    await this.ensureOrganizationAccess(userId, payload.organizationId);

    if (!payload.fileContent) {
      throw new AppError('File content is required', 400);
    }

    const rows = this.parseRows(payload.fileContent, payload.format ?? 'csv');
    const errors: Array<{ row: number; message: string }> = [];
    let importedCount = 0;

    const seen = new Set<string>();

    for (const [index, row] of rows.entries()) {
      const key = `${row.name ?? ''}|${row.description ?? ''}`;
      if (seen.has(key)) {
        errors.push({ row: index + 2, message: 'Duplicate row skipped' });
        continue;
      }
      seen.add(key);

      if (!row.name) {
        errors.push({ row: index + 2, message: 'Name is required' });
        continue;
      }

      if (payload.dryRun) {
        importedCount += 1;
        continue;
      }

      await prisma.project.create({
        data: {
          organizationId: payload.organizationId,
          createdBy: userId,
          name: row.name,
          description: row.description ?? null,
          status: (row.status as ProjectStatus | undefined) ?? 'PLANNING',
          priority: (row.priority as ProjectPriority | undefined) ?? 'MEDIUM',
          dueDate: row.dueDate ? new Date(row.dueDate) : null,
        },
      });

      importedCount += 1;
    }

    return {
      success: true,
      message: 'Project import completed',
      importedCount,
      failedRows: errors,
      dryRun: payload.dryRun ?? false,
    };
  }

  async getTasksTemplate(userId: string) {
    await this.ensureAuthenticated(userId);
    return {
      success: true,
      format: 'csv',
      columns: ['title', 'description', 'projectId', 'status', 'priority', 'dueDate'],
    };
  }

  async getProjectsTemplate(userId: string) {
    await this.ensureAuthenticated(userId);
    return {
      success: true,
      format: 'csv',
      columns: ['name', 'description', 'status', 'priority', 'dueDate'],
    };
  }

  private parseRows(content: string, format: 'csv' | 'xlsx') {
    if (format === 'xlsx') {
      return this.parseXlsxLike(content);
    }
    return this.parseCsv(content);
  }

  private parseCsv(content: string) {
    const lines = content.trim().split(/\r?\n/);
    if (!lines.length) return [];

    const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
    const rows = lines.slice(1).filter(Boolean).map((line) => {
      const values = line.split(',');
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = values[index]?.trim() ?? '';
      });
      return record;
    });

    return rows;
  }

  private parseXlsxLike(content: string) {
    return this.parseCsv(content);
  }

  private async ensureOrganizationAccess(userId: string, organizationId?: string) {
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }

    const actor = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isPrivileged = actor?.role === 'OWNER' || actor?.role === 'ADMIN' || actor?.role === 'SUPER_ADMIN';
    if (!isPrivileged) {
      throw new AppError('Forbidden', 403);
    }

    const organization = await prisma.organization.findFirst({
      where: { id: organizationId, deletedAt: null },
      select: { id: true },
    });

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }
  }

  private async ensureAuthenticated(userId: string) {
    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!actor) {
      throw new AppError('Authentication required', 401);
    }
  }
}
