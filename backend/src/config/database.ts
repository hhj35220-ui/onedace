import { PrismaClient } from '@prisma/client';
import { config } from './env';
import { log } from './logger';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: config.DATABASE_URL
      }
    }
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    log.info('Database connection established.');
  } catch (error) {
    log.error('Database connection failed.', { error });
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    log.info('Database connection closed.');
  } catch (error) {
    log.error('Database disconnect failed.', { error });
  }
};

export { prisma };
