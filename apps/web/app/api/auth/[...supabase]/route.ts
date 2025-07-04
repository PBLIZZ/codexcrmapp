import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

function validateRedirectPath(path: string | null): string {
  const defaultPath = '/dashboard';

  if (!path || path.trim() === '') {
    return defaultPath;
  }

  // Only allow relative paths that start with / but not // (protocol-relative URLs)
  // Also reject paths with : which could be used for javascript: URLs
  if (path.startsWith('/') && !path.startsWith('//') && !path.includes(':')) {
    return path;
  }

  return defaultPath;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = validateRedirectPath(searchParams.get('next'));

  if (!code) {
    console.error('No code parameter in auth callback');
    return NextResponse.redirect(`${origin}/log-in?error=missing_code`);
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      return NextResponse.redirect(`${origin}/log-in?error=auth_callback_error`);
    }

    if (!data.session) {
      console.error('No session returned after code exchange');
      return NextResponse.redirect(`${origin}/log-in?error=no_session`);
    }

    // Successfully authenticated - redirect to destination
    return NextResponse.redirect(`${origin}${next}`);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${origin}/log-in?error=unexpected_error`);
  }
}
