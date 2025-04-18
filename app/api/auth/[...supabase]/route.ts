/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request) {
  const _supabase = createRouteHandlerClient({ cookies });
  // TODO: Implement your GET logic (e.g., session check, auth callback, etc.)
  return new Response('Not implemented', { status: 501 });
}

export async function POST(_request: Request) {
  const _supabase = createRouteHandlerClient({ cookies });
  // TODO: Implement your POST logic (e.g., sign in, sign out, etc.)
  return new Response('Not implemented', { status: 501 });
}