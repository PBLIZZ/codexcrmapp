export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      contact_profiles: {
        Row: {
          contact_id: string;
          created_at: string | null;
          custom_fields: Json | null;
          detailed_bio: string | null;
          family_members: Json[] | null;
          health_metrics: Json | null;
          id: string;
          important_dates: Json | null;
          personality_traits: string[] | null;
          preferences: Json | null;
          updated_at: string | null;
          user_id: string;
          wellness_history: string | null;
        };
        Insert: {
          contact_id: string;
          created_at?: string | null;
          custom_fields?: Json | null;
          detailed_bio?: string | null;
          family_members?: Json[] | null;
          health_metrics?: Json | null;
          id?: string;
          important_dates?: Json | null;
          personality_traits?: string[] | null;
          preferences?: Json | null;
          updated_at?: string | null;
          user_id: string;
          wellness_history?: string | null;
        };
        Update: {
          contact_id?: string;
          created_at?: string | null;
          custom_fields?: Json | null;
          detailed_bio?: string | null;
          family_members?: Json[] | null;
          health_metrics?: Json | null;
          id?: string;
          important_dates?: Json | null;
          personality_traits?: string[] | null;
          preferences?: Json | null;
          updated_at?: string | null;
          user_id?: string;
          wellness_history?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contact_profiles_contact_id_fkey';
            columns: ['contact_id'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          }
        ];
      };
      contacts: {
        Row: {
          address_city: string | null;
          address_country: string | null;
          address_postal_code: string | null;
          address_street: string | null;
          client_since: string | null;
          communication_preferences: Json | null;
          company_name: string | null;
          created_at: string;
          email: string;
          enriched_data: Json | null;
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
          communication_preferences?: Json | null;
          company_name?: string | null;
          created_at?: string;
          email: string;
          enriched_data?: Json | null;
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
          communication_preferences?: Json | null;
          company_name?: string | null;
          created_at?: string;
          email?: string;
          enriched_data?: Json | null;
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
        Relationships: [
          {
            foreignKeyName: 'group_members_contact_id_fkey';
            columns: ['contact_id'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'group_members_group_id_fkey';
            columns: ['group_id'];
            isOneToOne: false;
            referencedRelation: 'groups';
            referencedColumns: ['id'];
          }
        ];
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
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_manage_group: {
        Args: { group_id: string };
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
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
