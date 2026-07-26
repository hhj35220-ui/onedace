import { z } from 'zod';

export const taskIdParamSchema = z.object({
  taskId: z.string().trim().uuid('Invalid task id')
});

export const checklistIdParamSchema = z.object({
  checklistId: z.string().trim().uuid('Invalid checklist id')
});

export const checklistItemIdParamSchema = z.object({
  itemId: z.string().trim().uuid('Invalid checklist item id')
});

export const createChecklistSchema = z.object({
  title: z.string().trim().min(1, 'Checklist title is required').max(100, 'Checklist title must be at most 100 characters'),
  position: z.number().int().optional()
});

export const updateChecklistSchema = z.object({
  title: z.string().trim().min(1, 'Checklist title is required').max(100, 'Checklist title must be at most 100 characters').optional(),
  position: z.number().int().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});

export const createChecklistItemSchema = z.object({
  content: z.string().trim().min(1, 'Checklist item content is required').max(300, 'Checklist item content must be at most 300 characters'),
  position: z.number().int().optional()
});

export const updateChecklistItemSchema = z.object({
  content: z.string().trim().min(1, 'Checklist item content is required').max(300, 'Checklist item content must be at most 300 characters').optional(),
  position: z.number().int().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required'
});
