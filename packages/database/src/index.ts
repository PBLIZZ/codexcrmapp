import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { getSupabaseClient } from './utils/db-helpers';
import { 
  ProjectsRepository,
  HeadingsRepository,
  TasksRepository,
  ChecklistsRepository,
  TagsRepository,
  TaskDependenciesRepository,
  ContactsRepository,
  SessionsRepository,
  AiActionsRepository
} from './repositories';

// Export database types
export * from './database.types';

// Export models
export * from './models';

// Export repositories
export { 
  ProjectsRepository,
  HeadingsRepository,
  TasksRepository,
  ChecklistsRepository,
  TagsRepository,
  TaskDependenciesRepository,
  ContactsRepository,
  SessionsRepository,
  AiActionsRepository
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
    projects: new ProjectsRepository(supabase),
    headings: new HeadingsRepository(supabase),
    tasks: new TasksRepository(supabase),
    checklists: new ChecklistsRepository(supabase),
    tags: new TagsRepository(supabase),
    taskDependencies: new TaskDependenciesRepository(supabase),
    contacts: ContactsRepository, // These are objects, not classes
    sessions: SessionsRepository, // These are objects, not classes
    aiActions: AiActionsRepository, // These are objects, not classes
    supabase
  };
}
