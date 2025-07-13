import type { Session, User } from '@supabase/supabase-js';
import { prisma } from '@codexcrm/db';

import { createSupabaseServer } from '@/lib/supabase/server';
import { supabaseAdmin } from './supabaseAdmin';

/** Shape of the tRPC context object */
export interface Context {
  user: User | null;
  session: Session | null;
  supabaseAdmin: typeof supabaseAdmin;
  supabaseUser: Awaited<ReturnType<typeof createSupabaseServer>>;
  prisma: typeof prisma;
}

/** Builds tRPC context for each request */
export async function createContext(): Promise<Context> {
  // Use the shared Supabase server client creation function
  const supabase = await createSupabaseServer();

  try {
    // Use getUser() as the primary authentication method (recommended by Supabase)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      console.error('tRPC context error getting user:', userError.message);
    }

    // Only get session if needed for specific session-related data
    let session = null;
    if (user) {
      const {
        data: { session: sessionData },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('tRPC context error getting session:', sessionError.message);
      } else {
        session = sessionData;
      }
    }

    console.error('tRPC context auth status:', {
      authenticated: !!user,
      userId: user?.id,
      email: user?.email,
      cookiesFound: !!user,
    });

    return {
      user,
      session,
      supabaseAdmin,
      supabaseUser: supabase,
      prisma,
    };
  } catch (error) {
    console.error('tRPC context error:', error);

    return {
      user: null,
      session: null,
      supabaseAdmin,
      supabaseUser: supabase,
      prisma,
    };
  }
}
