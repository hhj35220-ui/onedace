import { Router } from 'express';

import { AuthController } from '../../controllers/auth.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const authController = new AuthController();

// Authentication routes scaffolded for Phase 3.1.
router.post('/register', asyncHandler(authController.register.bind(authController)));
router.post('/login', authController.login.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));
router.get('/verify-email', authController.verifyEmail.bind(authController));
router.get('/me', authController.me.bind(authController));

export default router;
