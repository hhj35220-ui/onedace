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
  // Prefer the project root (sibling of the backend folder) where index.html lives
  // but fall back to other reasonable locations so this works in dev and production.
  const candidates = [
    path.resolve(process.cwd(), '..'), // when backend cwd is `backend/`, frontend is one level up
    path.resolve(process.cwd()), // when backend is run from project root
    path.resolve(__dirname, '..', '..'), // compiled runtime locations
    path.resolve(__dirname, '..')
  ];

  for (const candidate of candidates) {
    try {
      if (existsSync(path.join(candidate, 'index.html'))) {
        return candidate;
      }
    } catch (e) {
      // ignore and try next candidate
    }
  }

  // As a last resort, use the current working directory.
  return path.resolve(process.cwd());
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

// Apply global rate limiting only to API routes so static assets aren't blocked.
// This prevents the rate limiter from returning JSON error responses for JS/CSS files.
// Keep rate limiting active for API endpoints.

// Response compression for smaller payloads.
app.use(compression());

// Parse JSON bodies up to 10mb.
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies.
app.use(express.urlencoded({ extended: true }));

// Serve the frontend static files from the resolved frontend root.
// Static assets (CSS/JS/images/fonts) must be served directly so the browser can load the SPA.
app.use(express.static(frontendRoot, {
  index: 'index.html',
  redirect: false,
  extensions: ['html'],
  maxAge: 0,
  immutable: false,
  setHeaders: (res: Response) => {
    // Prevent the API rate limiter from interfering with asset requests by ensuring
    // they are not routed through API middleware. We also add no-cache headers
    // for local development so edits surface immediately.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    // Provide correct MIME handling hints for fonts/images when necessary
    return res;
  }
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

// API versioned routes. Apply global rate limiter only to API endpoints.
app.use('/api', globalRateLimiter);
app.use('/api', routes);

// 404 handler for unknown routes.
// Let express.static() serve any existing HTML files and assets. If a
// request doesn't match a static file or API route, fall through to this
// 404 handler which returns a standard Not Found error.
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Resource not found', 404));
});

// Global error handling middleware.
app.use(errorMiddleware);
