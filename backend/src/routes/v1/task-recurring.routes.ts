import { Router } from 'express';
import { TaskRecurringController } from '../../controllers/task-recurring.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const controller = new TaskRecurringController();

router.post('/:taskId/recurring', authenticate, asyncHandler(controller.create.bind(controller)));
router.get('/:taskId/recurring', authenticate, asyncHandler(controller.getByTask.bind(controller)));
router.put('/recurring/:id', authenticate, asyncHandler(controller.update.bind(controller)));
router.delete('/recurring/:id', authenticate, asyncHandler(controller.delete.bind(controller)));
router.post('/recurring/:id/run', authenticate, asyncHandler(controller.run.bind(controller)));

export default router;
