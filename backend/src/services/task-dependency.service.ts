import { prisma } from '../config/database';
import { log } from '../config/logger';
import { CreateDependencyDto } from '../dto/tasks/create-dependency.dto';
import { AppError } from '../utils/AppError';

export class TaskDependencyService {
  private buildResponse(data: unknown, message: string) {
    return {
      success: true,
      message,
      data
    };
  }

  private async ensureTaskAccess(userId: string, taskId: string, allowWrite = false): Promise<{ organizationId: string; projectId: string; projectTeamId: string | null; taskCreatorId: string; taskAssigneeId: string | null }> {
    const task = await prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true, projectId: true, creatorId: true, assigneeId: true }
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    const project = await prisma.project.findFirst({
      where: { id: task.projectId, deletedAt: null },
      select: { id: true, organizationId: true, teamId: true, createdBy: true }
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const actor = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    const isAdmin = actor?.role === 'OWNER' || actor?.role === 'ADMIN' || actor?.role === 'SUPER_ADMIN';
    const isOrganizationOwner = await this.isOrganizationOwner(userId, project.organizationId);
    const isProjectAdmin = await this.isProjectAdmin(userId, project.teamId, project.organizationId);
    const isTaskCreator = task.creatorId === userId;
    const isAssignee = task.assigneeId === userId;

    if (!allowWrite) {
      if (isAdmin || isOrganizationOwner || isProjectAdmin || isTaskCreator || isAssignee || await this.isProjectMember(userId, project.teamId, project.organizationId)) {
        return {
          organizationId: project.organizationId,
          projectId: project.id,
          projectTeamId: project.teamId,
          taskCreatorId: task.creatorId,
          taskAssigneeId: task.assigneeId
        };
      }

      throw new AppError('Forbidden', 403);
    }

    if (isAdmin || isOrganizationOwner || isProjectAdmin || isTaskCreator || isAssignee) {
      return {
        organizationId: project.organizationId,
        projectId: project.id,
        projectTeamId: project.teamId,
        taskCreatorId: task.creatorId,
        taskAssigneeId: task.assigneeId
      };
    }

    throw new AppError('Forbidden', 403);
  }

  private async isOrganizationOwner(userId: string, organizationId: string): Promise<boolean> {
    const organization = await prisma.organization.findFirst({
      where: { id: organizationId, deletedAt: null },
      select: { ownerId: true }
    });

    return organization?.ownerId === userId;
  }

  private async isProjectAdmin(userId: string, teamId: string | null, organizationId: string): Promise<boolean> {
    if (!teamId) {
      return false;
    }

    const membership = await prisma.teamMember.findFirst({
      where: {
        userId,
        deletedAt: null,
        role: 'ADMIN',
        team: {
          id: teamId,
          deletedAt: null,
          organizationId
        }
      },
      select: { id: true }
    });

    return Boolean(membership);
  }

  private async isProjectMember(userId: string, teamId: string | null, organizationId: string): Promise<boolean> {
    if (teamId) {
      const membership = await prisma.teamMember.findFirst({
        where: {
          userId,
          deletedAt: null,
          team: {
            id: teamId,
            deletedAt: null,
            organizationId
          }
        },
        select: { id: true }
      });

      return Boolean(membership);
    }

    const organizationMembership = await prisma.teamMember.findFirst({
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

    return Boolean(organizationMembership);
  }

  private async isCircularDependency(taskId: string, targetTaskId: string): Promise<boolean> {
    const visited = new Set<string>();
    const stack = [targetTaskId];

    while (stack.length > 0) {
      const currentTaskId = stack.pop();
      if (!currentTaskId) {
        continue;
      }

      if (currentTaskId === taskId) {
        return true;
      }

      if (visited.has(currentTaskId)) {
        continue;
      }

      visited.add(currentTaskId);

      const dependents = await prisma.taskDependency.findMany({
        where: { taskId: currentTaskId, deletedAt: null },
        select: { dependsOnTaskId: true }
      });

      stack.push(...dependents.map((dependency) => dependency.dependsOnTaskId));
    }

    return false;
  }

  async listDependencies(userId: string, taskId: string) {
    try {
      await this.ensureTaskAccess(userId, taskId);

      const dependencies = await prisma.taskDependency.findMany({
        where: { taskId, deletedAt: null },
        orderBy: { createdAt: 'asc' },
        include: {
          dependsOnTask: {
            select: {
              id: true,
              name: true,
              status: true,
              priority: true,
              dueDate: true
            }
          }
        }
      });

      return this.buildResponse({ taskId, dependencies }, 'Task dependencies retrieved successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve task dependencies', { error, userId, taskId });
      throw new AppError('An unexpected error occurred while retrieving the task dependencies', 500);
    }
  }

  async createDependency(userId: string, taskId: string, payload: CreateDependencyDto) {
    try {
      await this.ensureTaskAccess(userId, taskId, true);

      const sourceTask = await prisma.task.findFirst({
        where: { id: taskId, deletedAt: null },
        select: { id: true, projectId: true }
      });

      if (!sourceTask) {
        throw new AppError('Task not found', 404);
      }

      const targetTask = await prisma.task.findFirst({
        where: { id: payload.dependsOnTaskId, deletedAt: null },
        select: { id: true, projectId: true }
      });

      if (!targetTask) {
        throw new AppError('Dependency task not found', 404);
      }

      if (payload.dependsOnTaskId === taskId) {
        throw new AppError('A task cannot depend on itself', 400);
      }

      if (sourceTask.projectId !== targetTask.projectId) {
        throw new AppError('Dependency task must belong to the same project', 400);
      }

      const existingDependency = await prisma.taskDependency.findFirst({
        where: {
          taskId,
          dependsOnTaskId: payload.dependsOnTaskId,
          deletedAt: null
        },
        select: { id: true }
      });

      if (existingDependency) {
        return this.buildResponse({ taskId, dependsOnTaskId: payload.dependsOnTaskId }, 'Task dependency already exists');
      }

      if (await this.isCircularDependency(taskId, payload.dependsOnTaskId)) {
        throw new AppError('Circular dependency detected', 400);
      }

      const dependency = await prisma.taskDependency.create({
        data: {
          taskId,
          dependsOnTaskId: payload.dependsOnTaskId
        }
      });

      return this.buildResponse(dependency, 'Task dependency created successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create task dependency', { error, userId, taskId, payload });
      throw new AppError('An unexpected error occurred while creating the task dependency', 500);
    }
  }

  async deleteDependency(userId: string, dependencyId: string) {
    try {
      const dependency = await prisma.taskDependency.findFirst({
        where: { id: dependencyId, deletedAt: null },
        select: { id: true, taskId: true }
      });

      if (!dependency) {
        throw new AppError('Task dependency not found', 404);
      }

      await this.ensureTaskAccess(userId, dependency.taskId, true);

      const deletedDependency = await prisma.taskDependency.update({
        where: { id: dependencyId },
        data: { deletedAt: new Date() }
      });

      return this.buildResponse(deletedDependency, 'Task dependency deleted successfully');
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete task dependency', { error, userId, dependencyId });
      throw new AppError('An unexpected error occurred while deleting the task dependency', 500);
    }
  }
}
