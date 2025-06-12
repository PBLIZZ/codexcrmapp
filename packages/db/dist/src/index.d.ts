import { Database } from './database.types';
import { ProjectsRepository, HeadingsRepository, TasksRepository, ChecklistsRepository, TagsRepository, TaskDependenciesRepository, ContactsRepository, SessionsRepository, AiActionsRepository } from './repositories';
export * from './database.types';
export * from './models';
export { ProjectsRepository, HeadingsRepository, TasksRepository, ChecklistsRepository, TagsRepository, TaskDependenciesRepository, ContactsRepository, SessionsRepository, AiActionsRepository };
export { getSupabaseClient } from './utils/db-helpers';
/**
 * Create a database client with all repositories
 * @param supabaseUrl Supabase URL
 * @param supabaseKey Supabase API key
 * @returns Object with all repositories
 */
export declare function createDatabaseClient(supabaseUrl: string, supabaseKey: string): {
    projects: ProjectsRepository;
    headings: HeadingsRepository;
    tasks: TasksRepository;
    checklists: ChecklistsRepository;
    tags: TagsRepository;
    taskDependencies: TaskDependenciesRepository;
    contacts: {
        getAllContacts(): Promise<{
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        }[]>;
        getContactById(id: string): Promise<{
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        } | null>;
        getContactWithProfile(id: string): Promise<({
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        } & {
            profile?: any | null;
        }) | null>;
        createContact(contact: {
            id?: string;
            first_name: string;
            last_name: string;
            email?: string | null;
            phone?: string | null;
            profile_image_url?: string | null;
            tags?: string[] | null;
            notes?: string | null;
            user_id: string;
            created_at?: string;
            updated_at?: string;
        }): Promise<{
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        }>;
        createContactWithProfile(contact: {
            id?: string;
            first_name: string;
            last_name: string;
            email?: string | null;
            phone?: string | null;
            profile_image_url?: string | null;
            tags?: string[] | null;
            notes?: string | null;
            user_id: string;
            created_at?: string;
            updated_at?: string;
        }, profile: Omit<any, "contact_id" | "user_id">): Promise<{
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        } & {
            profile?: any | null;
        }>;
        updateContact(id: string, updates: {
            id?: string;
            first_name?: string;
            last_name?: string;
            email?: string | null;
            phone?: string | null;
            profile_image_url?: string | null;
            tags?: string[] | null;
            notes?: string | null;
            user_id?: string;
            created_at?: string;
            updated_at?: string;
        }): Promise<{
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        }>;
        deleteContact(id: string): Promise<boolean>;
        searchContacts(query: string): Promise<{
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        }[]>;
        getContactsWithWellnessGoals(): Promise<{
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        }[]>;
        getContactsByJourneyStage(stage: string): Promise<{
            id: string;
            first_name: string;
            last_name: string;
            email: string | null;
            phone: string | null;
            profile_image_url: string | null;
            tags: string[] | null;
            notes: string | null;
            user_id: string;
            created_at: string;
            updated_at: string;
        }[]>;
    };
    sessions: {
        getAllSessions(): Promise<any[]>;
        getSessionById(id: string): Promise<any | null>;
        getSessionWithDetails(id: string): Promise<any | null>;
        createSession(session: any): Promise<any>;
        updateSession(id: string, updates: any): Promise<any>;
        deleteSession(id: string): Promise<boolean>;
        getSessionsByContact(contactId: string): Promise<any[]>;
        getUpcomingSessions(limit?: number): Promise<any[]>;
        getSessionsByType(sessionType: string): Promise<any[]>;
        getSessionsNeedingFollowUp(): Promise<any[]>;
        updateSessionAiInsights(id: string, aiInsights: any): Promise<any>;
    };
    aiActions: {
        getAllAiActions(): Promise<any[]>;
        getAiActionById(id: string): Promise<any | null>;
        getAiActionWithDetails(id: string): Promise<any | null>;
        createAiAction(aiAction: any): Promise<any>;
        updateAiAction(id: string, updates: any): Promise<any>;
        deleteAiAction(id: string): Promise<boolean>;
        getAiActionsByContact(contactId: string): Promise<any[]>;
        getAiActionsBySession(sessionId: string): Promise<any[]>;
        getAiActionsByStatus(status: string): Promise<any[]>;
        getAiActionsByType(actionType: string): Promise<any[]>;
        updateAiActionStatus(id: string, status: string, feedback?: string): Promise<any>;
        markAiActionImplemented(id: string, feedback?: string): Promise<any>;
    };
    supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", any>;
};
