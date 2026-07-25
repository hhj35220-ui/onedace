import { Router } from 'express';

import { ProjectController } from '../../controllers/project.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const projectController = new ProjectController();

router.post('/', authenticate, asyncHandler(projectController.create.bind(projectController)));
router.get('/', authenticate, asyncHandler(projectController.list.bind(projectController)));
router.get('/:id', authenticate, asyncHandler(projectController.getById.bind(projectController)));
router.patch('/:id', authenticate, asyncHandler(projectController.update.bind(projectController)));
router.delete('/:id', authenticate, asyncHandler(projectController.remove.bind(projectController)));

export default router;
