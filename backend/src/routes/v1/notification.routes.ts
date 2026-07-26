import { Router } from 'express';

import { NotificationController } from '../../controllers/notification.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const notificationController = new NotificationController();

router.get('/', authenticate, asyncHandler(notificationController.list.bind(notificationController)));
router.get('/unread', authenticate, asyncHandler(notificationController.listUnread.bind(notificationController)));
router.get('/unread-count', authenticate, asyncHandler(notificationController.unreadCount.bind(notificationController)));
router.patch('/:id/read', authenticate, asyncHandler(notificationController.markRead.bind(notificationController)));
router.patch('/read-all', authenticate, asyncHandler(notificationController.markAllRead.bind(notificationController)));
router.delete('/:id', authenticate, asyncHandler(notificationController.delete.bind(notificationController)));

export default router;
