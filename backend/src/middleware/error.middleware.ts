import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { log } from '../config/logger';

interface ErrorResponse {
  success: false;
  status: number;
  message: string;
  timestamp: string;
  path: string;
  requestId?: string;
  stack?: string;
}

const buildErrorResponse = (
  err: Error,
  req: Request,
  statusCode: number,
  message: string,
  isOperational: boolean
): ErrorResponse => {
  const response: ErrorResponse = {
    success: false,
    status: statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    requestId: req.headers['x-request-id'] as string | undefined
  };

  if (process.env.NODE_ENV !== 'production' || !isOperational) {
    response.stack = err.stack;
  }

  return response;
};

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;
  let statusCode = 500;
  let message = 'An unexpected error occurred.';
  let isOperational = false;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  } else if ((error as any).type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON payload.';
  } else if ((error as any).name === 'SyntaxError' && (error as any).status === 400 && 'body' in (error as any)) {
    statusCode = 400;
    message = 'Invalid JSON payload.';
  }

  log.error('Unhandled exception', {
    message: error.message,
    statusCode,
    path: req.originalUrl,
    stack: error.stack
  });

  const response = buildErrorResponse(error, req, statusCode, message, isOperational);

  res.status(statusCode).json(response);
};
