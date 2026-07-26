import { Router } from 'express';

import { TaskChecklistController } from '../../controllers/task-checklist.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const taskChecklistController = new TaskChecklistController();

router.get('/tasks/:taskId/checklists', authenticate, asyncHandler(taskChecklistController.listChecklists.bind(taskChecklistController)));
router.post('/tasks/:taskId/checklists', authenticate, asyncHandler(taskChecklistController.createChecklist.bind(taskChecklistController)));
router.patch('/checklists/:checklistId', authenticate, asyncHandler(taskChecklistController.updateChecklist.bind(taskChecklistController)));
router.delete('/checklists/:checklistId', authenticate, asyncHandler(taskChecklistController.deleteChecklist.bind(taskChecklistController)));
router.post('/checklists/:checklistId/items', authenticate, asyncHandler(taskChecklistController.createChecklistItem.bind(taskChecklistController)));
router.patch('/checklist-items/:itemId', authenticate, asyncHandler(taskChecklistController.updateChecklistItem.bind(taskChecklistController)));
router.patch('/checklist-items/:itemId/toggle', authenticate, asyncHandler(taskChecklistController.toggleChecklistItem.bind(taskChecklistController)));
router.delete('/checklist-items/:itemId', authenticate, asyncHandler(taskChecklistController.deleteChecklistItem.bind(taskChecklistController)));

export default router;
