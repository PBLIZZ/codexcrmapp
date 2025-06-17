/**
 * @codexcrm/auth - Server-side authentication utilities
 *
 * This package provides server-side auth utilities for the monorepo.
 * No client components or React context here - pure server-side utilities.
 */
import type { User, SupabaseClient } from '@supabase/supabase-js';
export type { User } from '@supabase/supabase-js';
/**
 * Auth result type for server operations
 */
export type AuthResult = {
    user: User | null;
    error: Error | null;
};
/**
 * Create a server-side Supabase client with proper cookie handling
 */
export declare function createAuthServerClient(): Promise<SupabaseClient<any, "public", any>>;
/**
 * Get the current authenticated user on the server
 * Returns user or null, doesn't redirect
 */
export declare function getAuthUser(): Promise<AuthResult>;
/**
 * Require authentication - redirects if not authenticated
 * Use this in pages that require auth
 */
export declare function requireAuth(): Promise<User>;
/**
 * Get user ID safely (for database queries)
 */
export declare function getUserId(): Promise<string | null>;
/**
 * Check if user is authenticated (boolean)
 */
export declare function isAuthenticated(): Promise<boolean>;
/**
 * Get user email safely
 */
export declare function getUserEmail(): Promise<string | null>;
/**
 * Server-side auth utilities for tRPC procedures
 */
export declare class AuthAPI {
    private supabase;
    constructor(supabase: SupabaseClient);
    getUser(): Promise<AuthResult>;
    requireUser(): Promise<User>;
}
//# sourceMappingURL=index.d.ts.map