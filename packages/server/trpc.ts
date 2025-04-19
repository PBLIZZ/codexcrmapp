import { initTRPC, inferAsyncReturnType } from '@trpc/server';
import superjson from 'superjson';
import { supabaseAdmin } from './supabaseAdmin';

export async function createContext({ req }: { req: any }) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  let user = null;
  if (token) {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error) user = data.user;
  }
  return { user };
}

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
