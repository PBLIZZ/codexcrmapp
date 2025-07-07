/**
 * Logging middleware
 * Logs requests and responses for debugging and monitoring
 */
export declare const loggerMiddleware: import("@trpc/server").TRPCMiddlewareBuilder<import("..").Context, object, object, unknown>;
/**
 * Error handling middleware
 * Catches errors and formats them for the client
 */
export declare const errorHandlerMiddleware: import("@trpc/server").TRPCMiddlewareBuilder<import("..").Context, object, object, unknown>;
/**
 * Performance monitoring middleware
 * Logs slow requests for performance monitoring
 * @param thresholdMs Threshold in milliseconds for slow requests
 */
export declare const performanceMonitoringMiddleware: (thresholdMs?: number) => import("@trpc/server").TRPCMiddlewareBuilder<import("..").Context, object, object, unknown>;
//# sourceMappingURL=logging.middleware.d.ts.map