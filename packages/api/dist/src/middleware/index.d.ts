export { hasRole, rateLimit, } from '../trpc';
export { loggerMiddleware, errorHandlerMiddleware, performanceMonitoringMiddleware, } from './logging.middleware';
export { validateInput, validateOutput, sanitizeInput, } from './validation.middleware';
export declare const createApiMiddleware: () => import("@trpc/server").TRPCMiddlewareBuilder<import("..").Context, object, object, unknown>[];
//# sourceMappingURL=index.d.ts.map