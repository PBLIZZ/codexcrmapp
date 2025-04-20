import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { supabaseAdmin } from './supabaseAdmin';
import { User } from '@supabase/supabase-js';

export async function createContext({ req }: { req: any }) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  let user: User | null = null;
  if (token) {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error) user = data.user;
  }
  return { user };
}

/** Context inferred from createContext() */
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const procedure = t.procedure;
