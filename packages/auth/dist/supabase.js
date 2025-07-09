// path: packages/auth/src/supabase.ts
import { createClient } from '@supabase/supabase-js';
// This is a client for AUTHENTICATION purposes ONLY.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey);
