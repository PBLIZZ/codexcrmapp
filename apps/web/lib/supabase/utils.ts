// apps/web/src/lib/supabase/utils.ts

import { type SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@codexcrm/db';
import { createClient as createBrowserClient } from './client';

// Keep these type aliases - they are great!
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

/**
 * Creates a browser client instance and returns a type-safe query builder.
 * This should ONLY be used in 'use client' components.
 * 
 * @example
 * // In a Client Component:
 * const { data, error } = await queryBrowserTyped('contacts')
 *   .select('*')
 *   .eq('id', contactId);
 */
export function queryBrowserTyped<T extends TableName>(table: T) {
  // Create a new client instance for this operation.
  const supabase = createBrowserClient();
  // No `as string` cast needed, `from` is already typed.
  return supabase.from(table);
}

/**
 * A type-safe query builder for server-side operations.
 * It REQUIRES an existing Supabase client instance created in a Server Component or Action.
 *
 * @param supabase - The Supabase client instance created with createClient() from './server'.
 * @param table - The name of the table to query.
 * @returns A type-safe query builder.
 *
 * @example
 * // In a Server Component:
 * import { createClient } from '@/lib/supabase/server';
 * import { queryServerTyped } from '@/lib/supabase/utils';
 * 
 * const supabase = await createClient();
 * const { data, error } = await queryServerTyped(supabase, 'contacts').select('*');
 */
export function queryServerTyped<T extends TableName>(
  supabase: SupabaseClient<Database>,
  table: T
) {
  // This function now just forwards the call with correct types.
  // No `as string` cast needed.
  return supabase.from(table);
}