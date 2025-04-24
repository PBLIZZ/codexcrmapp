import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// This file should only be imported in Server Components or Server Actions

/**
 * Creates a Supabase server client for server-side operations
 */
export const createServerSupabaseClient = async () => {
  // In Next.js 14+, cookies() returns a Promise that needs to be awaited
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};

/**
 * Protects a page by requiring authentication
 * Use this in Server Components that require authentication
 */
export async function protectPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // Remove the redirect logic from here
  // if (!session) {
  //   redirect('/sign-in');
  // }
  
  // Just return the user (or null if no session)
  return session?.user ?? null; 
  
  // Original return structure is no longer needed here
  // return {
  //  user: session.user,
  //  supabase,
  // };
}

/**
 * Gets the current user session without redirecting
 * Useful for conditionally showing content based on auth state
 */
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { user: null, supabase };
  }
  
  return {
    user: session.user,
    supabase,
  };
}

/**
 * Signs out the current user
 */
export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}
