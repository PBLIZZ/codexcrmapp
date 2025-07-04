export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export type Database = {
    public: {
        Tables: {
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
                Relationships: [
                    {
                        foreignKeyName: "contacts_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
        CompositeTypes: {};
    };
};
type DefaultSchema = Database["public"];
export type Tables<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName]["Row"] : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions]["Row"] : never;
export type Insertable<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName]["Insert"] : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions]["Insert"] : never;
export type Updatable<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
} ? U : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
} ? U : never : never;
export type Enums<DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | {
    schema: keyof Database;
}, EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"] : never = never> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName] : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions] : never;
export type CompositeTypes<PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | {
    schema: keyof Database;
}, CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"] : never = never> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
} ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName] : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions] : never;
export declare const Constants: {
    readonly public: {
        readonly Enums: {};
    };
};
export {};
//# sourceMappingURL=types.d.ts.map