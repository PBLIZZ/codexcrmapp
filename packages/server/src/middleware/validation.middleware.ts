import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';
import { ZodError, ZodSchema } from 'zod';

/**
 * Input validation middleware
 * Validates the input against a Zod schema
 * @param schema Zod schema to validate against
 */
export const validateInput = <T>(schema: ZodSchema<T>) => 
  middleware(async ({ input, path, next }) => {
    try {
      // Validate the input against the schema
      const validatedInput = await schema.parseAsync(input);
      
      // Continue with the validated input
      return next({
        input: validatedInput,
      });
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid input for ${path}: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
          cause: error,
        });
      }
      
      // Rethrow other errors
      throw error;
    }
  });

/**
 * Output validation middleware
 * Validates the output against a Zod schema
 * @param schema Zod schema to validate against
 */
export const validateOutput = <T>(schema: ZodSchema<T>) =>
  middleware(async ({ path, next }) => {
    // Execute the request
    const result = await next();
    
    try {
      if (result.ok) {
        // Validate the output against the schema
        const validatedOutput = await schema.parseAsync(result.data);
        
        // Return the validated output
        return {
          ...result,
          data: validatedOutput,
        };
      }
      
      // If there was an error, just return the result
      return result;
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        console.error(`Output validation error for ${path}:`, error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Server returned invalid data',
          cause: error,
        });
      }
      
      // Rethrow other errors
      throw error;
    }
  });

/**
 * Sanitization middleware
 * Sanitizes the input to prevent security issues
 */
export const sanitizeInput = middleware(async ({ input, next }) => {
  // If input is not an object, return it as is
  if (typeof input !== 'object' || input === null) {
    return next();
  }
  
  // Create a sanitized copy of the input
  const sanitizedInput: Record<string, any> = { ...input };
  
  // Sanitize string values to prevent XSS
  Object.entries(sanitizedInput).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Simple sanitization: replace < and > with HTML entities
      // In a real application, use a proper sanitization library
      sanitizedInput[key] = value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  });
  
  // Continue with the sanitized input
  return next({
    input: sanitizedInput,
  });
});