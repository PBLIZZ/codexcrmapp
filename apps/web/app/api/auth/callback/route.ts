import { NextRequest, NextResponse } from 'next/server';
// Import the server client creator from our new helper
import { createSupabaseServer } from '@/lib/supabase/server'; 

export const dynamic = 'force-dynamic';

// This route handles the callback after a user completes OAuth (like Google sign-in)
export async function GET(req: NextRequest) {
  console.log('Auth callback triggered, processing authentication...');
  
  try {
    // Create Supabase client using the server helper
    const supabase = await createSupabaseServer(); 
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/dashboard';

    console.log(`Auth callback params - code: ${!!code}, redirecting to: ${next}`);
    
    if (code) {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(new URL('/sign-in?error=auth_callback_error', req.url));
      }
      
      console.log('Successfully authenticated user:', data.session?.user?.id);
    } else {
      console.warn('No code parameter found in callback URL');
    }

    // Redirect to the next parameter or dashboard as fallback
    // Add timestamp to force a fresh redirect and avoid caching issues
    const redirectUrl = new URL(`${next}?auth_success=${Date.now()}`, req.url);
    console.log(`Redirecting to: ${redirectUrl.toString()}`);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(new URL('/sign-in?error=unexpected_error', req.url));
  }
}
