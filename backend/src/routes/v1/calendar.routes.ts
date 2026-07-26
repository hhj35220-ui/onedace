import { Router } from 'express';
import { CalendarController } from '../../controllers/calendar.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const controller = new CalendarController();

router.post('/connect', authenticate, asyncHandler(controller.connect.bind(controller)));
router.delete('/disconnect', authenticate, asyncHandler(controller.disconnect.bind(controller)));
router.get('/status', authenticate, asyncHandler(controller.getStatus.bind(controller)));
router.post('/sync', authenticate, asyncHandler(controller.sync.bind(controller)));
router.get('/export.ics', authenticate, asyncHandler(controller.exportIcs.bind(controller)));

export default router;
