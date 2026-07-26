import { Router } from 'express';

import { TaskLabelController } from '../../controllers/task-label.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const taskLabelController = new TaskLabelController();

router.get('/projects/:projectId/labels', authenticate, asyncHandler(taskLabelController.listLabels.bind(taskLabelController)));
router.post('/projects/:projectId/labels', authenticate, asyncHandler(taskLabelController.createLabel.bind(taskLabelController)));
router.patch('/labels/:labelId', authenticate, asyncHandler(taskLabelController.updateLabel.bind(taskLabelController)));
router.delete('/labels/:labelId', authenticate, asyncHandler(taskLabelController.deleteLabel.bind(taskLabelController)));
router.post('/tasks/:taskId/labels/:labelId', authenticate, asyncHandler(taskLabelController.attachLabel.bind(taskLabelController)));
router.delete('/tasks/:taskId/labels/:labelId', authenticate, asyncHandler(taskLabelController.detachLabel.bind(taskLabelController)));

export default router;
