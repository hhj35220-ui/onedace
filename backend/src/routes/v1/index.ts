import { Router, Request, Response } from 'express';

import authRoutes from './auth.routes';
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

export default router;
