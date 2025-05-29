import { initTRPC, TRPCError, inferProcedureOutput } from '@trpc/server';
import superjson from 'superjson';

import type { createContext } from './context';

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, user: ctx.user! } });
});

export const protectedProcedure = t.procedure.use(isAuthed);