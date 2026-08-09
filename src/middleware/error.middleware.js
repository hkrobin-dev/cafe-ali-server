import { env } from '../config/env.js';
import { STATUS } from '../constants/statusCodes.js';

export const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = STATUS.NOT_FOUND;
  next(error);
};

// Must be registered LAST, after all routes
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || STATUS.INTERNAL;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = STATUS.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = STATUS.CONFLICT;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = STATUS.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    statusCode = STATUS.BAD_REQUEST;
    message = 'Validation failed';
    details = err.issues?.map((i) => ({ path: i.path.join('.'), message: i.message }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = STATUS.UNAUTHORIZED;
    message = 'Invalid or expired token';
  }

  if (env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
