/**
 * Creates a Supabase client for use in Server Components, Server Actions, and Route Handlers.
 * This function encapsulates the logic for reading and writing cookies in a server context.
 *
 * IMPORTANT: This module can ONLY be imported in server contexts (Server Components, Route Handlers)
 * Do NOT import in Client Components or pages/ directory components.
 */
export declare function createServerClient(): Promise<import("@supabase/supabase-js").SupabaseClient<import("@codexcrm/database/src/database.types").Database, "public", {
    Tables: {
        contacts: {
            Row: {
                address_city: string | null;
                address_country: string | null;
                address_postal_code: string | null;
                address_street: string | null;
                client_since: string | null;
                communication_preferences: import("@codexcrm/database").Json | null;
                company_name: string | null;
                created_at: string;
                email: string;
                enriched_data: import("@codexcrm/database").Json | null;
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
                communication_preferences?: import("@codexcrm/database").Json | null;
                company_name?: string | null;
                created_at?: string;
                email: string;
                enriched_data?: import("@codexcrm/database").Json | null;
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
                communication_preferences?: import("@codexcrm/database").Json | null;
                company_name?: string | null;
                created_at?: string;
                email?: string;
                enriched_data?: import("@codexcrm/database").Json | null;
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
            Relationships: [{
                foreignKeyName: "contacts_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
}>>;
//# sourceMappingURL=server.d.ts.map