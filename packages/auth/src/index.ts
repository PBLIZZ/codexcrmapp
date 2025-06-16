/**
 * @codexcrm/auth - Server-side authentication utilities
 * 
 * This package provides server-side auth utilities for the monorepo.
 * No client components or React context here - pure server-side utilities.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User, SupabaseClient } from '@supabase/supabase-js';

// Re-export types for consistency across the monorepo
export type { User } from '@supabase/supabase-js';

/**
 * Auth result type for server operations
 */
export type AuthResult = {
  user: User | null;
  error: Error | null;
};

/**
 * Create a server-side Supabase client with proper cookie handling
 */
export async function createAuthServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions, but is kept for safety.
          }
        },
      },
    }
  );
}

/**
 * Get the current authenticated user on the server
 * Returns user or null, doesn't redirect
 */
export async function getAuthUser(): Promise<AuthResult> {
  try {
    const supabase = await createAuthServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    return {
      user,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Auth error')
    };
  }
}

/**
 * Require authentication - redirects if not authenticated
 * Use this in pages that require auth
 */
export async function requireAuth(): Promise<User> {
  const { user, error } = await getAuthUser();

  if (!user || error) {
    redirect('/log-in');
  }

  return user;
}

/**
 * Get user ID safely (for database queries)
 */
export async function getUserId(): Promise<string | null> {
  const { user } = await getAuthUser();
  return user?.id || null;
}

/**
 * Check if user is authenticated (boolean)
 */
export async function isAuthenticated(): Promise<boolean> {
  const { user } = await getAuthUser();
  return !!user;
}

/**
 * Get user email safely
 */
export async function getUserEmail(): Promise<string | null> {
  const { user } = await getAuthUser();
  return user?.email || null;
}

/**
 * Server-side auth utilities for tRPC procedures
 */
export class AuthAPI {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async getUser(): Promise<AuthResult> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      return {
        user,
        error: error ? new Error(error.message) : null
      };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error : new Error('API Auth error')
      };
    }
  }

  async requireUser(): Promise<User> {
    const { user, error } = await this.getUser();
    
    if (!user || error) {
      throw new Error('Unauthorized');
    }
    
    return user;
  }
}