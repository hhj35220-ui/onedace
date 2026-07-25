import dotenv from 'dotenv';

// Load environment variables from a .env file if present.
dotenv.config();

const fallbackDatabaseUrl = 'postgresql://postgres:0808803+1aA@localhost:5432/oneplace';

/**
 * Strict configuration interface for backend runtime settings.
 */
export interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  JWT_SECRET: string;
  REDIS_URL: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  UPLOAD_PATH: string;
  GLOBAL_RATE_LIMIT: number;
  GLOBAL_RATE_WINDOW_SECONDS: number;
  AUTH_RATE_LIMIT: number;
  AUTH_RATE_WINDOW_SECONDS: number;
  AI_RATE_LIMIT: number;
  AI_RATE_WINDOW_SECONDS: number;
}

function requireString(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function requireNumber(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid value for environment variable ${name}: must be a positive number`);
  }

  return parsed;
}

const config: EnvConfig = {
  PORT: Number(process.env.PORT || 3000),
  NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
  DATABASE_URL: requireString('DATABASE_URL', fallbackDatabaseUrl),
  JWT_SECRET: requireString('JWT_SECRET'),
  REDIS_URL: requireString('REDIS_URL'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  LOG_LEVEL: (process.env.LOG_LEVEL as EnvConfig['LOG_LEVEL']) || 'info',
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  GLOBAL_RATE_LIMIT: requireNumber('GLOBAL_RATE_LIMIT', 100),
  GLOBAL_RATE_WINDOW_SECONDS: requireNumber('GLOBAL_RATE_WINDOW_SECONDS', 900),
  AUTH_RATE_LIMIT: requireNumber('AUTH_RATE_LIMIT', 10),
  AUTH_RATE_WINDOW_SECONDS: requireNumber('AUTH_RATE_WINDOW_SECONDS', 900),
  AI_RATE_LIMIT: requireNumber('AI_RATE_LIMIT', 20),
  AI_RATE_WINDOW_SECONDS: requireNumber('AI_RATE_WINDOW_SECONDS', 60)
};

export { config };
