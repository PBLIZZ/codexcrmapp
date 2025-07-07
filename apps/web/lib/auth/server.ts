/** @file /apps/web/lib/auth/server.ts */

/**
 * Creates a Supabase client for use in Server Components, Server Actions, and Route Handlers.
 * This function encapsulates the logic for reading and writing cookies in a server context.
 * 
 * IMPORTANT: This module can ONLY be imported in server contexts (Server Components, Route Handlers)
 * Do NOT import in Client Components or pages/ directory components.
 */

import {
  createServerClient as _createServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@codexcrm/database';

export async function createServerClient() {
  // 1. Get the cookie store from the 'next/headers' package.
  // This is a dynamic function that can only be used in a server context.
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables must be set'
    );
  }

  return _createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            path: options?.path ?? '/',
            maxAge: options?.maxAge ?? 100 * 365 * 24 * 60 * 60,
            sameSite: options?.sameSite ?? 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
          });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({
            name,
            path: options?.path ?? '/',
            sameSite: options?.sameSite ?? 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        },
      },
    }
  );
}