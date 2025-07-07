export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_postal_code: string | null
          address_street: string | null
          client_since: string | null
          communication_preferences: Json | null
          company_name: string | null
          created_at: string
          email: string
          enriched_data: Json | null
          enrichment_status: string | null
          full_name: string
          id: string
          job_title: string | null
          last_assessment_date: string | null
          last_contacted_at: string | null
          notes: string | null
          phone: string | null
          phone_country_code: string | null
          profile_image_url: string | null
          referral_source: string | null
          relationship_status: string | null
          social_handles: string[] | null
          source: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
          website: string | null
          wellness_goals: string[] | null
          wellness_journey_stage: string | null
          wellness_status: string | null
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          client_since?: string | null
          communication_preferences?: Json | null
          company_name?: string | null
          created_at?: string
          email: string
          enriched_data?: Json | null
          enrichment_status?: string | null
          full_name: string
          id?: string
          job_title?: string | null
          last_assessment_date?: string | null
          last_contacted_at?: string | null
          notes?: string | null
          phone?: string | null
          phone_country_code?: string | null
          profile_image_url?: string | null
          referral_source?: string | null
          relationship_status?: string | null
          social_handles?: string[] | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
          website?: string | null
          wellness_goals?: string[] | null
          wellness_journey_stage?: string | null
          wellness_status?: string | null
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          client_since?: string | null
          communication_preferences?: Json | null
          company_name?: string | null
          created_at?: string
          email?: string
          enriched_data?: Json | null
          enrichment_status?: string | null
          full_name?: string
          id?: string
          job_title?: string | null
          last_assessment_date?: string | null
          last_contacted_at?: string | null
          notes?: string | null
          phone?: string | null
          phone_country_code?: string | null
          profile_image_url?: string | null
          referral_source?: string | null
          relationship_status?: string | null
          social_handles?: string[] | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
          website?: string | null
          wellness_goals?: string[] | null
          wellness_journey_stage?: string | null
          wellness_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    },
    Views: {},
    Functions: {},
    Enums: {},
    CompositeTypes: {},
  },
}

type DefaultSchema = Database["public"]

export type Tables<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Row"];

export type Insertable<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Insert"];

export type Updatable<
  TableName extends keyof DefaultSchema["Tables"]
> = DefaultSchema["Tables"][TableName]["Update"];

export type Enums<
  EnumName extends keyof DefaultSchema["Enums"]
> = DefaultSchema["Enums"][EnumName];

export type CompositeTypes<
  CompositeTypeName extends keyof DefaultSchema["CompositeTypes"]
> = DefaultSchema["CompositeTypes"][CompositeTypeName];

export const Constants = {
  public: {
    Enums: {},
  },
} as const
