// apps/web/lib/supabase/utils.ts
import { Database } from '@codexcrm/db';

import { supabase } from './client';
import { createSupabaseServer } from './server';

// Type aliases for better readability
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

/**
 * Type-safe query function for contact components
 * @example
 * // In a contact component:
 * const { data, error } = await queryTyped('contacts')
 *   .select('*')
 *   .eq('contact_id', contactId);
 * 
 * // Types are correctly inferred
 * const contacts: Tables['contacts']['Row'][] = data;
 */
export function queryTyped<T extends TableName>(table: T) {
  return supabase.from(table as string);
}

/**
 * Type-safe query function for server components
 * @example
 * // In a server component:
 * const supabase = await createSupabaseServer();
 * const { data, error } = await queryServerTyped(supabase, 'contacts')
 *   .select('*')
 *   .eq('contact_id', contactId);
 * 
 * // Types are correctly inferred
 * const contacts: Tables['contacts']['Row'][] = data;
 */
export async function queryServerTyped<T extends TableName>(
  table: T,
  serverSupabasePromise = createSupabaseServer()
) {
  const supabaseInstance = await serverSupabasePromise;
  return supabaseInstance.from(table as string);
}
