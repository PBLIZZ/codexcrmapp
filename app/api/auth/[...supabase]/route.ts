import { handleAuth } from '@supabase/auth-helpers-nextjs';

export const GET = handleAuth();
export const POST = handleAuth();