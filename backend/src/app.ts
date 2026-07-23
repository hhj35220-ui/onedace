import compression from 'compression';
import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { AppError } from './utils/AppError';
import { errorMiddleware } from './middleware/error.middleware';
import { securityMiddleware } from './middleware/security.middleware';
import { globalRateLimiter } from './middleware/rateLimit.middleware';
import routes from './routes';

// Create the Express application instance.
export const app: Express = express();

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

// Root status endpoint.
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'OnePlace Enterprise API',
    status: 'running',
    version: '1.0.0'
  });
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

// 404 handler for unknown routes.
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Resource not found', 404));
});

// Global error handling middleware.
app.use(errorMiddleware);
