import { Router } from 'express';

import { TaskController } from '../../controllers/task.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const taskController = new TaskController();

router.post('/projects/:projectId/tasks', authenticate, asyncHandler(taskController.create.bind(taskController)));
router.get('/projects/:projectId/tasks', authenticate, asyncHandler(taskController.list.bind(taskController)));
router.get('/projects/:projectId/tasks/analytics', authenticate, asyncHandler(taskController.analytics.bind(taskController)));
router.get('/tasks/:id', authenticate, asyncHandler(taskController.getById.bind(taskController)));
router.patch('/tasks/:id', authenticate, asyncHandler(taskController.update.bind(taskController)));
router.delete('/tasks/:id', authenticate, asyncHandler(taskController.remove.bind(taskController)));

export default router;
