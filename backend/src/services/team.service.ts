import { prisma } from '../config/database';
import { log } from '../config/logger';
import { CreateTeamDto } from '../dto/teams/create-team.dto';
import { UpdateTeamDto } from '../dto/teams/update-team.dto';
import { CreateTeamMemberDto, UpdateTeamMemberDto } from '../dto/teams/team-member.dto';
import { AppError } from '../utils/AppError';

export class TeamService {
  private buildResponse(team: Record<string, unknown>) {
    return {
      success: true,
      message: 'Team processed successfully',
      data: team
    };
  }

  private async ensureOrganizationAccess(userId: string, organizationId: string, allowOwner = true): Promise<void> {
    const organization = await prisma.organization.findFirst({
      where: { id: organizationId, deletedAt: null },
      select: { id: true, ownerId: true }
    });

    if (!organization) {
      throw new AppError('Organization not found', 404);
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isOrganizationAdmin = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

    if (allowOwner && isOrganizationAdmin) {
      return;
    }

    if (!allowOwner && isOrganizationAdmin) {
      return;
    }

    if (organization.ownerId === userId) {
      return;
    }

    throw new AppError('Forbidden', 403);
  }

  private async ensureTeamAccess(userId: string, teamId: string, allowOwner = true): Promise<{ organizationId: string }> {
    const team = await prisma.team.findFirst({
      where: { id: teamId, deletedAt: null },
      select: { id: true, organizationId: true }
    });

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    await this.ensureOrganizationAccess(userId, team.organizationId, allowOwner);

    return { organizationId: team.organizationId };
  }

  async create(userId: string, organizationId: string, payload: CreateTeamDto) {
    try {
      await this.ensureOrganizationAccess(userId, organizationId, true);

      const team = await prisma.team.create({
        data: {
          organizationId,
          name: payload.name.trim(),
          description: payload.description?.trim() ?? null,
          color: payload.color?.trim() ?? null
        }
      });

      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId,
          role: 'ADMIN'
        }
      });

      log.info('Team created', { teamId: team.id, organizationId, userId });
      return this.buildResponse(team);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create team', { error, organizationId, userId });
      throw new AppError('An unexpected error occurred while creating the team', 500);
    }
  }

  async listByOrganization(organizationId: string) {
    try {
      const organization = await prisma.organization.findFirst({
        where: { id: organizationId, deletedAt: null },
        select: { id: true }
      });

      if (!organization) {
        throw new AppError('Organization not found', 404);
      }

      const teams = await prisma.team.findMany({
        where: { organizationId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: {
          teamMembers: {
            where: { deletedAt: null },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                  role: true
                }
              }
            }
          }
        }
      });

      return {
        success: true,
        message: 'Teams retrieved successfully',
        data: teams
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve teams', { error, organizationId });
      throw new AppError('An unexpected error occurred while retrieving the teams', 500);
    }
  }

  async getById(teamId: string) {
    try {
      const team = await prisma.team.findFirst({
        where: { id: teamId, deletedAt: null },
        include: {
          teamMembers: {
            where: { deletedAt: null },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                  role: true
                }
              }
            }
          }
        }
      });

      if (!team) {
        throw new AppError('Team not found', 404);
      }

      return this.buildResponse(team);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve team', { error, teamId });
      throw new AppError('An unexpected error occurred while retrieving the team', 500);
    }
  }

  async update(userId: string, teamId: string, payload: UpdateTeamDto) {
    try {
      const team = await prisma.team.findFirst({
        where: { id: teamId, deletedAt: null },
        select: { id: true, organizationId: true }
      });

      if (!team) {
        throw new AppError('Team not found', 404);
      }

      const organization = await prisma.organization.findFirst({
        where: { id: team.organizationId, deletedAt: null },
        select: { ownerId: true }
      });

      if (!organization) {
        throw new AppError('Organization not found', 404);
      }

      const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      const isAuthorized = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

      if (!isAuthorized && organization.ownerId !== userId) {
        throw new AppError('Forbidden', 403);
      }

      const updateData: Record<string, string | null> = {};

      if (payload.name !== undefined) {
        updateData.name = payload.name.trim();
      }
      if (payload.description !== undefined) {
        updateData.description = payload.description?.trim() ?? null;
      }
      if (payload.color !== undefined) {
        updateData.color = payload.color?.trim() ?? null;
      }

      const updatedTeam = await prisma.team.update({
        where: { id: teamId },
        data: updateData
      });

      log.info('Team updated', { teamId, userId });
      return this.buildResponse(updatedTeam);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update team', { error, teamId, userId });
      throw new AppError('An unexpected error occurred while updating the team', 500);
    }
  }

  async remove(userId: string, teamId: string) {
    try {
      await this.ensureTeamAccess(userId, teamId, true);

      await prisma.team.update({
        where: { id: teamId },
        data: { deletedAt: new Date() }
      });

      log.info('Team deleted', { teamId, userId });
      return {
        success: true,
        message: 'Team deleted successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete team', { error, teamId, userId });
      throw new AppError('An unexpected error occurred while deleting the team', 500);
    }
  }

  async addMember(userId: string, teamId: string, payload: CreateTeamMemberDto) {
    try {
      await this.ensureTeamAccess(userId, teamId, true);

      const targetUser = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } });
      if (!targetUser) {
        throw new AppError('User not found', 404);
      }

      const existingMember = await prisma.teamMember.findFirst({
        where: { teamId, userId: payload.userId, deletedAt: null },
        select: { id: true }
      });

      if (existingMember) {
        throw new AppError('User is already a member of this team', 409);
      }

      const actorMember = await prisma.teamMember.findFirst({
        where: { teamId, userId, deletedAt: null },
        select: { role: true }
      });

      const actorIsAdmin = actorMember?.role === 'ADMIN';
      const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      const actorIsOrgAdmin = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

      if (!actorIsAdmin && !actorIsOrgAdmin) {
        throw new AppError('Forbidden', 403);
      }

      const member = await prisma.teamMember.create({
        data: {
          teamId,
          userId: payload.userId,
          role: payload.role ?? 'MEMBER'
        }
      });

      log.info('Team member added', { teamId, memberId: member.id, userId });
      return this.buildResponse(member);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to add team member', { error, teamId, userId });
      throw new AppError('An unexpected error occurred while adding the team member', 500);
    }
  }

  async updateMember(userId: string, teamId: string, memberUserId: string, payload: UpdateTeamMemberDto) {
    try {
      await this.ensureTeamAccess(userId, teamId, true);

      const actorMember = await prisma.teamMember.findFirst({
        where: { teamId, userId, deletedAt: null },
        select: { role: true }
      });

      const actorIsAdmin = actorMember?.role === 'ADMIN';
      const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      const actorIsOrgAdmin = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

      if (!actorIsAdmin && !actorIsOrgAdmin) {
        throw new AppError('Forbidden', 403);
      }

      const member = await prisma.teamMember.findFirst({
        where: { teamId, userId: memberUserId, deletedAt: null },
        select: { id: true, role: true }
      });

      if (!member) {
        throw new AppError('Team member not found', 404);
      }

      const updatedMember = await prisma.teamMember.update({
        where: { id: member.id },
        data: { role: payload.role }
      });

      log.info('Team member updated', { teamId, memberUserId, userId });
      return this.buildResponse(updatedMember);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update team member', { error, teamId, userId });
      throw new AppError('An unexpected error occurred while updating the team member', 500);
    }
  }

  async removeMember(userId: string, teamId: string, memberUserId: string) {
    try {
      await this.ensureTeamAccess(userId, teamId, true);

      const actorMember = await prisma.teamMember.findFirst({
        where: { teamId, userId, deletedAt: null },
        select: { role: true }
      });

      const actorIsAdmin = actorMember?.role === 'ADMIN';
      const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      const actorIsOrgAdmin = actor?.role === 'ADMIN' || actor?.role === 'OWNER' || actor?.role === 'SUPER_ADMIN';

      if (!actorIsAdmin && !actorIsOrgAdmin) {
        throw new AppError('Forbidden', 403);
      }

      const member = await prisma.teamMember.findFirst({
        where: { teamId, userId: memberUserId, deletedAt: null },
        select: { id: true }
      });

      if (!member) {
        throw new AppError('Team member not found', 404);
      }

      await prisma.teamMember.update({
        where: { id: member.id },
        data: { deletedAt: new Date() }
      });

      log.info('Team member removed', { teamId, memberUserId, userId });
      return {
        success: true,
        message: 'Team member removed successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to remove team member', { error, teamId, userId });
      throw new AppError('An unexpected error occurred while removing the team member', 500);
    }
  }
}
