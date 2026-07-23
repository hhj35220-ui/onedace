import { RequestHandler } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { config } from '../config/env';
import { log } from '../config/logger';

const buildLimiter = (
  max: number,
  windowMs: number,
  message: string
): RateLimitRequestHandler => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const retryAfter = Math.ceil(windowMs / 1000);
      log.warn('Rate limit exceeded', {
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        retryAfter
      });
      res.status(429).json({
        success: false,
        status: 429,
        message,
        retryAfter: `${retryAfter}`
      });
    }
  });
};

export const globalRateLimiter: RequestHandler = buildLimiter(
  config.GLOBAL_RATE_LIMIT,
  config.GLOBAL_RATE_WINDOW_SECONDS * 1000,
  'Too many requests. Please try again later.'
);

export const authRateLimiter: RequestHandler = buildLimiter(
  config.AUTH_RATE_LIMIT,
  config.AUTH_RATE_WINDOW_SECONDS * 1000,
  'Too many authentication requests. Please try again later.'
);

export const aiRateLimiter: RequestHandler = buildLimiter(
  config.AI_RATE_LIMIT,
  config.AI_RATE_WINDOW_SECONDS * 1000,
  'Too many AI requests. Please try again later.'
);
