import { Router } from 'express';
import { ReportController } from '../../controllers/report.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const controller = new ReportController();

router.get('/tasks', authenticate, asyncHandler(controller.getTasksReport.bind(controller)));
router.get('/projects', authenticate, asyncHandler(controller.getProjectsReport.bind(controller)));
router.get('/time', authenticate, asyncHandler(controller.getTimeReport.bind(controller)));
router.get('/productivity', authenticate, asyncHandler(controller.getProductivityReport.bind(controller)));
router.post('/export', authenticate, asyncHandler(controller.exportReport.bind(controller)));

export default router;
