import { Router } from 'express';

import { UserController } from '../../controllers/user.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const userController = new UserController();

router.get(
  '/me',
  authenticate,
  asyncHandler(userController.getMe.bind(userController))
);

router.patch(
  '/me',
  authenticate,
  asyncHandler(userController.updateMe.bind(userController))
);

router.patch(
  '/me/password',
  authenticate,
  asyncHandler(userController.changePassword.bind(userController))
);

router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(userController.listUsers.bind(userController))
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(userController.getUserById.bind(userController))
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  asyncHandler(userController.updateUserById.bind(userController))
);

router.delete(
  '/:id',
  authenticate,
  authorize('SUPER_ADMIN'),
  asyncHandler(userController.deleteUserById.bind(userController))
);

export default router;
