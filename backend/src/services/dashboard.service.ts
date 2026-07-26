import { prisma } from '../config/database';
import { log } from '../config/logger';
import { DashboardQueryDto } from '../dto/dashboard/dashboard-query.dto';
import { AppError } from '../utils/AppError';

export class DashboardService {
  private buildResponse(data: unknown, message: string) {
    return {
      success: true,
      message,
      data
    };
  }

  private buildTaskWhere(query: DashboardQueryDto) {
    const where: Record<string, unknown> = { deletedAt: null };

    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.assigneeId) {
      where.assigneeId = query.assigneeId;
    }
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        (where.createdAt as Record<string, Date>).lte = end;
      }
    }

    return where;
  }

  private buildProjectWhere(query: DashboardQueryDto) {
    const where: Record<string, unknown> = { deletedAt: null };

    if (query.organizationId) {
      where.organizationId = query.organizationId;
    }
    if (query.projectId) {
      where.id = query.projectId;
    }
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        (where.createdAt as Record<string, Date>).lte = end;
      }
    }

    return where;
  }

  private buildTimeWhere(query: DashboardQueryDto) {
    const where: Record<string, unknown> = { deletedAt: null };

    if (query.projectId) {
      where.task = { projectId: query.projectId };
    }
    if (query.assigneeId) {
      where.userId = query.assigneeId;
    }
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        (where.createdAt as Record<string, Date>).lte = end;
      }
    }

    return where;
  }

  async getOverview(userId: string, query: DashboardQueryDto) {
    try {
      const where = this.buildTaskWhere(query);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekEnd = new Date();
      weekEnd.setHours(23, 59, 59, 999);
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);

      const [totalTasks, completedTasks, overdueTasks, activeTasks, completedToday, tasksDueToday, tasksDueThisWeek] = await prisma.$transaction([
        prisma.task.count({ where }),
        prisma.task.count({ where: { ...where, status: 'DONE' } }),
        prisma.task.count({ where: { ...where, status: { not: 'DONE' }, dueDate: { lt: new Date() } } }),
        prisma.task.count({ where: { ...where, status: { not: 'DONE' } } }),
        prisma.task.count({ where: { ...where, status: 'DONE', updatedAt: { gte: today } } }),
        prisma.task.count({ where: { ...where, dueDate: { gte: today, lte: weekEnd } } }),
        prisma.task.count({ where: { ...where, dueDate: { gte: startOfWeek, lte: weekEnd } } })
      ]);

      return this.buildResponse({
        overview: {
          totalTasks,
          completedTasks,
          overdueTasks,
          activeTasks,
          completedToday,
          tasksDueToday,
          tasksDueThisWeek
        },
        taskStats: {},
        projectStats: {},
        productivity: {},
        timeTracking: {}
      }, 'Dashboard overview retrieved successfully');
    } catch (error) {
      log.error('Failed to retrieve dashboard overview', { error, userId, query });
      throw new AppError('An unexpected error occurred while retrieving the dashboard overview', 500);
    }
  }

  async getTaskStats(userId: string, query: DashboardQueryDto) {
    try {
      const where = this.buildTaskWhere(query);

      const [statusBreakdown, priorityBreakdown] = await prisma.$transaction([
        prisma.task.groupBy({
          by: ['status'],
          where,
          orderBy: { status: 'asc' },
          _count: { status: true }
        }),
        prisma.task.groupBy({
          by: ['priority'],
          where,
          orderBy: { priority: 'asc' },
          _count: { priority: true }
        })
      ]);

      const statusData = statusBreakdown as Array<{ status: string; _count: { status: number } | null }>;
      const priorityData = priorityBreakdown as Array<{ priority: string; _count: { priority: number } | null }>;

      return this.buildResponse({
        overview: {},
        taskStats: {
          statusBreakdown: Object.fromEntries(statusData.map((item) => [item.status, item._count?.status ?? 0])),
          priorityBreakdown: Object.fromEntries(priorityData.map((item) => [item.priority, item._count?.priority ?? 0]))
        },
        projectStats: {},
        productivity: {},
        timeTracking: {}
      }, 'Dashboard task stats retrieved successfully');
    } catch (error) {
      log.error('Failed to retrieve dashboard task stats', { error, userId, query });
      throw new AppError('An unexpected error occurred while retrieving the dashboard task stats', 500);
    }
  }

  async getProjectStats(userId: string, query: DashboardQueryDto) {
    try {
      const where = this.buildProjectWhere(query);

      const [totalProjects, activeProjects, completedProjects, archivedProjects] = await prisma.$transaction([
        prisma.project.count({ where }),
        prisma.project.count({ where: { ...where, status: 'ACTIVE' } }),
        prisma.project.count({ where: { ...where, status: 'COMPLETED' } }),
        prisma.project.count({ where: { ...where, status: 'ARCHIVED' } })
      ]);

      return this.buildResponse({
        overview: {},
        taskStats: {},
        projectStats: {
          totalProjects,
          activeProjects,
          completedProjects,
          archivedProjects
        },
        productivity: {},
        timeTracking: {}
      }, 'Dashboard project stats retrieved successfully');
    } catch (error) {
      log.error('Failed to retrieve dashboard project stats', { error, userId, query });
      throw new AppError('An unexpected error occurred while retrieving the dashboard project stats', 500);
    }
  }

  async getTimeStats(userId: string, query: DashboardQueryDto) {
    try {
      const where = this.buildTimeWhere(query);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [totalTrackedMinutes, trackedToday, trackedThisWeek, trackedThisMonth] = await prisma.$transaction([
        prisma.timeEntry.aggregate({ where, _sum: { durationMinutes: true } }),
        prisma.timeEntry.aggregate({ where: { ...where, startTime: { gte: today } } as Record<string, unknown>, _sum: { durationMinutes: true } }),
        prisma.timeEntry.aggregate({ where: { ...where, startTime: { gte: startOfWeek } } as Record<string, unknown>, _sum: { durationMinutes: true } }),
        prisma.timeEntry.aggregate({ where: { ...where, startTime: { gte: startOfMonth } } as Record<string, unknown>, _sum: { durationMinutes: true } })
      ]);

      return this.buildResponse({
        overview: {},
        taskStats: {},
        projectStats: {},
        productivity: {},
        timeTracking: {
          totalTrackedMinutes: totalTrackedMinutes._sum.durationMinutes ?? 0,
          trackedToday: trackedToday._sum.durationMinutes ?? 0,
          trackedThisWeek: trackedThisWeek._sum.durationMinutes ?? 0,
          trackedThisMonth: trackedThisMonth._sum.durationMinutes ?? 0
        }
      }, 'Dashboard time stats retrieved successfully');
    } catch (error) {
      log.error('Failed to retrieve dashboard time stats', { error, userId, query });
      throw new AppError('An unexpected error occurred while retrieving the dashboard time stats', 500);
    }
  }

  async getProductivityStats(userId: string, query: DashboardQueryDto) {
    try {
      const where = this.buildTaskWhere(query);
      const totalTasks = await prisma.task.count({ where });
      const completedTasks = await prisma.task.count({ where: { ...where, status: 'DONE' } });
      const completedThisWeek = await prisma.task.count({ where: { ...where, status: 'DONE', updatedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 6)) } } });
      const completedThisMonth = await prisma.task.count({ where: { ...where, status: 'DONE', updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } });

      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return this.buildResponse({
        overview: {},
        taskStats: {},
        projectStats: {},
        productivity: {
          completionRate: Number(completionRate.toFixed(2)),
          averageCompletionTime: 0,
          averageTaskDuration: 0,
          tasksCompletedThisWeek: completedThisWeek,
          tasksCompletedThisMonth: completedThisMonth
        },
        timeTracking: {}
      }, 'Dashboard productivity stats retrieved successfully');
    } catch (error) {
      log.error('Failed to retrieve dashboard productivity stats', { error, userId, query });
      throw new AppError('An unexpected error occurred while retrieving the dashboard productivity stats', 500);
    }
  }
}
