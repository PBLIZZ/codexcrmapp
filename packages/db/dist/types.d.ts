export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export type Database = {
    public: {
        Tables: {
            contacts: {
                Row: {
                    birthday: string | null;
                    company_name: string | null;
                    created_at: string;
                    email: string;
                    enriched_data: Json | null;
                    enrichment_status: string | null;
                    full_name: string;
                    id: string;
                    job_title: string | null;
                    last_contacted_at: string | null;
                    linkedin_profile: string | null;
                    notes: string | null;
                    phone: string | null;
                    profile_image_url: string | null;
                    source: string | null;
                    tags: string | null;
                    twitter_profile: string | null;
                    updated_at: string;
                    user_id: string;
                    website: string | null;
                };
                Insert: {
                    birthday?: string | null;
                    company_name?: string | null;
                    created_at?: string;
                    email: string;
                    enriched_data?: Json | null;
                    enrichment_status?: string | null;
                    full_name: string;
                    id?: string;
                    job_title?: string | null;
                    last_contacted_at?: string | null;
                    linkedin_profile?: string | null;
                    notes?: string | null;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    source?: string | null;
                    tags?: string | null;
                    twitter_profile?: string | null;
                    updated_at?: string;
                    user_id: string;
                    website?: string | null;
                };
                Update: {
                    birthday?: string | null;
                    company_name?: string | null;
                    created_at?: string;
                    email?: string;
                    enriched_data?: Json | null;
                    enrichment_status?: string | null;
                    full_name?: string;
                    id?: string;
                    job_title?: string | null;
                    last_contacted_at?: string | null;
                    linkedin_profile?: string | null;
                    notes?: string | null;
                    phone?: string | null;
                    profile_image_url?: string | null;
                    source?: string | null;
                    tags?: string | null;
                    twitter_profile?: string | null;
                    updated_at?: string;
                    user_id?: string;
                    website?: string | null;
                };
                Relationships: [];
            };
            follow_ups: {
                Row: {
                    client_id: string;
                    completed: boolean;
                    created_at: string;
                    due_date: string;
                    id: string;
                    notes: string | null;
                    session_id: string | null;
                    type: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    client_id: string;
                    completed?: boolean;
                    created_at?: string;
                    due_date: string;
                    id?: string;
                    notes?: string | null;
                    session_id?: string | null;
                    type: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    client_id?: string;
                    completed?: boolean;
                    created_at?: string;
                    due_date?: string;
                    id?: string;
                    notes?: string | null;
                    session_id?: string | null;
                    type?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'follow_ups_client_id_fkey';
                        columns: ['client_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'follow_ups_session_id_fkey';
                        columns: ['session_id'];
                        isOneToOne: false;
                        referencedRelation: 'sessions';
                        referencedColumns: ['id'];
                    }
                ];
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
            notes: {
                Row: {
                    client_id: string;
                    content: string;
                    created_at: string;
                    id: string;
                    session_id: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    client_id: string;
                    content: string;
                    created_at?: string;
                    id?: string;
                    session_id?: string | null;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    client_id?: string;
                    content?: string;
                    created_at?: string;
                    id?: string;
                    session_id?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'notes_client_id_fkey';
                        columns: ['client_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'notes_session_id_fkey';
                        columns: ['session_id'];
                        isOneToOne: false;
                        referencedRelation: 'sessions';
                        referencedColumns: ['id'];
                    }
                ];
            };
            payments: {
                Row: {
                    amount: number;
                    client_id: string;
                    created_at: string;
                    id: string;
                    payment_date: string;
                    payment_method: string | null;
                    program_id: string | null;
                    status: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    amount: number;
                    client_id: string;
                    created_at?: string;
                    id?: string;
                    payment_date: string;
                    payment_method?: string | null;
                    program_id?: string | null;
                    status: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    amount?: number;
                    client_id?: string;
                    created_at?: string;
                    id?: string;
                    payment_date?: string;
                    payment_method?: string | null;
                    program_id?: string | null;
                    status?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'payments_client_id_fkey';
                        columns: ['client_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'payments_program_id_fkey';
                        columns: ['program_id'];
                        isOneToOne: false;
                        referencedRelation: 'programs';
                        referencedColumns: ['id'];
                    }
                ];
            };
            program_enrollments: {
                Row: {
                    client_id: string;
                    created_at: string;
                    enrollment_date: string;
                    id: string;
                    notes: string | null;
                    program_id: string;
                    status: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    client_id: string;
                    created_at?: string;
                    enrollment_date?: string;
                    id?: string;
                    notes?: string | null;
                    program_id: string;
                    status: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    client_id?: string;
                    created_at?: string;
                    enrollment_date?: string;
                    id?: string;
                    notes?: string | null;
                    program_id?: string;
                    status?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'program_enrollments_client_id_fkey';
                        columns: ['client_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'program_enrollments_program_id_fkey';
                        columns: ['program_id'];
                        isOneToOne: false;
                        referencedRelation: 'programs';
                        referencedColumns: ['id'];
                    }
                ];
            };
            programs: {
                Row: {
                    created_at: string;
                    description: string | null;
                    end_date: string | null;
                    id: string;
                    is_active: boolean | null;
                    name: string;
                    start_date: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    end_date?: string | null;
                    id?: string;
                    is_active?: boolean | null;
                    name: string;
                    start_date?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    end_date?: string | null;
                    id?: string;
                    is_active?: boolean | null;
                    name?: string;
                    start_date?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            services: {
                Row: {
                    created_at: string;
                    description: string | null;
                    duration_minutes: number | null;
                    id: string;
                    is_active: boolean | null;
                    name: string;
                    price: number | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    duration_minutes?: number | null;
                    id?: string;
                    is_active?: boolean | null;
                    name: string;
                    price?: number | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    duration_minutes?: number | null;
                    id?: string;
                    is_active?: boolean | null;
                    name?: string;
                    price?: number | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            session_attendees: {
                Row: {
                    attended: boolean;
                    client_id: string;
                    created_at: string;
                    id: string;
                    notes: string | null;
                    session_id: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    attended?: boolean;
                    client_id: string;
                    created_at?: string;
                    id?: string;
                    notes?: string | null;
                    session_id: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    attended?: boolean;
                    client_id?: string;
                    created_at?: string;
                    id?: string;
                    notes?: string | null;
                    session_id?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'session_attendees_client_id_fkey';
                        columns: ['client_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'session_attendees_session_id_fkey';
                        columns: ['session_id'];
                        isOneToOne: false;
                        referencedRelation: 'sessions';
                        referencedColumns: ['id'];
                    }
                ];
            };
            sessions: {
                Row: {
                    client_id: string;
                    created_at: string;
                    id: string;
                    notes: string | null;
                    program_id: string | null;
                    service_id: string | null;
                    session_time: string;
                    status: string | null;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    client_id: string;
                    created_at?: string;
                    id?: string;
                    notes?: string | null;
                    program_id?: string | null;
                    service_id?: string | null;
                    session_time: string;
                    status?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Update: {
                    client_id?: string;
                    created_at?: string;
                    id?: string;
                    notes?: string | null;
                    program_id?: string | null;
                    service_id?: string | null;
                    session_time?: string;
                    status?: string | null;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'sessions_client_id_fkey';
                        columns: ['client_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'sessions_program_id_fkey';
                        columns: ['program_id'];
                        isOneToOne: false;
                        referencedRelation: 'programs';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'sessions_service_id_fkey';
                        columns: ['service_id'];
                        isOneToOne: false;
                        referencedRelation: 'services';
                        referencedColumns: ['id'];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            can_manage_group: {
                Args: {
                    group_id: string;
                };
                Returns: boolean;
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
export type Tables<DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] & Database[DefaultSchemaTableNameOrOptions['schema']]['Views']) : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] & Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
    Row: infer R;
} ? R : never : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
    Row: infer R;
} ? R : never : never;
export type TablesInsert<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I;
} ? I : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I;
} ? I : never : never;
export type TablesUpdate<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U;
} ? U : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
} ? U : never : never;
export type Enums<DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | {
    schema: keyof Database;
}, EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'] : never = never> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName] : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions] : never;
export type CompositeTypes<PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | {
    schema: keyof Database;
}, CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'] : never = never> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
} ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName] : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions] : never;
export declare const Constants: {
    readonly public: {
        readonly Enums: {};
    };
};
export {};
//# sourceMappingURL=types.d.ts.map