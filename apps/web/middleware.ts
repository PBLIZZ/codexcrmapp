// apps/web/middleware.ts

import * as Sentry from '@sentry/nextjs';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = [
  '/',
  '/dashboard',
  '/contacts',
  '/tasks',
  '/calendar',
  '/messages',
  '/marketing',
  '/settings',
  '/groups',
];
const publicOnlyPaths = [
  '/log-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/sign-up/confirmation',
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  try {
    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
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

    // Get user and handle session refresh automatically
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      Sentry.captureException(authError, {
        tags: { context: 'middleware_auth' },
        extra: { pathname: request.nextUrl.pathname },
      });
    }

    const { pathname } = request.nextUrl;
    const isProtectedPath = protectedPaths.some((path) =>
      path === '/' ? pathname === path : pathname.startsWith(path)
    );
    const isPublicOnlyPath = publicOnlyPaths.includes(pathname);

    // Skip auth checks for API routes, _next static files, and other Next.js internals
    if (pathname.startsWith('/api/') || 
        pathname.startsWith('/_next/') || 
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/sitemap.xml') ||
        pathname.startsWith('/robots.txt')) {
      return response;
    }

    // Redirect unauthenticated users from protected paths
    if (isProtectedPath && !user) {
      const redirectUrl = new URL('/log-in', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      Sentry.captureMessage(`Redirecting unauthenticated user from ${pathname}`, 'info');
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth-only pages  
    if (isPublicOnlyPath && user) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/dashboard';
      const redirectUrl = new URL(redirectTo, request.url);
      Sentry.captureMessage(`Redirecting authenticated user from ${pathname}`, 'info');
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (error) {
    Sentry.captureException(error, {
      tags: { context: 'middleware_critical' },
      extra: { pathname: request.nextUrl.pathname },
    });
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
