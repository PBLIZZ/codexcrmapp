// apps/web/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// It is important to create a single instance of the client
// and export it for use across your client components.
export function createClient() {
  return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

