// Export middleware from trpc.ts
export { 
  hasRole,
  rateLimit,
} from '../trpc';

// Export logging middleware
export {
  loggerMiddleware,
  errorHandlerMiddleware,
  performanceMonitoringMiddleware,
} from './logging.middleware';

// Export validation middleware
export {
  validateInput,
  validateOutput,
  sanitizeInput,
} from './validation.middleware';

// Import middleware for combined export
import { loggerMiddleware, errorHandlerMiddleware } from './logging.middleware';
import { sanitizeInput } from './validation.middleware';

// Export combined middleware
export const createApiMiddleware = () => [
  loggerMiddleware,
  errorHandlerMiddleware,
  sanitizeInput,
];