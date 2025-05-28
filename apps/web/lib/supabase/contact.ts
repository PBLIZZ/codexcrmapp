// apps/web/lib/supabase/contact.ts
import { createBrowserClient } from '@supabase/ssr';

// Enhanced Supabase contact with debugging for authentication
const supabaseContact = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Add event listeners for auth state changes to help debug auth issues
supabaseContact.auth.onAuthStateChange((event, session) => {
  console.warn(`Supabase Auth State Change: ${event}`, { 
    sessionExists: !!session, 
    userId: session?.user?.id,
    timestamp: new Date().toISOString()
  });
});

// Export the enhanced contact
export const supabase = supabaseContact;

// Helper function to get the current user (useful for components)
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}