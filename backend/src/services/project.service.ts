import { prisma } from '../config/database';
import { log } from '../config/logger';
import { CreateProjectDto } from '../dto/projects/create-project.dto';
import { ListProjectsQueryDto } from '../dto/projects/list-projects-query.dto';
import { UpdateProjectDto } from '../dto/projects/update-project.dto';
import { AppError } from '../utils/AppError';

export class ProjectService {
  private buildResponse(project: Record<string, unknown>) {
    return {
      success: true,
      message: 'Project processed successfully',
      data: project
    };
  }

  private async ensureOrganizationMembership(userId: string, organizationId: string): Promise<void> {
    const organization = await prisma.organization.findFirst({
      where: { id: organizationId, deletedAt: null },
      select: { id: true, ownerId: true }
    });

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isOrgAdmin = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

    if (organization.ownerId === userId || isOrgAdmin) {
      return;
    }

    const membership = await prisma.teamMember.findFirst({
      where: {
        userId,
        deletedAt: null,
        team: {
          organizationId,
          deletedAt: null
        }
      },
      select: { id: true }
    });

    if (!membership) {
      throw new AppError('Forbidden', 403);
    }
  }

  private async ensureProjectAccess(userId: string, projectId: string, allowCreator = false): Promise<{ organizationId: string }> {
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
      select: { id: true, organizationId: true, createdBy: true }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isOwnerOrAdmin = actor?.role === 'OWNER' || actor?.role === 'ADMIN' || actor?.role === 'SUPER_ADMIN';

    if (allowCreator && project.createdBy === userId) {
      return { organizationId: project.organizationId };
    }

    if (isOwnerOrAdmin) {
      return { organizationId: project.organizationId };
    }

    const organization = await prisma.organization.findFirst({
      where: { id: project.organizationId, deletedAt: null },
      select: { ownerId: true }
    });

    if (organization?.ownerId === userId) {
      return { organizationId: project.organizationId };
    }

    throw new AppError('Forbidden', 403);
  }

  private async validateTeamBelongsToOrganization(teamId: string | null | undefined, organizationId: string): Promise<void> {
    if (!teamId) {
      return;
    }

    const team = await prisma.team.findFirst({
      where: { id: teamId, organizationId, deletedAt: null },
      select: { id: true }
    });

    if (!team) {
      throw new AppError('Team not found in organization', 404);
    }
  }

  async createProject(userId: string, payload: CreateProjectDto) {
    try {
      await this.ensureOrganizationMembership(userId, payload.organizationId);
      await this.validateTeamBelongsToOrganization(payload.teamId, payload.organizationId);

      const project = await prisma.project.create({
        data: {
          organizationId: payload.organizationId,
          teamId: payload.teamId ?? null,
          name: payload.name.trim(),
          description: payload.description?.trim() ?? null,
          status: payload.status ?? 'PLANNING',
          priority: payload.priority ?? 'MEDIUM',
          startDate: payload.startDate ? new Date(payload.startDate) : null,
          dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
          createdBy: userId
        }
      });

      log.info('Project created', { projectId: project.id, organizationId: payload.organizationId, userId });
      return this.buildResponse(project);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create project', { error, userId });
      throw new AppError('An unexpected error occurred while creating the project', 500);
    }
  }

  async getProjects(userId: string, query: ListProjectsQueryDto) {
    try {
      const organizationId = query.organizationId;
      if (organizationId) {
        await this.ensureOrganizationMembership(userId, organizationId);
      }

      const where: Record<string, unknown> = {
        deletedAt: null
      };

      if (organizationId) {
        where.organizationId = organizationId;
      }
      if (query.teamId) {
        where.teamId = query.teamId;
      }
      if (query.status) {
        where.status = query.status;
      }
      if (query.priority) {
        where.priority = query.priority;
      }

      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } }
        ];
      }

      const sortBy = query.sortBy ?? 'createdAt';
      const sortOrder = query.sortOrder ?? 'desc';
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const skip = (page - 1) * limit;

      const [projects, total] = await prisma.$transaction([
        prisma.project.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip,
          take: limit,
          include: {
            organization: { select: { id: true, name: true } },
            team: { select: { id: true, name: true } },
            creator: { select: { id: true, firstName: true, lastName: true, email: true } }
          }
        }),
        prisma.project.count({ where })
      ]);

      return {
        success: true,
        message: 'Projects retrieved successfully',
        data: {
          projects,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve projects', { error, userId });
      throw new AppError('An unexpected error occurred while retrieving the projects', 500);
    }
  }

  async getProjectById(userId: string, projectId: string) {
    try {
      await this.ensureProjectAccess(userId, projectId);

      const project = await prisma.project.findFirst({
        where: { id: projectId, deletedAt: null },
        include: {
          organization: { select: { id: true, name: true } },
          team: { select: { id: true, name: true } },
          creator: { select: { id: true, firstName: true, lastName: true, email: true } }
        }
      });

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      return this.buildResponse(project);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve project', { error, userId, projectId });
      throw new AppError('An unexpected error occurred while retrieving the project', 500);
    }
  }

  async updateProject(userId: string, projectId: string, payload: UpdateProjectDto) {
    try {
      await this.ensureProjectAccess(userId, projectId, true);

      const project = await prisma.project.findFirst({
        where: { id: projectId, deletedAt: null },
        select: { id: true, organizationId: true, teamId: true }
      });

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      if (payload.teamId !== undefined) {
        await this.validateTeamBelongsToOrganization(payload.teamId, project.organizationId);
      }

      const updateData: Record<string, unknown> = {};
      if (payload.teamId !== undefined) {
        updateData.teamId = payload.teamId ?? null;
      }
      if (payload.name !== undefined) {
        updateData.name = payload.name.trim();
      }
      if (payload.description !== undefined) {
        updateData.description = payload.description?.trim() ?? null;
      }
      if (payload.status !== undefined) {
        updateData.status = payload.status;
      }
      if (payload.priority !== undefined) {
        updateData.priority = payload.priority;
      }
      if (payload.startDate !== undefined) {
        updateData.startDate = payload.startDate ? new Date(payload.startDate) : null;
      }
      if (payload.dueDate !== undefined) {
        updateData.dueDate = payload.dueDate ? new Date(payload.dueDate) : null;
      }

      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: updateData
      });

      log.info('Project updated', { projectId, userId });
      return this.buildResponse(updatedProject);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update project', { error, userId, projectId });
      throw new AppError('An unexpected error occurred while updating the project', 500);
    }
  }

  async deleteProject(userId: string, projectId: string) {
    try {
      await this.ensureProjectAccess(userId, projectId, false);

      await prisma.project.update({
        where: { id: projectId },
        data: { deletedAt: new Date(), completedAt: new Date() }
      });

      log.info('Project archived', { projectId, userId });
      return {
        success: true,
        message: 'Project archived successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to archive project', { error, userId, projectId });
      throw new AppError('An unexpected error occurred while archiving the project', 500);
    }
  }
}
