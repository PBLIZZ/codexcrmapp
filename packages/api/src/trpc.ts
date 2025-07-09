import { initTRPC, TRPCError, inferProcedureOutput } from '@trpc/server';
import superjson from 'superjson';

import type { createInnerTRPCContext } from './context';

const t = initTRPC.context<typeof createInnerTRPCContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * Authentication middleware
 * Checks if the user is authenticated and adds the user to the context
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({
    code: 'UNAUTHORIZED',
    message: 'You must be logged in to access this resource'
  });
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

/**
 * Role-based authorization middleware
 * Checks if the user has the required role
 * @param requiredRoles Array of roles that are allowed to access the resource
 */
export const hasRole = (requiredRoles: string[]) =>
  t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }

    // Get user roles from the session claims
    const userRoles = ctx.session.user.app_metadata?.roles || [];
    
    // Check if the user has any of the required roles
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource',
      });
    }
    
    return next({
      ctx: {
        ...ctx,
        user: ctx.session.user,
        roles: userRoles,
      },
    });
  });

/**
 * Rate limiting middleware
 * Limits the number of requests a user can make in a given time period
 * @param limit Maximum number of requests
 * @param timeWindowMs Time window in milliseconds
 */
export const rateLimit = (limit: number, timeWindowMs: number = 60000) => {
  // Simple in-memory store for rate limiting
  // In production, use Redis or another distributed store
  const store = new Map<string, { count: number, resetTime: number }>();
  
  return t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      return next({ ctx });
    }
    
    const userId = ctx.session.user.id;
    const now = Date.now();
    const userRateLimit = store.get(userId);
    
    if (!userRateLimit || now > userRateLimit.resetTime) {
      // First request or reset time has passed
      store.set(userId, { count: 1, resetTime: now + timeWindowMs });
      return next({ ctx });
    }
    
    if (userRateLimit.count >= limit) {
      // Rate limit exceeded
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Please try again later.',
      });
    }
    
    // Increment request count
    userRateLimit.count += 1;
    store.set(userId, userRateLimit);
    
    return next({ ctx });
  });
};

// Export procedures with middleware
export const protectedProcedure = t.procedure.use(isAuthed);
