import { Router } from 'express';

import { TaskAttachmentController } from '../../controllers/task-attachment.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { uploadAttachmentMiddleware } from '../../services/task-attachment.service';

const router = Router();
const taskAttachmentController = new TaskAttachmentController();

router.post('/:taskId/attachments', authenticate, uploadAttachmentMiddleware, asyncHandler(taskAttachmentController.upload.bind(taskAttachmentController)));
router.get('/:taskId/attachments', authenticate, asyncHandler(taskAttachmentController.list.bind(taskAttachmentController)));
router.delete('/attachments/:attachmentId', authenticate, asyncHandler(taskAttachmentController.remove.bind(taskAttachmentController)));

export default router;
