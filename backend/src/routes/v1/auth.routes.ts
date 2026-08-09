import { Router } from 'express';

import { AuthController } from '../../controllers/auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authRateLimiter } from '../../middleware/rateLimit.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();
const authController = new AuthController();

// Authentication routes with consistent async error handling.
router.post('/register', authRateLimiter, asyncHandler(authController.register.bind(authController)));
router.post('/login', authRateLimiter, asyncHandler(authController.login.bind(authController)));
router.post('/refresh', authRateLimiter, asyncHandler(authController.refreshToken.bind(authController)));
router.post('/logout', authRateLimiter, asyncHandler(authController.logout.bind(authController)));
router.post('/forgot-password', authRateLimiter, asyncHandler(authController.forgotPassword.bind(authController)));
router.post('/reset-password', authRateLimiter, asyncHandler(authController.resetPassword.bind(authController)));
router.post('/firebase', authRateLimiter, asyncHandler(authController.firebaseLogin.bind(authController)));
router.get('/verify-email', authRateLimiter, asyncHandler(authController.verifyEmail.bind(authController)));
router.get('/me', authenticate, asyncHandler(authController.me.bind(authController)));

export default router;
