export { AppRouter, appRouter } from './root.mjs';
export { Context, createInnerTRPCContext } from './context.mjs';
export { hasRole, middleware, protectedProcedure, publicProcedure, rateLimit, router } from './trpc.mjs';
import '@prisma/client/runtime/library';
import '@trpc/server';
import '@supabase/supabase-js';
import '@codexcrm/database/prisma/generated/client/client';
import '@codexcrm/auth';
