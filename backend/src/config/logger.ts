import fs from 'fs';
import path from 'path';
import { format, transports, createLogger, Logger } from 'winston';
import { config } from './env';

const LOG_DIRECTORY = path.resolve(process.cwd(), 'logs');
const ERROR_LOG_FILE = path.join(LOG_DIRECTORY, 'error.log');
const COMBINED_LOG_FILE = path.join(LOG_DIRECTORY, 'combined.log');

// Ensure the log directory exists before the logger starts.
if (!fs.existsSync(LOG_DIRECTORY)) {
  fs.mkdirSync(LOG_DIRECTORY, { recursive: true });
}

const commonFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.splat(),
  format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
);

const developmentFormat = format.combine(
  commonFormat,
  format.colorize({ all: true }),
  format.printf(({ timestamp, level, message, stack, metadata }) => {
    const meta = Object.keys(metadata as Record<string, unknown>).length
      ? ` ${JSON.stringify(metadata as Record<string, unknown>)}`
      : '';
    return `${timestamp} [${level}]: ${stack || message}${meta}`;
  })
);

const productionFormat = format.combine(
  commonFormat,
  format.json()
);

const logger: Logger = createLogger({
  level: config.LOG_LEVEL,
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5
  },
  format: config.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  transports: [
    new transports.File({ filename: ERROR_LOG_FILE, level: 'error' }),
    new transports.File({ filename: COMBINED_LOG_FILE })
  ],
  exitOnError: false
});

if (config.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: developmentFormat
    })
  );
}

export const log = logger;

export const loggerMethods = {
  error: (message: string, meta?: Record<string, unknown>) => logger.error(message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => logger.warn(message, meta),
  info: (message: string, meta?: Record<string, unknown>) => logger.info(message, meta),
  http: (message: string, meta?: Record<string, unknown>) => logger.http(message, meta),
  verbose: (message: string, meta?: Record<string, unknown>) => logger.verbose(message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => logger.debug(message, meta)
};
