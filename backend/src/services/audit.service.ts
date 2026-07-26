import { Prisma } from '@prisma/client';

import { prisma } from '../config/database';
import { ListAuditDto } from '../dto/audit/list-audit.dto';
import { AppError } from '../utils/AppError';

export class AuditService {
  private readonly supportedEntityTypes = [
    'TASK',
    'PROJECT',
    'COMMENT',
    'ATTACHMENT',
    'LABEL',
    'CHECKLIST',
    'TIME_ENTRY',
    'DEPENDENCY',
    'NOTIFICATION',
    'CALENDAR',
    'TEAM',
    'USER',
  ] as const;

  private readonly supportedActions = [
    'CREATE',
    'UPDATE',
    'DELETE',
    'RESTORE',
    'ASSIGN',
    'UNASSIGN',
    'LOGIN',
    'LOGOUT',
    'EXPORT',
    'IMPORT',
  ] as const;

  async listAuditLogs(userId: string, query: ListAuditDto) {
    await this.ensureAdminAccess(userId, query.organizationId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (query.organizationId) where.organizationId = query.organizationId;
    if (query.userId) where.userId = query.userId;
    if (query.entityType) where.entityType = query.entityType;
    if (query.action) where.action = query.action;

    if (query.startDate || query.endDate) {
      where.createdAt = {} as Record<string, Date>;
      if (query.startDate) (where.createdAt as Record<string, Date>).gte = new Date(query.startDate);
      if (query.endDate) (where.createdAt as Record<string, Date>).lte = new Date(query.endDate);
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: query.sortOrder === 'asc' ? 'asc' : 'desc' },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          organization: { select: { id: true, name: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAuditLogById(userId: string, id: string) {
    const auditLog = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        organization: { select: { id: true, name: true } },
      },
    });

    if (!auditLog) {
      throw new AppError('Audit log not found', 404);
    }

    await this.ensureAdminAccess(userId, auditLog.organizationId);

    return { success: true, data: auditLog };
  }

  async getAuditLogsByEntity(userId: string, entityType: string, entityId: string) {
    if (!this.supportedEntityTypes.includes(entityType as (typeof this.supportedEntityTypes)[number])) {
      throw new AppError('Unsupported entity type', 400);
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        organization: { select: { id: true, name: true } },
      },
    });

    if (!auditLogs.length) {
      return { success: true, data: [] };
    }

    await this.ensureAdminAccess(userId, auditLogs[0].organizationId);

    return { success: true, data: auditLogs };
  }

  async logAction(input: {
    organizationId: string;
    userId: string;
    entityType: string;
    entityId: string;
    action: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string | null;
    userAgent?: string | null;
  }) {
    if (!this.supportedEntityTypes.includes(input.entityType as (typeof this.supportedEntityTypes)[number])) {
      throw new AppError('Unsupported entity type', 400);
    }

    if (!this.supportedActions.includes(input.action as (typeof this.supportedActions)[number])) {
      throw new AppError('Unsupported action', 400);
    }

    const log = await prisma.auditLog.create({
      data: {
        organizationId: input.organizationId,
        userId: input.userId,
        entityType: input.entityType,
        entityId: input.entityId,
        action: input.action,
        metadata: input.metadata ? (input.metadata as Prisma.InputJsonValue) : undefined,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
    });

    return log;
  }

  async logTask(input: { organizationId: string; userId: string; entityId: string; action: string; metadata?: Record<string, unknown>; ipAddress?: string | null; userAgent?: string | null }) {
    return this.logAction({
      organizationId: input.organizationId,
      userId: input.userId,
      entityType: 'TASK',
      entityId: input.entityId,
      action: input.action,
      metadata: input.metadata,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  async logProject(input: { organizationId: string; userId: string; entityId: string; action: string; metadata?: Record<string, unknown>; ipAddress?: string | null; userAgent?: string | null }) {
    return this.logAction({
      organizationId: input.organizationId,
      userId: input.userId,
      entityType: 'PROJECT',
      entityId: input.entityId,
      action: input.action,
      metadata: input.metadata,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  async logComment(input: { organizationId: string; userId: string; entityId: string; action: string; metadata?: Record<string, unknown>; ipAddress?: string | null; userAgent?: string | null }) {
    return this.logAction({
      organizationId: input.organizationId,
      userId: input.userId,
      entityType: 'COMMENT',
      entityId: input.entityId,
      action: input.action,
      metadata: input.metadata,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  async logCalendar(input: { organizationId: string; userId: string; entityId: string; action: string; metadata?: Record<string, unknown>; ipAddress?: string | null; userAgent?: string | null }) {
    return this.logAction({
      organizationId: input.organizationId,
      userId: input.userId,
      entityType: 'CALENDAR',
      entityId: input.entityId,
      action: input.action,
      metadata: input.metadata,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  async logNotification(input: { organizationId: string; userId: string; entityId: string; action: string; metadata?: Record<string, unknown>; ipAddress?: string | null; userAgent?: string | null }) {
    return this.logAction({
      organizationId: input.organizationId,
      userId: input.userId,
      entityType: 'NOTIFICATION',
      entityId: input.entityId,
      action: input.action,
      metadata: input.metadata,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
  }

  private async ensureAdminAccess(userId: string, organizationId?: string) {
    const actor = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    const isPrivileged = actor?.role === 'OWNER' || actor?.role === 'ADMIN' || actor?.role === 'SUPER_ADMIN';
    if (!isPrivileged) {
      throw new AppError('Forbidden', 403);
    }

    if (organizationId) {
      const membership = await prisma.organization.findFirst({
        where: { id: organizationId, deletedAt: null },
        select: { id: true },
      });

      if (!membership) {
        throw new AppError('Organization not found', 404);
      }
    }
  }
}
