// apps/web/middleware.ts

import * as Sentry from '@sentry/nextjs';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/', '/dashboard', '/contacts', '/tasks', '/calendar', '/messages', '/marketing', '/settings', '/groups'];
const publicOnlyPaths = ['/log-in', '/sign-up', '/forgot-password', '/reset-password', '/sign-up/confirmation'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // 1. Use the modern, non-deprecated cookie handling for middleware
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request: { headers: request.headers } });
            cookiesToSet.forEach(({ name, value, options }) => 
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // 2. Use only `getUser()`. It efficiently handles session refresh and is the source of truth.
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Log auth errors but don't block
    if (authError) { // ✅ Check the actual auth error
      Sentry.captureException(authError, { 
        tags: { context: 'middleware_auth' },
        extra: { pathname: request.nextUrl.pathname }
      });
    }

    const { pathname } = request.nextUrl;
    const isProtectedPath = protectedPaths.some(
      (path) => path === '/' ? pathname === path : pathname.startsWith(path)
    );
    const isPublicOnlyPath = publicOnlyPaths.includes(pathname);

    // 3. Handle redirects with focused logging
    if (isProtectedPath && !user) {
      const redirectUrl = new URL('/log-in', request.url);
      Sentry.captureMessage(`Redirecting unauthenticated user from ${pathname}`, 'info');
      return NextResponse.redirect(redirectUrl);
    }

    if (isPublicOnlyPath && user) {
      const redirectUrl = new URL('/', request.url);
      Sentry.captureMessage(`Redirecting authenticated user from ${pathname}`, 'info');
      return NextResponse.redirect(redirectUrl);
    }

    return response;  

  } catch (error) {
    // Fallback: log error but allow request to continue
    Sentry.captureException(error, { 
      tags: { context: 'middleware_critical' } 
    });
    return response;
  }
}
