/**
 * @file /packages/auth/src/service.ts
 */
// Import the local auth client, NOT from @codexcrm/database
import { supabaseAuthClient } from './supabase';
/**
 * Fetches the current authenticated user
 * @returns Object containing user data and any error
 */
export async function fetchCurrentUser() {
    const { data: { user }, error, } = await supabaseAuthClient.auth.getUser();
    return { user, error };
}
/**
 * Updates the current user's password
 * @param password New password to set
 * @returns Object containing any error that occurred
 */
export async function updateUserPassword(password) {
    const { error } = await supabaseAuthClient.auth.updateUser({ password });
    return { error };
}
/**
 * Maps common Supabase error messages to user-friendly messages
 * @param errorMessage Original error message from Supabase
 * @returns User-friendly error message
 */
export function mapAuthErrorMessage(errorMessage) {
    if (errorMessage.includes('Password should be at least')) {
        return 'Password must be at least 6 characters long.';
    }
    if (errorMessage.includes('rate limited')) {
        return 'Too many attempts. Please try again later.';
    }
    // Add more mappings as needed
    return errorMessage;
}
