import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/contacts', '/settings', '/tasks', '/marketing'];
  const authRoutes = ['/log-in', '/sign-up', '/forgot-password'];

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL('/log-in', request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Copy cookies from supabaseResponse to the redirect response
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  }

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (user && isAuthRoute) {
    const redirectUrl = new URL('/dashboard', request.url);
    const response = NextResponse.redirect(redirectUrl);

    // Copy cookies from supabaseResponse to the redirect response
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.redirect() or similar, make
  // sure to:
  // 1. Pass the request in it, like so: NextResponse.redirect(url, { request })
  // 2. Copy over the cookies, like so: supabaseResponse.cookies.getAll().forEach(...)
  // 3. Change the supabaseResponse object before returning it.

  return supabaseResponse;
}
