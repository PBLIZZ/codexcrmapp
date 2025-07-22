import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * This route handles the callback from Supabase Auth when a user clicks
 * on a magic link in their email or when they complete the OAuth flow.
 * It sets the user's session cookie and redirects them to the dashboard.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Create a Supabase client using the request cookies
    const supabase = createRouteHandlerClient({ cookies });

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the dashboard page
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
