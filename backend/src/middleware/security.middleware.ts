import { RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '../config/env';

const allowedOrigins = config.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
const additionalAllowedOrigins = [
  'https://oneplacee.onrender.com',
  'https://www.oneplacee.onrender.com'
];
const normalizedAllowedOrigins = new Set([...allowedOrigins, ...additionalAllowedOrigins]);

function isAllowedOrigin(origin: string): boolean {
  if (normalizedAllowedOrigins.has(origin)) {
    return true;
  }

  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

export const securityMiddleware: RequestHandler[] = [
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'no-referrer' },
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    crossOriginResourcePolicy: { policy: 'same-origin' }
  }),
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('CORS policy: Origin not allowed'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID'],
    credentials: true,
    optionsSuccessStatus: 204
  })
];
