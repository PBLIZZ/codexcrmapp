import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// Define paths that require authentication
const protectedPaths = ['/', '/clients']; 

// Define paths that should be accessible only when logged out
const publicOnlyPaths = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: new Headers(request.headers), // Cloned headers
    },
  });

  const { pathname } = request.nextUrl;

  // Create Supabase client within middleware context
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) { 
          // Set request cookie with only name and value
          request.cookies.set({ name, value });
          // Recreate response object to apply request cookie changes
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Set response cookie with all options
          response.cookies.set({
            name,
            value,
            ...options, // Spread all options for response cookies
          });
        },
        remove(name: string, options: CookieOptions) { 
          // Remove request cookie by setting only name and empty value
          request.cookies.set({ name, value: '' });
           // Recreate response object to apply request cookie changes
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Set response cookie with maxAge 0 to remove it
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0, // Apply maxAge 0 to the response cookie
          });
        },
      },
    }
  );

  // Get session. This might refresh the token and update cookies via the setters above.
  const { data: { session } } = await supabase.auth.getSession();

  const isProtectedPath = protectedPaths.some(path => pathname === path || (path !== '/' && pathname.startsWith(path + '/')));
  const isPublicOnlyPath = publicOnlyPaths.includes(pathname);

  if (isProtectedPath && !session) {
    // Redirect to sign-in if trying to access protected path without session
    console.log(`Middleware: No session, redirecting from protected path ${pathname} to /sign-in`);
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicOnlyPath && session) {
    // Redirect to home page if trying to access sign-in/sign-up page with session
    console.log(`Middleware: Session exists, redirecting from public-only path ${pathname} to /`);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  console.log(`Middleware: Allowing request to ${pathname}. Session exists: ${!!session}`);
  // Allow request to proceed, potentially with updated cookies
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
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 