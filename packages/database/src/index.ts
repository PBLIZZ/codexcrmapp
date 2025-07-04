import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { getSupabaseClient } from './utils/db-helpers';
import { ContactsRepository } from './repositories';

// Export database types
export * from './database.types';

// Export repositories
export { 
  ContactsRepository,
};

// Export utility functions
export { getSupabaseClient } from './utils/db-helpers';

/**
 * Create a database client with all repositories
 * @param supabaseUrl Supabase URL
 * @param supabaseKey Supabase API key
 * @returns Object with all repositories
 */
export function createDatabaseClient(supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);
  
  return {
    contacts: ContactsRepository,
    supabase
  };
}
