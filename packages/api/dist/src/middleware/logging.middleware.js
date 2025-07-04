import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';
/**
 * Logging middleware
 * Logs requests and responses for debugging and monitoring
 */
export const loggerMiddleware = middleware(async ({ path, type, next }) => {
    const start = Date.now();
    // Log the request
    console.log(`[${new Date().toISOString()}] Request: ${type} ${path}`);
    // Execute the request
    const result = await next();
    // Calculate the duration
    const durationMs = Date.now() - start;
    // Log the response
    if (result.ok) {
        console.log(`[${new Date().toISOString()}] Response: ${type} ${path} - ${durationMs}ms`);
    }
    else {
        console.error(`[${new Date().toISOString()}] Error: ${type} ${path} - ${durationMs}ms`, result.error);
    }
    return result;
});
/**
 * Error handling middleware
 * Catches errors and formats them for the client
 */
export const errorHandlerMiddleware = middleware(async ({ path, next }) => {
    try {
        return await next();
    }
    catch (error) {
        // Log the error
        console.error(`[${new Date().toISOString()}] Unhandled error in ${path}:`, error);
        // If it's already a TRPC error, rethrow it
        if (error instanceof TRPCError) {
            throw error;
        }
        // Otherwise, convert it to a TRPC error
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            cause: error,
        });
    }
});
/**
 * Performance monitoring middleware
 * Logs slow requests for performance monitoring
 * @param thresholdMs Threshold in milliseconds for slow requests
 */
export const performanceMonitoringMiddleware = (thresholdMs = 500) => middleware(async ({ path, type, next }) => {
    const start = Date.now();
    // Execute the request
    const result = await next();
    // Calculate the duration
    const durationMs = Date.now() - start;
    // Log slow requests
    if (durationMs > thresholdMs) {
        console.warn(`[${new Date().toISOString()}] Slow request: ${type} ${path} - ${durationMs}ms`);
    }
    return result;
});
