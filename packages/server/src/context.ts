import { createServerClient } from '@supabase/ssr';
import type { Session, User } from '@supabase/supabase-js';
// We use a custom cookie handling approach for tRPC context

import { supabaseAdmin } from './supabaseAdmin';

/** Shape of the tRPC context object */
export interface Context {
  user: User | null;
  session: Session | null;
  supabaseAdmin: typeof supabaseAdmin;
  supabaseUser: ReturnType<typeof createServerClient>;
}

/** Builds tRPC context for each request */
export async function createContext({ req }: { req: Request }): Promise<Context> {
  // Enhanced cookie handling for tRPC context creation
  // Get cookies from the request object
  const cookieHeader = req.headers.get('cookie') || '';
  
  // Function to parse cookies from the header
  const parseCookies = (cookieHeader: string) => {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) cookies[name] = decodeURIComponent(value);
    });
    return cookies;
  };
  
  const parsedCookies = parseCookies(cookieHeader);
  
  // Extract auth-related cookies (Supabase uses specific cookie names)
  const authCookies = Object.entries(parsedCookies)
    .filter(([key]) => key.includes('sb-') || key.includes('supabase'))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  console.error('tRPC context: Auth cookies found:', Object.keys(authCookies).length);
  
  // Create a supabase client with enhanced cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const value = parsedCookies[name];
          // Log when accessing auth cookies to debug
          if (name.includes('sb-') || name.includes('supabase')) {
            console.error(`tRPC context reading auth cookie: ${name}=${value ? '[EXISTS]' : '[NOT FOUND]'}`);
          }
          return value;
        },
        set(name, value, _options) {
          // We can't set cookies in API routes directly
          console.error(`tRPC context would set cookie: ${name}=${value ? '[VALUE]' : '[EMPTY]'}`);
        },
        remove(name, _options) {
          // We can't remove cookies in API routes directly
          console.error(`tRPC context would remove cookie: ${name}`);
        }
      }
    },
  );

  try {
    // Use getUser() as the primary authentication method (recommended by Supabase)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('tRPC context error getting user:', userError.message);
    }
    
    // Only get session if needed for specific session-related data
    let session = null;
    if (user) {
      const { data: { session: sessionData }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('tRPC context error getting session:', sessionError.message);
      } else {
        session = sessionData;
      }
    }

    // Log authentication status with more details
    console.warn('tRPC context auth status:', { 
      authenticated: !!user,
      userId: user?.id,
      email: user?.email,
      cookiesFound: Object.keys(authCookies).length > 0
    });

    return { 
      user, 
      session, 
      supabaseAdmin,
      supabaseUser: supabase // Include the user-scoped client in the context
    };
  } catch (error) {
    console.error('Unexpected error in tRPC context:', error);
    // Return context with null user and session to handle errors gracefully
    return {
      user: null,
      session: null,
      supabaseAdmin,
      supabaseUser: supabase
    };
  }
}