import type { Database } from '../database.types';
/**
 * Get or initialize the Supabase client
 * @param supabaseUrl The Supabase project URL
 * @param supabaseKey The Supabase API key
 * @returns A typed Supabase client instance
 */
export declare const getSupabaseClient: (supabaseUrl?: string, supabaseKey?: string) => import("@supabase/supabase-js").SupabaseClient<Database, "public", {
    Tables: {
        contact_profiles: {
            Row: {
                contact_id: string;
                created_at: string | null;
                custom_fields: import("..").Json | null;
                detailed_bio: string | null;
                family_members: import("..").Json[] | null;
                health_metrics: import("..").Json | null;
                id: string;
                important_dates: import("..").Json | null;
                personality_traits: string[] | null;
                preferences: import("..").Json | null;
                updated_at: string | null;
                user_id: string;
                wellness_history: string | null;
            };
            Insert: {
                contact_id: string;
                created_at?: string | null;
                custom_fields?: import("..").Json | null;
                detailed_bio?: string | null;
                family_members?: import("..").Json[] | null;
                health_metrics?: import("..").Json | null;
                id?: string;
                important_dates?: import("..").Json | null;
                personality_traits?: string[] | null;
                preferences?: import("..").Json | null;
                updated_at?: string | null;
                user_id: string;
                wellness_history?: string | null;
            };
            Update: {
                contact_id?: string;
                created_at?: string | null;
                custom_fields?: import("..").Json | null;
                detailed_bio?: string | null;
                family_members?: import("..").Json[] | null;
                health_metrics?: import("..").Json | null;
                id?: string;
                important_dates?: import("..").Json | null;
                personality_traits?: string[] | null;
                preferences?: import("..").Json | null;
                updated_at?: string | null;
                user_id?: string;
                wellness_history?: string | null;
            };
            Relationships: [{
                foreignKeyName: "contact_profiles_contact_id_fkey";
                columns: ["contact_id"];
                isOneToOne: false;
                referencedRelation: "contacts";
                referencedColumns: ["id"];
            }];
        };
        contacts: {
            Row: {
                address_city: string | null;
                address_country: string | null;
                address_postal_code: string | null;
                address_street: string | null;
                client_since: string | null;
                communication_preferences: import("..").Json | null;
                company_name: string | null;
                created_at: string;
                email: string;
                enriched_data: import("..").Json | null;
                enrichment_status: string | null;
                full_name: string;
                id: string;
                job_title: string | null;
                last_assessment_date: string | null;
                last_contacted_at: string | null;
                notes: string | null;
                phone: string | null;
                phone_country_code: string | null;
                profile_image_url: string | null;
                referral_source: string | null;
                relationship_status: string | null;
                social_handles: string[] | null;
                source: string | null;
                tags: string[] | null;
                updated_at: string;
                user_id: string;
                website: string | null;
                wellness_goals: string[] | null;
                wellness_journey_stage: string | null;
                wellness_status: string | null;
            };
            Insert: {
                address_city?: string | null;
                address_country?: string | null;
                address_postal_code?: string | null;
                address_street?: string | null;
                client_since?: string | null;
                communication_preferences?: import("..").Json | null;
                company_name?: string | null;
                created_at?: string;
                email: string;
                enriched_data?: import("..").Json | null;
                enrichment_status?: string | null;
                full_name: string;
                id?: string;
                job_title?: string | null;
                last_assessment_date?: string | null;
                last_contacted_at?: string | null;
                notes?: string | null;
                phone?: string | null;
                phone_country_code?: string | null;
                profile_image_url?: string | null;
                referral_source?: string | null;
                relationship_status?: string | null;
                social_handles?: string[] | null;
                source?: string | null;
                tags?: string[] | null;
                updated_at?: string;
                user_id: string;
                website?: string | null;
                wellness_goals?: string[] | null;
                wellness_journey_stage?: string | null;
                wellness_status?: string | null;
            };
            Update: {
                address_city?: string | null;
                address_country?: string | null;
                address_postal_code?: string | null;
                address_street?: string | null;
                client_since?: string | null;
                communication_preferences?: import("..").Json | null;
                company_name?: string | null;
                created_at?: string;
                email?: string;
                enriched_data?: import("..").Json | null;
                enrichment_status?: string | null;
                full_name?: string;
                id?: string;
                job_title?: string | null;
                last_assessment_date?: string | null;
                last_contacted_at?: string | null;
                notes?: string | null;
                phone?: string | null;
                phone_country_code?: string | null;
                profile_image_url?: string | null;
                referral_source?: string | null;
                relationship_status?: string | null;
                social_handles?: string[] | null;
                source?: string | null;
                tags?: string[] | null;
                updated_at?: string;
                user_id?: string;
                website?: string | null;
                wellness_goals?: string[] | null;
                wellness_journey_stage?: string | null;
                wellness_status?: string | null;
            };
            Relationships: [];
        };
        group_members: {
            Row: {
                contact_id: string;
                created_at: string;
                group_id: string;
                id: string;
            };
            Insert: {
                contact_id: string;
                created_at?: string;
                group_id: string;
                id?: string;
            };
            Update: {
                contact_id?: string;
                created_at?: string;
                group_id?: string;
                id?: string;
            };
            Relationships: [{
                foreignKeyName: "group_members_contact_id_fkey";
                columns: ["contact_id"];
                isOneToOne: false;
                referencedRelation: "contacts";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "group_members_group_id_fkey";
                columns: ["group_id"];
                isOneToOne: false;
                referencedRelation: "groups";
                referencedColumns: ["id"];
            }];
        };
        groups: {
            Row: {
                color: string | null;
                created_at: string;
                description: string | null;
                emoji: string | null;
                id: string;
                name: string;
                updated_at: string;
                user_id: string;
            };
            Insert: {
                color?: string | null;
                created_at?: string;
                description?: string | null;
                emoji?: string | null;
                id?: string;
                name: string;
                updated_at?: string;
                user_id: string;
            };
            Update: {
                color?: string | null;
                created_at?: string;
                description?: string | null;
                emoji?: string | null;
                id?: string;
                name?: string;
                updated_at?: string;
                user_id?: string;
            };
            Relationships: [];
        };
        tags: {
            Row: {
                color: string | null;
                created_at: string;
                id: string;
                name: string;
                updated_at: string;
                user_id: string;
            };
            Insert: {
                color?: string | null;
                created_at?: string;
                id?: string;
                name: string;
                updated_at?: string;
                user_id: string;
            };
            Update: {
                color?: string | null;
                created_at?: string;
                id?: string;
                name?: string;
                updated_at?: string;
                user_id?: string;
            };
            Relationships: [];
        };
    };
    Views: { [_ in never]: never; };
    Functions: {
        can_manage_group: {
            Args: {
                group_id: string;
            };
            Returns: boolean;
        };
        get_contacts_by_journey_stage: {
            Args: Record<PropertyKey, never>;
            Returns: {
                wellness_journey_stage: string;
                count: number;
            }[];
        };
        get_current_user_id: {
            Args: Record<PropertyKey, never>;
            Returns: string;
        };
    };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}>;
/**
 * Error handler for database operations
 * @param error The error object
 * @param operation Description of the operation that failed
 * @returns Formatted error object with error: true
 */
export declare const handleDbError: (error: any, operation: string) => {
    error: true;
    message: string;
    details: any;
};
/**
 * Safely execute a database operation with error handling
 * @param operation Function that performs the database operation
 * @param operationName Description of the operation for error reporting
 * @returns Result of the operation or error object
 */
export declare const safeDbOperation: <T>(operation: () => Promise<T>, operationName: string) => Promise<T | {
    error: true;
    message: string;
    details: any;
}>;
/**
 * Check if a result contains an error
 * @param result Result from a database operation
 * @returns True if the result is an error object
 */
export declare const isDbError: (result: any) => result is {
    error: true;
    message: string;
    details: any;
};
/**
 * Handle the result of a database operation, throwing an error if it's an error object
 * @param result Result from a database operation
 * @returns The result if it's not an error
 * @throws Error if the result is an error object
 */
export declare const handleDbResult: <T>(result: T | {
    error: true;
    message: string;
    details: any;
}) => T;
/**
 * Format a database query with parameters for logging
 * @param query SQL query string
 * @param params Query parameters
 * @returns Formatted query string
 */
export declare const formatQuery: (query: string, params?: any[]) => string;
/**
 * Log a database query for debugging
 * @param query SQL query string
 * @param params Query parameters
 */
export declare const logQuery: (query: string, params?: any[]) => void;
//# sourceMappingURL=db-helpers.d.ts.map