import { TRPCError } from '@trpc/server';
import { ZodError } from 'zod';

/**
 * Custom error types for the application
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  INTERNAL = 'INTERNAL',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(
    type: ErrorType,
    message: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Map HTTP status codes to TRPC error codes
 */
const statusCodeToTRPCCode: Record<number, TRPCError['code']> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  429: 'TOO_MANY_REQUESTS',
  500: 'INTERNAL_SERVER_ERROR',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
  504: 'GATEWAY_TIMEOUT',
};

/**
 * Convert an error to a TRPC error
 * @param error Error to convert
 * @returns TRPC error
 */
export function toTRPCError(error: unknown): TRPCError {
  // If it's already a TRPC error, return it
  if (error instanceof TRPCError) {
    return error;
  }

  // Handle AppError
  if (error instanceof AppError) {
    const code = statusCodeToTRPCCode[error.statusCode] || 'INTERNAL_SERVER_ERROR';
    return new TRPCError({
      code: code as TRPCError['code'],
      message: error.message,
      cause: error,
    });
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Validation error',
      cause: error,
    });
  }

  // Handle standard errors
  if (error instanceof Error) {
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
      cause: error,
    });
  }

  // Handle unknown errors
  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    cause: error,
  });
}

/**
 * Format error for logging
 * @param error Error to format
 * @returns Formatted error object for logging
 */
export function formatErrorForLogging(error: unknown): Record<string, any> {
  if (error instanceof TRPCError) {
    return {
      type: 'TRPCError',
      code: error.code,
      message: error.message,
      stack: error.stack,
      cause: error.cause ? formatErrorForLogging(error.cause) : undefined,
    };
  }

  if (error instanceof AppError) {
    return {
      type: 'AppError',
      errorType: error.type,
      statusCode: error.statusCode,
      message: error.message,
      stack: error.stack,
      details: error.details,
    };
  }

  if (error instanceof ZodError) {
    return {
      type: 'ZodError',
      message: 'Validation error',
      errors: error.errors,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    return {
      type: error.name || 'Error',
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    type: 'Unknown',
    error: String(error),
  };
}

/**
 * Format error for client response
 * @param error Error to format
 * @param includeDetails Whether to include error details (for development only)
 * @returns Formatted error object for client response
 */
export function formatErrorForClient(
  error: unknown,
  includeDetails: boolean = process.env.NODE_ENV !== 'production'
): Record<string, any> {
  const formattedError = {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
  };

  if (error instanceof TRPCError) {
    formattedError.message = error.message;
    formattedError.code = error.code;
  } else if (error instanceof AppError) {
    formattedError.message = error.message;
    formattedError.code = error.type;
  } else if (error instanceof Error) {
    formattedError.message = error.message;
  }

  // Include additional details in development
  if (includeDetails) {
    return {
      ...formattedError,
      details: formatErrorForLogging(error),
    };
  }

  return formattedError;
}

/**
 * Create common application errors
 */
export const createError = {
  validation: (message: string, details?: any) =>
    new AppError(ErrorType.VALIDATION, message, 400, details),
  
  authentication: (message: string = 'Authentication required') =>
    new AppError(ErrorType.AUTHENTICATION, message, 401),
  
  authorization: (message: string = 'You do not have permission to access this resource') =>
    new AppError(ErrorType.AUTHORIZATION, message, 403),
  
  notFound: (resource: string = 'Resource') =>
    new AppError(ErrorType.NOT_FOUND, `${resource} not found`, 404),
  
  conflict: (message: string) =>
    new AppError(ErrorType.CONFLICT, message, 409),
  
  rateLimit: (message: string = 'Rate limit exceeded') =>
    new AppError(ErrorType.RATE_LIMIT, message, 429),
  
  internal: (message: string = 'Internal server error', details?: any) =>
    new AppError(ErrorType.INTERNAL, message, 500, details),
  
  externalService: (service: string, message: string) =>
    new AppError(
      ErrorType.EXTERNAL_SERVICE,
      `Error in external service ${service}: ${message}`,
      502
    ),
};