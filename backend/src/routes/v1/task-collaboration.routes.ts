import { Router } from 'express';

import { TaskCollaborationController } from '../../controllers/task-collaboration.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const taskCollaborationController = new TaskCollaborationController();

router.post('/:taskId/comments', authenticate, asyncHandler(taskCollaborationController.createComment.bind(taskCollaborationController)));
router.get('/:taskId/comments', authenticate, asyncHandler(taskCollaborationController.listComments.bind(taskCollaborationController)));
router.get('/:taskId/activity', authenticate, asyncHandler(taskCollaborationController.getActivity.bind(taskCollaborationController)));
router.patch('/comments/:id', authenticate, asyncHandler(taskCollaborationController.updateComment.bind(taskCollaborationController)));
router.delete('/comments/:id', authenticate, asyncHandler(taskCollaborationController.deleteComment.bind(taskCollaborationController)));

export default router;
