import { z } from 'zod';

const organizationNameSchema = z.string().trim().min(1, 'Organization name is required').max(100, 'Organization name is too long');
const descriptionSchema = z.string().trim().max(500, 'Description is too long');

export const createOrganizationSchema = z.object({
  name: organizationNameSchema,
  description: descriptionSchema.optional(),
  logoUrl: z.string().trim().max(500, 'Logo URL is too long').optional()
});

export const updateOrganizationSchema = z.object({
  name: organizationNameSchema.optional(),
  description: descriptionSchema.nullable().optional(),
  logoUrl: z.string().trim().max(500, 'Logo URL is too long').nullable().optional()
});

export const organizationIdParamSchema = z.object({
  id: z.string().trim().uuid('Invalid organization id')
});
