import { existsSync } from 'fs';
import path from 'path';
import compression from 'compression';
import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { AppError } from './utils/AppError';
import { errorMiddleware } from './middleware/error.middleware';
import { securityMiddleware } from './middleware/security.middleware';
import { globalRateLimiter } from './middleware/rateLimit.middleware';
import routes from './routes';

function resolveFrontendRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '..', '..'),
    path.resolve(__dirname, '..', '..', '..'),
    path.resolve(__dirname, '..', '..')
  ];

  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, 'index.html'))) {
      return candidate;
    }
  }

  return path.resolve(process.cwd(), '..');
}

// Create the Express application instance.
export const app: Express = express();
const frontendRoot = resolveFrontendRoot();

// Disable the X-Powered-By header for security.
app.disable('x-powered-by');

// Request logging for production visibility.
app.use(morgan('combined'));

// Security middleware and CORS configuration.
app.use(...securityMiddleware);

// Global rate limiting should be applied before body parsing and route handlers.
app.use(globalRateLimiter);

// Response compression for smaller payloads.
app.use(compression());

// Parse JSON bodies up to 10mb.
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies.
app.use(express.urlencoded({ extended: true }));

// Serve the frontend static files from the sibling frontend directory.
app.use(express.static(frontendRoot, {
  index: 'index.html',
  redirect: false,
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// Serve the homepage at /.
app.get('/', (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendRoot, 'index.html'));
});

// Health check endpoint.
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime().toFixed(2),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API versioned routes.
app.use('/api', routes);

// Fallback for client-side routes and unknown pages.
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api') || path.extname(req.path)) {
    return next();
  }

  res.sendFile(path.join(frontendRoot, 'index.html'));
});

// 404 handler for unknown routes.
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Resource not found', 404));
});

// Global error handling middleware.
app.use(errorMiddleware);
