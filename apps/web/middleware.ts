// apps/web/middleware.ts

import * as Sentry from '@sentry/nextjs';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/', '/dashboard', '/contacts', '/groups'];
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

  // 1. Use the modern, non-deprecated cookie handling for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // The `setAll` function is required for the new API
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // 2. Use only `getUser()`. It efficiently handles session refresh and is the source of truth.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtectedPath = protectedPaths.some(
    (path) => path === '/' ? pathname === path : pathname.startsWith(path)
  );
  const isPublicOnlyPath = publicOnlyPaths.includes(pathname);

  // 3. Handle redirects with focused logging
  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/log-in', request.url);
    Sentry.captureMessage(`Redirecting unauthenticated user from ${pathname} to /log-in`, 'warning');
    return NextResponse.redirect(redirectUrl);
  }

  if (isPublicOnlyPath && user) {
    const redirectUrl = new URL('/dashboard', request.url);
    Sentry.captureMessage(`Redirecting authenticated user (ID: ${user.id}) from ${pathname} to /dashboard`, 'warning');
    return NextResponse.redirect(redirectUrl);
  }

  // If no redirect, return the response. Any updated auth cookies are already set.
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, e.g., tRPC)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};