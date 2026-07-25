import { prisma } from '../config/database';
import { log } from '../config/logger';
import { CreateOrganizationDto } from '../dto/organizations/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/organizations/update-organization.dto';
import { AppError } from '../utils/AppError';

export class OrganizationService {
  private buildResponse(organization: Record<string, unknown>) {
    return {
      success: true,
      message: 'Organization processed successfully',
      data: organization
    };
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'organization';
  }

  private async generateUniqueSlug(baseName: string): Promise<string> {
    const baseSlug = this.slugify(baseName);
    let candidate = baseSlug;
    let counter = 1;

    while (await prisma.organization.findFirst({ where: { slug: candidate } })) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }

    return candidate;
  }

  async create(userId: string, payload: CreateOrganizationDto) {
    try {
      const slug = await this.generateUniqueSlug(payload.name);
      const organization = await prisma.organization.create({
        data: {
          name: payload.name.trim(),
          slug,
          description: payload.description?.trim() ?? null,
          logoUrl: payload.logoUrl?.trim() ?? null,
          ownerId: userId
        }
      });

      log.info('Organization created', { organizationId: organization.id, userId });

      return this.buildResponse(organization);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to create organization', { error, userId });
      throw new AppError('An unexpected error occurred while creating the organization', 500);
    }
  }

  async getById(organizationId: string) {
    try {
      const organization = await prisma.organization.findFirst({
        where: { id: organizationId, deletedAt: null }
      });

      if (!organization) {
        throw new AppError('Organization not found', 404);
      }

      return this.buildResponse(organization);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to retrieve organization', { error, organizationId });
      throw new AppError('An unexpected error occurred while retrieving the organization', 500);
    }
  }

  async update(userId: string, organizationId: string, payload: UpdateOrganizationDto) {
    try {
      const organization = await prisma.organization.findFirst({
        where: { id: organizationId, deletedAt: null }
      });

      if (!organization) {
        throw new AppError('Organization not found', 404);
      }

      const isOwner = organization.ownerId === userId;
      const isSuperAdmin = (await prisma.user.findUnique({ where: { id: userId }, select: { role: true } }))?.role === 'SUPER_ADMIN';

      if (!isOwner && !isSuperAdmin) {
        throw new AppError('Forbidden', 403);
      }

      const updateData: Record<string, string | null> = {};

      if (payload.name !== undefined) {
        updateData.name = payload.name.trim();
        const generatedSlug = this.slugify(payload.name);
        const existingSlug = await prisma.organization.findFirst({
          where: {
            slug: generatedSlug,
            id: { not: organizationId }
          },
          select: { id: true }
        });

        if (!existingSlug) {
          updateData.slug = generatedSlug;
        }
      }
      if (payload.description !== undefined) {
        updateData.description = payload.description?.trim() ?? null;
      }
      if (payload.logoUrl !== undefined) {
        updateData.logoUrl = payload.logoUrl?.trim() ?? null;
      }

      const updatedOrganization = await prisma.organization.update({
        where: { id: organizationId },
        data: updateData
      });

      log.info('Organization updated', { organizationId, userId });

      return this.buildResponse(updatedOrganization);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to update organization', { error, organizationId, userId });
      throw new AppError('An unexpected error occurred while updating the organization', 500);
    }
  }

  async remove(userId: string, organizationId: string) {
    try {
      const organization = await prisma.organization.findFirst({
        where: { id: organizationId, deletedAt: null }
      });

      if (!organization) {
        throw new AppError('Organization not found', 404);
      }

      const isOwner = organization.ownerId === userId;
      const isSuperAdmin = (await prisma.user.findUnique({ where: { id: userId }, select: { role: true } }))?.role === 'SUPER_ADMIN';

      if (!isOwner && !isSuperAdmin) {
        throw new AppError('Forbidden', 403);
      }

      await prisma.organization.update({
        where: { id: organizationId },
        data: { deletedAt: new Date() }
      });

      log.info('Organization deleted', { organizationId, userId });

      return {
        success: true,
        message: 'Organization deleted successfully'
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      log.error('Failed to delete organization', { error, organizationId, userId });
      throw new AppError('An unexpected error occurred while deleting the organization', 500);
    }
  }
}
