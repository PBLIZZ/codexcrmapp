import { createServerClient } from '@supabase/ssr';
import type { Session, User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

import { supabaseAdmin } from './supabaseAdmin';

/** Shape of the tRPC context object */
export interface Context {
  user: User | null;
  session: Session | null;
  supabaseAdmin: typeof supabaseAdmin;
  supabaseUser: ReturnType<typeof createServerClient>;
}

/** Builds tRPC context for each request */
export async function createContext({
  req,
}: {
  req: Request;
}): Promise<Context> {
  // Create a supabase client using Next.js cookies() for proper SSR support
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

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
        console.error(
          'tRPC context error getting session:',
          sessionError.message
        );
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
    };
  } catch (error) {
    console.error('tRPC context error:', error);

    return {
      user: null,
      session: null,
      supabaseAdmin,
      supabaseUser: supabase,
    };
  }
}
