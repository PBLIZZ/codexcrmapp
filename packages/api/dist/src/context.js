import { createServerClient } from '@codexcrm/auth';
import { supabaseAdmin } from './supabaseAdmin';
/** Builds tRPC context for each request */
export async function createContext({ req: _req, }) {
    // Create a supabase client using our custom implementation from @codexcrm/auth
    const supabase = await createServerClient();
    try {
        // Use getUser() as the primary authentication method (recommended by Supabase)
        const { data: { user }, error: userError, } = await supabase.auth.getUser();
        if (userError) {
            console.error('tRPC context error getting user:', userError.message);
        }
        // Only get session if needed for specific session-related data
        let session = null;
        if (user) {
            const { data: { session: sessionData }, error: sessionError, } = await supabase.auth.getSession();
            if (sessionError) {
                console.error('tRPC context error getting session:', sessionError.message);
            }
            else {
                session = sessionData;
            }
        }
        console.error('tRPC context auth status:', {
            authenticated: !!user,
            userId: user?.id,
            email: user?.email,
            cookiesFound: !!user,
        });
        return {
            user,
            session,
            supabaseAdmin,
            supabaseUser: supabase,
        };
    }
    catch (error) {
        console.error('tRPC context error:', error);
        return {
            user: null,
            session: null,
            supabaseAdmin,
            supabaseUser: supabase,
        };
    }
}
