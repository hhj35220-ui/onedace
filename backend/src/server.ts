import http from 'http';
import { app } from './app';
import { config } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { log } from './config/logger';

// Read the port from the validated configuration object.
const PORT = config.PORT;

// Create the HTTP server backed by the Express app.
const server = http.createServer(app);

/**
 * Start the HTTP server and wait for the listening event.
 */
async function startServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    server.listen(PORT)
      .once('listening', () => {
        const address = server.address();
        const host = typeof address === 'string' ? address : address?.address || 'localhost';
        const port = typeof address === 'string' ? PORT : address?.port || PORT;
        log.info('Server is running', { host, port, environment: config.NODE_ENV });
        resolve();
      })
      .once('error', (error) => {
        reject(error);
      });
  });
}

/**
 * Close the HTTP server and disconnect the database gracefully.
 */
async function shutdownServer(signal: string): Promise<void> {
  log.info('Received shutdown signal', { signal });

  await disconnectDatabase();

  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      log.info('Server closed successfully.');
      resolve();
    });
  });
}

/**
 * Handle termination signals and exit cleanly.
 */
function handleShutdown(signal: string): void {
  shutdownServer(signal)
    .then(() => process.exit(0))
    .catch((error) => {
      log.error('Server shutdown failed', { signal, error });
      process.exit(1);
    });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

log.info('Starting server', { port: PORT, environment: config.NODE_ENV });

connectDatabase()
  .then(() => startServer())
  .catch((error) => {
    log.error('Failed to initialize application', { error });
    process.exit(1);
  });
