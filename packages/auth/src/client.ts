/**
 * Creates a Supabase client for use in the browser (Client Components).
 * This client is a singleton and manages its own state.
 */

import {
  createBrowserClient as _createBrowserClient,
  type CookieOptions,
} from '@supabase/ssr';
import type { Database } from '@codexcrm/database';

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables must be set'
    );
  }

  return _createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1];
        },
        set(name: string, value: string, options: CookieOptions) {
          document.cookie = `${name}=${value}; path=${options.path}; max-age=${options.maxAge}; SameSite=${options.sameSite}; secure`;
        },
        remove(name: string, options: CookieOptions) {
          document.cookie = `${name}=; path=${options.path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${options.sameSite}; secure`;
        },
      },
    }
  );
}