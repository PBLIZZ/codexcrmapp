import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase/client';

/**
 * Fetches the current authenticated user
 * @returns Object containing user data and any error
 */
export async function fetchCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Updates the current user's password
 * @param password New password to set
 * @returns Object containing any error that occurred
 */
export async function updateUserPassword(password: string): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.updateUser({ password });
  return { error };
}

/**
 * Signs out the current user
 * @returns Object containing any error that occurred
 */
export async function signOutUser(): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Maps common Supabase error messages to user-friendly messages
 * @param errorMessage Original error message from Supabase
 * @returns User-friendly error message
 */
export function mapAuthErrorMessage(errorMessage: string): string {
  if (errorMessage.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  if (errorMessage.includes('rate limited')) {
    return 'Too many attempts. Please try again later.';
  }
  // Add more mappings as needed
  return errorMessage;
}
