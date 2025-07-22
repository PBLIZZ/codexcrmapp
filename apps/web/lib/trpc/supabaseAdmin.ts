// packages/server/src/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_API_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);
