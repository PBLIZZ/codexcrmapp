import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Session, User } from '@supabase/supabase-js';
import { supabaseAdmin } from './supabaseAdmin';

/** Shape of the tRPC context object */
export interface Context {
  user: User | null;
  session: Session | null;
  supabaseAdmin: typeof supabaseAdmin;
}

/** Builds tRPC context for each request */
export async function createContext(): Promise<Context> {
  // In Next.js 15, cookies() is asynchronous and needs to be awaited
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          // In server components, we can't set cookies directly
          // This would typically be handled by middleware
        },
        remove(name, options) {
          // In server components, we can't remove cookies directly
          // This would typically be handled by middleware
        }
      }
    },
  );

  const { data: { user } }    = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();

  return { user, session, supabaseAdmin };
}