// path: packages/auth/src/client.ts
/**
 * Creates a Supabase client for use in the browser (Client Components).
 * This client is a singleton and manages its own state.
 */
import { createBrowserClient as _createBrowserClient, } from '@supabase/ssr';
export function createBrowserClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables must be set');
    }
    // Use the new, non-deprecated cookie handling API
    return _createBrowserClient(supabaseUrl, supabaseKey, {
        cookies: {
            // The `getAll` method reads all cookies and returns them as an array of objects.
            getAll() {
                if (typeof document === 'undefined') {
                    // Return an empty array on the server
                    return [];
                }
                return document.cookie.split('; ').map(cookie => {
                    const [name, ...rest] = cookie.split('=');
                    return { name: name.trim(), value: rest.join('=') };
                });
            },
            // The `set` method handles setting, updating, and removing cookies.
            setAll(cookiesToSet) {
                if (typeof document === 'undefined') {
                    // Do nothing on the server
                    return;
                }
                cookiesToSet.forEach(({ name, value, options }) => {
                    let cookieString = `${name}=${encodeURIComponent(value)}; path=${options.path}; max-age=${options.maxAge}; SameSite=${options.sameSite};`;
                    if (options.secure) {
                        cookieString += ' secure;';
                    }
                    document.cookie = cookieString;
                });
            },
        },
    });
}
