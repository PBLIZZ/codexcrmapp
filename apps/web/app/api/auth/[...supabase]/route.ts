// /Users/peterjamesblizzard/projects/codexcrmapp/shadcn-supabase-app/apps/web/app/api/auth/[...supabase]/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// This route handles the callback after a user clicks the magic link or completes OAuth
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'; // Default redirect to home page

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
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
  } else {
     console.error('Supabase auth callback: No code found in query params.');
  }

  // Redirect the user to an error page with instructions
  // You should create a specific page for this at /auth/auth-code-error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}