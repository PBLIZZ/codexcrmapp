/**
 * Server-side auth utilities that build on the shared auth package
 * These functions implement server-side auth helpers using Supabase
 */

import { createServerClient } from './server';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

/**
 * Creates a server-side Supabase client with the current request cookies
 */
export async function createAuthServerClient() {
  return createServerClient();
}

/**
 * Gets the authenticated user from the current request
 * Returns null if not authenticated
 */
export async function getAuthUser(): Promise<User | null> {
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

/**
 * Gets the authenticated user ID from the current request
 * Returns null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const user = await getAuthUser();
  return user?.id ?? null;
}

/**
 * Gets the authenticated user email from the current request
 * Returns null if not authenticated or if email is not available
 */
export async function getUserEmail(): Promise<string | null> {
  const user = await getAuthUser();
  return user?.email ?? null;
}

/**
 * Checks if the current request is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser();
  return user !== null;
}

/**
 * Requires authentication for a route
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
  const isAuthed = await isAuthenticated();
  if (!isAuthed) {
    redirect('/login');
  }
}

/**
 * Auth API utilities for server components and actions
 */
export const AuthAPI = {
  getUser: getAuthUser,
  getUserId,
  getUserEmail,
  isAuthenticated,
  requireAuth
}