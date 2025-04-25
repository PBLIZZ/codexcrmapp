import { NextRequest, NextResponse } from 'next/server';
// Import the server client creator from our new helper
import { createSupabaseServer } from '@/lib/supabase/server'; 

export const dynamic = 'force-dynamic';

// This route handles the callback after a user completes OAuth (like Google sign-in)
export async function GET(req: NextRequest) {
  // Create Supabase client using the server helper
  const supabase = await createSupabaseServer(); 
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (code) {
    // Use exchangeCodeForSession from the client instance
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to dashboard as per the guide
  return NextResponse.redirect(new URL('/dashboard', req.url)); 
}
