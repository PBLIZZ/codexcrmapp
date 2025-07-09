import type { User } from '@supabase/supabase-js';
/**
 * Fetches the current authenticated user
 * @returns Object containing user data and any error
 */
export declare function fetchCurrentUser(): Promise<{
    user: User | null;
    error: Error | null;
}>;
/**
 * Updates the current user's password
 * @param password New password to set
 * @returns Object containing any error that occurred
 */
export declare function updateUserPassword(password: string): Promise<{
    error: Error | null;
}>;
/**
 * Maps common Supabase error messages to user-friendly messages
 * @param errorMessage Original error message from Supabase
 * @returns User-friendly error message
 */
export declare function mapAuthErrorMessage(errorMessage: string): string;
//# sourceMappingURL=service.d.ts.map