import * as Sentry from '@sentry/nextjs';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

// Import the server client creator from our modern SSR helper
import { createClient } from '@/lib/supabase/server';

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
 * This route handles the callback after a user completes OAuth authentication
 * It exchanges the authorization code for a session and redirects the user
 */
export async function GET(req: NextRequest) {
  Sentry.captureMessage('Auth callback triggered, processing authentication...', 'info');

  try {
    // Create Supabase client using the modern SSR helper
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const nextParam = searchParams.get('next');

    // Validate the next parameter to prevent open redirect vulnerabilities
    const safeRedirectPath = validateRedirectPath(nextParam);

    Sentry.captureMessage(
      `Auth callback params - code present: ${!!code}, redirect path: ${safeRedirectPath}`,
      'debug'
    );

    // If no code is present, we can't authenticate the user
    if (!code) {
      Sentry.captureMessage('No code parameter found in callback URL', 'warning');
      return NextResponse.redirect(new URL('/sign-in?error=missing_code', req.url));
    }

    // Exchange the code for a session
    Sentry.captureMessage(
      `Auth Callback: Attempting to exchange code. Code present: ${!!code}, Next param: ${nextParam}`,
      'debug'
    );
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(`Auth Callback: Error exchanging code for session: ${error.message}`, error);
      Sentry.captureException(error, {
        extra: {
          context: 'Auth Callback: Error exchanging code for session',
          code,
          nextParam,
        },
      });
      // Log the redirect URL in case of error as well
      const errorRedirectUrl = req.nextUrl.clone();
      errorRedirectUrl.pathname = '/sign-in';
      errorRedirectUrl.searchParams.set('error', 'auth_callback_error');
      errorRedirectUrl.searchParams.set('error_description', error.message);
      Sentry.captureMessage(
        `Auth Callback: Redirecting to error page: ${errorRedirectUrl.toString()}`,
        'error'
      );
      console.error('Error exchanging code for session:', error); // Keep console.error as per user preference
      return NextResponse.redirect(new URL('/sign-in?error=auth_callback_error', req.url));
    }

    if (!data.session) {
      console.error('No session returned after code exchange');
      Sentry.captureMessage('No session returned after code exchange', 'error');
      return NextResponse.redirect(new URL('/sign-in?error=no_session', req.url));
    }

    Sentry.captureMessage(`Successfully authenticated user: ${data.session.user?.id}`, 'info');

    // Construct redirect URL properly using URL object and searchParams
    const redirectUrl = new URL(safeRedirectPath, req.url);
    // Add auth_success parameter with timestamp to prevent caching
    redirectUrl.searchParams.set('auth_success', Date.now().toString());

    if (data?.session) {
      Sentry.captureMessage(
        `Auth Callback: Successfully exchanged code. User ID: ${
          data.session.user.id
        }. Session Exists: ${!!data.session}.`,
        'info'
      );
      Sentry.captureMessage(
        `Auth Callback: Cookies should have been set by Supabase client.`,
        'debug'
      );
    } else if (!error) {
      Sentry.captureMessage(
        `Auth Callback: No error from exchangeCodeForSession, but no session data returned.`,
        'warning'
      );
    }

    Sentry.captureMessage(
      `Auth Callback: Redirecting to final target: ${redirectUrl.toString()}`,
      'info'
    );
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    Sentry.captureException(error, {
      extra: { context: 'Unexpected error in auth callback' },
    });
    return NextResponse.redirect(new URL('/sign-in?error=unexpected_error', req.url));
  }
}
