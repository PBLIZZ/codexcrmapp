// /Users/peterjamesblizzard/projects/codexcrmapp/apps/web/app/api/auth/[...supabase]/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Validates that a redirect path is safe (relative path starting with /)
 * @param path The path to validate
 * @returns A safe path that starts with /
 */
function getSafePath(path: string | null): string {
  // Default to home page if no path is provided
  if (!path) return '/';
  
  // Ensure path starts with / to prevent open redirect vulnerabilities
  if (!path.startsWith('/')) {
    console.warn(`Auth callback: Invalid 'next' parameter "${path}". Defaulting to '/'.`);
    return '/';
  }
  
  // Additional security: prevent protocol-relative URLs like //evil.com
  if (path.startsWith('//')) {
    console.warn(`Auth callback: Potentially malicious 'next' parameter "${path}". Defaulting to '/'.`);
    return '/';
  }
  
  return path;
}

// This route handles the callback after a user clicks the magic link or completes OAuth
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Safely handle the 'next' parameter to prevent open redirect vulnerabilities
  const next = getSafePath(searchParams.get('next'));

  if (code) {
    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Auth callback: Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
      return NextResponse.redirect(`${origin}/auth/config-error`);
    }

    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
          },
        }
      );
      
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Redirect to the next path after successful auth
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('Supabase code exchange error:', error.message);
    } catch (err) {
      console.error('Unexpected error during auth callback:', err);
    }
  } else {
    console.error('Auth callback: No code found in query params.');
  }

  // Redirect the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}