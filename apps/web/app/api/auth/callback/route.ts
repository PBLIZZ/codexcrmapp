import { NextRequest, NextResponse } from 'next/server';

// Import the server client creator from our new helper
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
 * This route handles the callback after a user completes OAuth authentication
 * It exchanges the authorization code for a session and redirects the user
 */
export async function GET(req: NextRequest) {
  console.log('Auth callback triggered, processing authentication...');
  
  try {
    // Create Supabase client using the server helper
    const supabase = await createSupabaseServer(); 
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const nextParam = searchParams.get('next');
    
    // Validate the next parameter to prevent open redirect vulnerabilities
    const safeRedirectPath = validateRedirectPath(nextParam);
    
    console.log(`Auth callback params - code present: ${!!code}, redirect path: ${safeRedirectPath}`);
    
    // If no code is present, we can't authenticate the user
    if (!code) {
      console.warn('No code parameter found in callback URL');
      return NextResponse.redirect(new URL('/sign-in?error=missing_code', req.url));
    }
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL('/sign-in?error=auth_callback_error', req.url));
    }
    
    if (!data.session) {
      console.error('No session returned after code exchange');
      return NextResponse.redirect(new URL('/sign-in?error=no_session', req.url));
    }
    
    console.log('Successfully authenticated user:', data.session.user?.id);
    
    // Construct redirect URL properly using URL object and searchParams
    const redirectUrl = new URL(safeRedirectPath, req.url);
    // Add auth_success parameter with timestamp to prevent caching
    redirectUrl.searchParams.set('auth_success', Date.now().toString());
    
    console.log(`Redirecting to: ${redirectUrl.toString()}`);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(new URL('/sign-in?error=unexpected_error', req.url));
  }
}
