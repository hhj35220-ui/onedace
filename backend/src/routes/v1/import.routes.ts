import { Router } from 'express';
import { ImportController } from '../../controllers/import.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const controller = new ImportController();

router.post('/tasks', authenticate, asyncHandler(controller.importTasks.bind(controller)));
router.post('/projects', authenticate, asyncHandler(controller.importProjects.bind(controller)));
router.get('/template/tasks', authenticate, asyncHandler(controller.getTasksTemplate.bind(controller)));
router.get('/template/projects', authenticate, asyncHandler(controller.getProjectsTemplate.bind(controller)));

export default router;
