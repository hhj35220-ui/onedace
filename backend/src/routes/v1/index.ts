import { Router, Request, Response } from 'express';

import authRoutes from './auth.routes';
import organizationsRoutes from './organizations.routes';
import projectsRoutes from './projects.routes';
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
router.use('/projects', tasksRoutes);
router.use('/tasks', tasksRoutes);

export default router;
