// apps/web/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

// Enhanced Supabase client with debugging for authentication
// Debug environment variables
console.log('🔍 Supabase Environment Variables:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
});

const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Add event listeners for auth state changes to help debug auth issues
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.warn(`Supabase Auth State Change: ${event}`, { 
    sessionExists: !!session, 
    userId: session?.user?.id,
    timestamp: new Date().toISOString()
  });
});

// Export the enhanced client
export const supabase = supabaseClient;

// Helper function to get the current user (useful for components)
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
