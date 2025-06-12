import { TRPCError } from '@trpc/server';
import { initTRPC } from '@trpc/server';
// Initialize tRPC for middleware
const t = initTRPC.context().create();
const middleware = t.middleware;
/**
 * Authentication middleware
 * Checks if the user is authenticated and adds the user to the context
 */
export const isAuthenticated = middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    });
});
/**
 * Role-based authorization middleware
 * Checks if the user has the required role
 * @param requiredRoles Array of roles that are allowed to access the resource
 */
export const hasRole = (requiredRoles) => middleware(async ({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    // Get user roles from the session claims
    const userRoles = ctx.session?.user?.app_metadata?.roles || [];
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
            user: ctx.user,
            roles: userRoles,
        },
    });
});
/**
 * Owner-based authorization middleware
 * Checks if the user is the owner of the resource
 * @param getResourceOwnerId Function that returns the owner ID of the resource
 */
export const isOwner = (getResourceOwnerId) => middleware(async ({ ctx, input, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    const ownerId = await getResourceOwnerId(input, ctx);
    if (!ownerId || ownerId !== ctx.user.id) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to access this resource',
        });
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    });
});
/**
 * Combine multiple middleware functions
 * @param middlewares Array of middleware functions to combine
 */
export const combineMiddlewares = (middlewares) => middleware(async (opts) => {
    let { ctx } = opts;
    for (const middleware of middlewares) {
        const result = await middleware(opts);
        ctx = result.ctx;
    }
    return opts.next({
        ctx,
    });
});
