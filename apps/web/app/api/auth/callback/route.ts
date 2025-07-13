import { NextRequest, NextResponse } from 'next/server';

// Import the server client creator from our shared helper
import { createSupabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Validates that a redirect URL is safe by ensuring it's a relative path
 * within our application and not an external URL
 */
function validateRedirectPath(path: string | null): string {
  // Default safe path if none provided or validation fails
  const defaultPath = '/dashboard';

  // If no path or empty, use default
  if (!path || path.trim() === '') {
    return defaultPath;
  }

  // Only allow relative paths that start with / but not // (protocol-relative URLs)
  // Also reject paths with : which could be used for javascript: URLs
  if (path.startsWith('/') && !path.startsWith('//') && !path.includes(':')) {
    return path;
  }

  // If validation fails, return the default path
  return defaultPath;
}

/**
 * This route handles all auth callbacks including OAuth and magic links
 * It exchanges the authorization code for a session and redirects the user
 * Consolidates both /api/auth/callback and /api/auth/[...supabase] functionality
 */
export async function GET(req: NextRequest) {
  console.log('Auth callback triggered, processing authentication...');

  try {
    // Create Supabase client using the shared server helper
    const supabase = await createSupabaseServer();
    const { searchParams, origin } = new URL(req.url);
    const code = searchParams.get('code');
    const nextParam = searchParams.get('next');

    // Validate the next parameter to prevent open redirect vulnerabilities
    const safeRedirectPath = validateRedirectPath(nextParam);

    console.log(
      `Auth callback params - code present: ${!!code}, redirect path: ${safeRedirectPath}`
    );

    // If no code is present, we can't authenticate the user
    if (!code) {
      console.warn('No code parameter found in callback URL');
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    console.log('Successfully authenticated user');

    // Redirect to the validated path after successful auth
    return NextResponse.redirect(`${origin}${safeRedirectPath}`);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}
