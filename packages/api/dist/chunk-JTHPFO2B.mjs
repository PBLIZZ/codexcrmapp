// src/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var middleware = t.middleware;
var isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "You must be logged in to access this resource"
  });
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});
var hasRole = (requiredRoles) => t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource"
    });
  }
  const userRoles = ctx.session.user.app_metadata?.roles || [];
  const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));
  if (!hasRequiredRole) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this resource"
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
      roles: userRoles
    }
  });
});
var rateLimit = (limit, timeWindowMs = 6e4) => {
  const store = /* @__PURE__ */ new Map();
  return t.middleware(({ ctx, next }) => {
    if (!ctx.session?.user) {
      return next({ ctx });
    }
    const userId = ctx.session.user.id;
    const now = Date.now();
    const userRateLimit = store.get(userId);
    if (!userRateLimit || now > userRateLimit.resetTime) {
      store.set(userId, { count: 1, resetTime: now + timeWindowMs });
      return next({ ctx });
    }
    if (userRateLimit.count >= limit) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Please try again later."
      });
    }
    userRateLimit.count += 1;
    store.set(userId, userRateLimit);
    return next({ ctx });
  });
};
var protectedProcedure = t.procedure.use(isAuthed);

export {
  router,
  publicProcedure,
  middleware,
  hasRole,
  rateLimit,
  protectedProcedure
};
