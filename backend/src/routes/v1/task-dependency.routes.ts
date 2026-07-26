import { Router } from 'express';

import { TaskDependencyController } from '../../controllers/task-dependency.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const taskDependencyController = new TaskDependencyController();

router.get('/:taskId/dependencies', authenticate, asyncHandler(taskDependencyController.listDependencies.bind(taskDependencyController)));
router.post('/:taskId/dependencies', authenticate, asyncHandler(taskDependencyController.createDependency.bind(taskDependencyController)));
router.delete('/dependencies/:dependencyId', authenticate, asyncHandler(taskDependencyController.deleteDependency.bind(taskDependencyController)));

export default router;
