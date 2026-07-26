import { Router, Request, Response } from 'express';

import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import organizationsRoutes from './organizations.routes';
import projectsRoutes from './projects.routes';
import taskAttachmentRoutes from './task-attachment.routes';
import taskChecklistRoutes from './task-checklist.routes';
import taskCollaborationRoutes from './task-collaboration.routes';
import taskDependencyRoutes from './task-dependency.routes';
import taskLabelRoutes from './task-label.routes';
import taskRecurringRoutes from './task-recurring.routes';
import calendarRoutes from './calendar.routes';
import auditRoutes from './audit.routes';
import reportRoutes from './report.routes';
import importRoutes from './import.routes';
import notificationRoutes from './notification.routes';
import taskTimeEntryRoutes from './task-time-entry.routes';
import tasksRoutes from './tasks.routes';
import teamsRoutes from './teams.routes';
import usersRoutes from './users.routes';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    name: 'OnePlace Enterprise API',
    version: 'v1',
    status: 'ready'
  });
});

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/teams', teamsRoutes);
router.use('/projects', projectsRoutes);
router.use('/', tasksRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/projects', taskLabelRoutes);
router.use('/tasks', taskAttachmentRoutes);
router.use('/tasks', taskChecklistRoutes);
router.use('/tasks', taskCollaborationRoutes);
router.use('/tasks', taskDependencyRoutes);
router.use('/tasks', taskLabelRoutes);
router.use('/tasks', taskRecurringRoutes);
router.use('/tasks', taskTimeEntryRoutes);
router.use('/checklists', taskChecklistRoutes);
router.use('/checklist-items', taskChecklistRoutes);
router.use('/time-entries', taskTimeEntryRoutes);
router.use('/labels', taskLabelRoutes);
router.use('/calendar', calendarRoutes);
router.use('/audit', auditRoutes);
router.use('/reports', reportRoutes);
router.use('/import', importRoutes);
router.use('/notifications', notificationRoutes);

export default router;
