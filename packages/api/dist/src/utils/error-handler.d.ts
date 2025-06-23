import { TRPCError } from '@trpc/server';
/**
 * Custom error types for the application
 */
export declare enum ErrorType {
    VALIDATION = "VALIDATION",
    AUTHENTICATION = "AUTHENTICATION",
    AUTHORIZATION = "AUTHORIZATION",
    NOT_FOUND = "NOT_FOUND",
    CONFLICT = "CONFLICT",
    RATE_LIMIT = "RATE_LIMIT",
    INTERNAL = "INTERNAL",
    EXTERNAL_SERVICE = "EXTERNAL_SERVICE"
}
/**
 * Custom error class for application errors
 */
export declare class AppError extends Error {
    readonly type: ErrorType;
    readonly statusCode: number;
    readonly details?: any;
    constructor(type: ErrorType, message: string, statusCode?: number, details?: any);
}
/**
 * Convert an error to a TRPC error
 * @param error Error to convert
 * @returns TRPC error
 */
export declare function toTRPCError(error: unknown): TRPCError;
/**
 * Format error for logging
 * @param error Error to format
 * @returns Formatted error object for logging
 */
export declare function formatErrorForLogging(error: unknown): Record<string, any>;
/**
 * Format error for client response
 * @param error Error to format
 * @param includeDetails Whether to include error details (for development only)
 * @returns Formatted error object for client response
 */
export declare function formatErrorForClient(error: unknown, includeDetails?: boolean): Record<string, any>;
/**
 * Create common application errors
 */
export declare const createError: {
    validation: (message: string, details?: any) => AppError;
    authentication: (message?: string) => AppError;
    authorization: (message?: string) => AppError;
    notFound: (resource?: string) => AppError;
    conflict: (message: string) => AppError;
    rateLimit: (message?: string) => AppError;
    internal: (message?: string, details?: any) => AppError;
    externalService: (service: string, message: string) => AppError;
};
