export { AppRouter, appRouter } from './root.js';
export { Context, createInnerTRPCContext } from './context.js';
export { hasRole, middleware, protectedProcedure, publicProcedure, rateLimit, router } from './trpc.js';
import '@prisma/client/runtime/library';
import '@trpc/server';
import '@supabase/supabase-js';
import '@codexcrm/database/prisma/generated/client/client';
import '@codexcrm/auth';
