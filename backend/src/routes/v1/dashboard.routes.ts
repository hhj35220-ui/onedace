import { Router } from 'express';

import { DashboardController } from '../../controllers/dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const dashboardController = new DashboardController();

router.get('/overview', authenticate, asyncHandler(dashboardController.overview.bind(dashboardController)));
router.get('/tasks', authenticate, asyncHandler(dashboardController.tasks.bind(dashboardController)));
router.get('/projects', authenticate, asyncHandler(dashboardController.projects.bind(dashboardController)));
router.get('/time', authenticate, asyncHandler(dashboardController.time.bind(dashboardController)));
router.get('/productivity', authenticate, asyncHandler(dashboardController.productivity.bind(dashboardController)));

export default router;
