import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Define paths that require authentication
const protectedPaths = ['/', '/dashboard', '/contacts', '/contacts', '/groups'];

// Define paths that should be accessible only when logged out
// Auth-related pages that should only be accessible when NOT logged in
const publicOnlyPaths = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/sign-up/confirmation'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // First get the user with getUser() for secure authentication verification
  const { data: { user } } = await supabase.auth.getUser();
  
  // We can still use getSession() to get the session if needed
  const { data: { session: _session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isProtectedPath = protectedPaths.some(path => pathname === path || (path !== '/' && pathname.startsWith(path + '/')));
  const isPublicOnlyPath = publicOnlyPaths.includes(pathname);

  // Use authenticated user object from getUser() for protection checks
  if (isProtectedPath && !user) {
    console.warn(`Middleware: No authenticated user, redirecting from protected path ${pathname} to /sign-in`);
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicOnlyPath && user) {
    console.warn(`Middleware: Authenticated user exists, redirecting from public-only path ${pathname} to /dashboard`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  console.warn(`Middleware: Allowing request to ${pathname}. Authenticated user exists: ${!!user}`);
  return response; 
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static image files, if you have an /images folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 