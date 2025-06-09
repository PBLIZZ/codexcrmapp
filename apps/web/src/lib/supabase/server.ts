// apps/web/src/lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@codexcrm/db'

// This should be a synchronous function
export function createClient() {
  // `cookies()` is not async, so no `await` is needed
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions, but is kept for safety.
          }
        },
      },
    }
  )
}


