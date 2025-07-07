import { ZodSchema } from 'zod';
/**
 * Input validation middleware
 * Validates the input against a Zod schema
 * @param schema Zod schema to validate against
 */
export declare const validateInput: <T>(schema: ZodSchema<T>) => import("@trpc/server").TRPCMiddlewareBuilder<import("..").Context, object, unknown, unknown>;
/**
 * Output validation middleware
 * Validates the output against a Zod schema
 * @param schema Zod schema to validate against
 */
export declare const validateOutput: <T>(schema: ZodSchema<T>) => import("@trpc/server").TRPCMiddlewareBuilder<import("..").Context, object, object, unknown>;
/**
 * Sanitization middleware
 * Sanitizes the input to prevent security issues
 */
export declare const sanitizeInput: import("@trpc/server").TRPCMiddlewareBuilder<import("..").Context, object, object, unknown>;
//# sourceMappingURL=validation.middleware.d.ts.map