import { Router } from 'express';

import { TaskController } from '../../controllers/task.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const taskController = new TaskController();

router.post('/:projectId/tasks', authenticate, asyncHandler(taskController.create.bind(taskController)));
router.get('/:projectId/tasks', authenticate, asyncHandler(taskController.list.bind(taskController)));
router.get('/:id', authenticate, asyncHandler(taskController.getById.bind(taskController)));
router.patch('/:id', authenticate, asyncHandler(taskController.update.bind(taskController)));
router.delete('/:id', authenticate, asyncHandler(taskController.remove.bind(taskController)));

export default router;
