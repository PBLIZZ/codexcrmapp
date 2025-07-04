export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export type Database = {
    public: {
        Tables: {
            ai_actions: {
                Row: {
                    action_type: string;
                    contact_id: string | null;
                    context: Json | null;
                    created_at: string | null;
                    feedback: string | null;
                    id: string;
                    implementation_date: string | null;
                    implemented: boolean | null;
                    priority: string | null;
                    session_id: string | null;
                    status: string;
                    suggestion: string;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    action_type: string;
                    contact_id?: string | null;
                    context?: Json | null;
                    created_at?: string | null;
                    feedback?: string | null;
                    id?: string;
                    implementation_date?: string | null;
                    implemented?: boolean | null;
                    priority?: string | null;
                    session_id?: string | null;
                    status?: string;
                    suggestion: string;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    action_type?: string;
                    contact_id?: string | null;
                    context?: Json | null;
                    created_at?: string | null;
                    feedback?: string | null;
                    id?: string;
                    implementation_date?: string | null;
                    implemented?: boolean | null;
                    priority?: string | null;
                    session_id?: string | null;
                    status?: string;
                    suggestion?: string;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'ai_actions_contact_id_fkey';
                        columns: ['contact_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'ai_actions_session_id_fkey';
                        columns: ['session_id'];
                        isOneToOne: false;
                        referencedRelation: 'sessions';
                        referencedColumns: ['id'];
                    }
                ];
            };
            checklist_items: {
                Row: {
                    checklist_id: string;
                    completed: boolean | null;
                    created_at: string;
                    id: string;
                    position: number | null;
                    title: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    checklist_id: string;
                    completed?: boolean | null;
                    created_at?: string;
                    id?: string;
                    position?: number | null;
                    title: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    checklist_id?: string;
                    completed?: boolean | null;
                    created_at?: string;
                    id?: string;
                    position?: number | null;
                    title?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'checklist_items_checklist_id_fkey';
                        columns: ['checklist_id'];
                        isOneToOne: false;
                        referencedRelation: 'checklists';
                        referencedColumns: ['id'];
                    }
                ];
            };
            checklists: {
                Row: {
                    created_at: string;
                    description: string | null;
                    id: string;
                    position: number | null;
                    task_id: string;
                    title: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    position?: number | null;
                    task_id: string;
                    title: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    id?: string;
                    position?: number | null;
                    task_id?: string;
                    title?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'checklists_task_id_fkey';
                        columns: ['task_id'];
                        isOneToOne: false;
                        referencedRelation: 'tasks';
                        referencedColumns: ['id'];
                    }
                ];
            };
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
            headings: {
                Row: {
                    collapsed: boolean | null;
                    created_at: string;
                    id: string;
                    position: number | null;
                    project_id: string;
                    title: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    collapsed?: boolean | null;
                    created_at?: string;
                    id?: string;
                    position?: number | null;
                    project_id: string;
                    title: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    collapsed?: boolean | null;
                    created_at?: string;
                    id?: string;
                    position?: number | null;
                    project_id?: string;
                    title?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'headings_project_id_fkey';
                        columns: ['project_id'];
                        isOneToOne: false;
                        referencedRelation: 'projects';
                        referencedColumns: ['id'];
                    }
                ];
            };
            notes: {
                Row: {
                    action_items: Json[] | null;
                    ai_analysis: Json | null;
                    ai_tags: string[] | null;
                    contact_id: string;
                    content: string;
                    created_at: string;
                    id: string;
                    is_ai_generated: boolean | null;
                    key_topics: string[] | null;
                    sentiment: string | null;
                    session_id: string | null;
                    updated_at: string;
                    user_id: string;
                    visibility: string | null;
                };
                Insert: {
                    action_items?: Json[] | null;
                    ai_analysis?: Json | null;
                    ai_tags?: string[] | null;
                    contact_id: string;
                    content: string;
                    created_at?: string;
                    id?: string;
                    is_ai_generated?: boolean | null;
                    key_topics?: string[] | null;
                    sentiment?: string | null;
                    session_id?: string | null;
                    updated_at?: string;
                    user_id: string;
                    visibility?: string | null;
                };
                Update: {
                    action_items?: Json[] | null;
                    ai_analysis?: Json | null;
                    ai_tags?: string[] | null;
                    contact_id?: string;
                    content?: string;
                    created_at?: string;
                    id?: string;
                    is_ai_generated?: boolean | null;
                    key_topics?: string[] | null;
                    sentiment?: string | null;
                    session_id?: string | null;
                    updated_at?: string;
                    user_id?: string;
                    visibility?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'notes_client_id_fkey';
                        columns: ['contact_id'];
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
            project_tags: {
                Row: {
                    created_at: string;
                    id: string;
                    project_id: string;
                    tag_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    project_id: string;
                    tag_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    project_id?: string;
                    tag_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'project_tags_project_id_fkey';
                        columns: ['project_id'];
                        isOneToOne: false;
                        referencedRelation: 'projects';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'project_tags_tag_id_fkey';
                        columns: ['tag_id'];
                        isOneToOne: false;
                        referencedRelation: 'tags';
                        referencedColumns: ['id'];
                    }
                ];
            };
            projects: {
                Row: {
                    archived: boolean | null;
                    completed_at: string | null;
                    created_at: string;
                    description: string | null;
                    due_date: string | null;
                    id: string;
                    metadata: Json | null;
                    position: number | null;
                    repeat_config: Json | null;
                    status: string | null;
                    title: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    archived?: boolean | null;
                    completed_at?: string | null;
                    created_at?: string;
                    description?: string | null;
                    due_date?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    position?: number | null;
                    repeat_config?: Json | null;
                    status?: string | null;
                    title: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    archived?: boolean | null;
                    completed_at?: string | null;
                    created_at?: string;
                    description?: string | null;
                    due_date?: string | null;
                    id?: string;
                    metadata?: Json | null;
                    position?: number | null;
                    repeat_config?: Json | null;
                    status?: string | null;
                    title?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            relationship_events: {
                Row: {
                    contact_id: string;
                    created_at: string | null;
                    description: string | null;
                    event_date: string;
                    event_type: string;
                    id: string;
                    importance: number | null;
                    session_id: string | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    contact_id: string;
                    created_at?: string | null;
                    description?: string | null;
                    event_date: string;
                    event_type: string;
                    id?: string;
                    importance?: number | null;
                    session_id?: string | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    contact_id?: string;
                    created_at?: string | null;
                    description?: string | null;
                    event_date?: string;
                    event_type?: string;
                    id?: string;
                    importance?: number | null;
                    session_id?: string | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'relationship_events_contact_id_fkey';
                        columns: ['contact_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'relationship_events_session_id_fkey';
                        columns: ['session_id'];
                        isOneToOne: false;
                        referencedRelation: 'sessions';
                        referencedColumns: ['id'];
                    }
                ];
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
                    ai_insights: Json | null;
                    contact_id: string;
                    created_at: string;
                    duration_minutes: number | null;
                    follow_up_details: string | null;
                    follow_up_needed: boolean | null;
                    id: string;
                    key_topics: string[] | null;
                    location: string | null;
                    notes: string | null;
                    outcomes: string | null;
                    program_id: string | null;
                    sentiment: string | null;
                    service_id: string | null;
                    session_time: string;
                    session_type: string | null;
                    status: string | null;
                    updated_at: string;
                    user_id: string;
                    virtual_meeting_link: string | null;
                };
                Insert: {
                    ai_insights?: Json | null;
                    contact_id: string;
                    created_at?: string;
                    duration_minutes?: number | null;
                    follow_up_details?: string | null;
                    follow_up_needed?: boolean | null;
                    id?: string;
                    key_topics?: string[] | null;
                    location?: string | null;
                    notes?: string | null;
                    outcomes?: string | null;
                    program_id?: string | null;
                    sentiment?: string | null;
                    service_id?: string | null;
                    session_time: string;
                    session_type?: string | null;
                    status?: string | null;
                    updated_at?: string;
                    user_id?: string;
                    virtual_meeting_link?: string | null;
                };
                Update: {
                    ai_insights?: Json | null;
                    contact_id?: string;
                    created_at?: string;
                    duration_minutes?: number | null;
                    follow_up_details?: string | null;
                    follow_up_needed?: boolean | null;
                    id?: string;
                    key_topics?: string[] | null;
                    location?: string | null;
                    notes?: string | null;
                    outcomes?: string | null;
                    program_id?: string | null;
                    sentiment?: string | null;
                    service_id?: string | null;
                    session_time?: string;
                    session_type?: string | null;
                    status?: string | null;
                    updated_at?: string;
                    user_id?: string;
                    virtual_meeting_link?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'sessions_client_id_fkey';
                        columns: ['contact_id'];
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
            task_dependencies: {
                Row: {
                    created_at: string;
                    depends_on_task_id: string;
                    id: string;
                    task_id: string;
                };
                Insert: {
                    created_at?: string;
                    depends_on_task_id: string;
                    id?: string;
                    task_id: string;
                };
                Update: {
                    created_at?: string;
                    depends_on_task_id?: string;
                    id?: string;
                    task_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'task_dependencies_depends_on_task_id_fkey';
                        columns: ['depends_on_task_id'];
                        isOneToOne: false;
                        referencedRelation: 'tasks';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'task_dependencies_task_id_fkey';
                        columns: ['task_id'];
                        isOneToOne: false;
                        referencedRelation: 'tasks';
                        referencedColumns: ['id'];
                    }
                ];
            };
            task_history: {
                Row: {
                    action: string;
                    created_at: string;
                    id: string;
                    new_state: Json | null;
                    previous_state: Json | null;
                    task_id: string;
                };
                Insert: {
                    action: string;
                    created_at?: string;
                    id?: string;
                    new_state?: Json | null;
                    previous_state?: Json | null;
                    task_id: string;
                };
                Update: {
                    action?: string;
                    created_at?: string;
                    id?: string;
                    new_state?: Json | null;
                    previous_state?: Json | null;
                    task_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'task_history_task_id_fkey';
                        columns: ['task_id'];
                        isOneToOne: false;
                        referencedRelation: 'tasks';
                        referencedColumns: ['id'];
                    }
                ];
            };
            task_tags: {
                Row: {
                    created_at: string;
                    id: string;
                    tag_id: string;
                    task_id: string;
                };
                Insert: {
                    created_at?: string;
                    id?: string;
                    tag_id: string;
                    task_id: string;
                };
                Update: {
                    created_at?: string;
                    id?: string;
                    tag_id?: string;
                    task_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'task_tags_tag_id_fkey';
                        columns: ['tag_id'];
                        isOneToOne: false;
                        referencedRelation: 'tags';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'task_tags_task_id_fkey';
                        columns: ['task_id'];
                        isOneToOne: false;
                        referencedRelation: 'tasks';
                        referencedColumns: ['id'];
                    }
                ];
            };
            tasks: {
                Row: {
                    category: string | null;
                    completed_at: string | null;
                    created_at: string;
                    due_date: string | null;
                    heading_id: string | null;
                    id: string;
                    is_checklist_item: boolean | null;
                    metadata: Json | null;
                    notes: string | null;
                    parent_task_id: string | null;
                    position: number | null;
                    priority: string | null;
                    project_id: string | null;
                    repeat_config: Json | null;
                    status: string | null;
                    title: string;
                    updated_at: string;
                    user_id: string;
                };
                Insert: {
                    category?: string | null;
                    completed_at?: string | null;
                    created_at?: string;
                    due_date?: string | null;
                    heading_id?: string | null;
                    id?: string;
                    is_checklist_item?: boolean | null;
                    metadata?: Json | null;
                    notes?: string | null;
                    parent_task_id?: string | null;
                    position?: number | null;
                    priority?: string | null;
                    project_id?: string | null;
                    repeat_config?: Json | null;
                    status?: string | null;
                    title: string;
                    updated_at?: string;
                    user_id: string;
                };
                Update: {
                    category?: string | null;
                    completed_at?: string | null;
                    created_at?: string;
                    due_date?: string | null;
                    heading_id?: string | null;
                    id?: string;
                    is_checklist_item?: boolean | null;
                    metadata?: Json | null;
                    notes?: string | null;
                    parent_task_id?: string | null;
                    position?: number | null;
                    priority?: string | null;
                    project_id?: string | null;
                    repeat_config?: Json | null;
                    status?: string | null;
                    title?: string;
                    updated_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'tasks_heading_id_fkey';
                        columns: ['heading_id'];
                        isOneToOne: false;
                        referencedRelation: 'headings';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'tasks_parent_task_id_fkey';
                        columns: ['parent_task_id'];
                        isOneToOne: false;
                        referencedRelation: 'tasks';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'tasks_project_id_fkey';
                        columns: ['project_id'];
                        isOneToOne: false;
                        referencedRelation: 'projects';
                        referencedColumns: ['id'];
                    }
                ];
            };
            wellness_metrics: {
                Row: {
                    contact_id: string;
                    created_at: string | null;
                    id: string;
                    metric_name: string;
                    metric_value: Json;
                    notes: string | null;
                    recorded_date: string | null;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    contact_id: string;
                    created_at?: string | null;
                    id?: string;
                    metric_name: string;
                    metric_value: Json;
                    notes?: string | null;
                    recorded_date?: string | null;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    contact_id?: string;
                    created_at?: string | null;
                    id?: string;
                    metric_name?: string;
                    metric_value?: Json;
                    notes?: string | null;
                    recorded_date?: string | null;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'wellness_metrics_contact_id_fkey';
                        columns: ['contact_id'];
                        isOneToOne: false;
                        referencedRelation: 'contacts';
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
            get_ai_actions_by_status: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    status: string;
                    count: number;
                }[];
            };
            get_ai_actions_by_type: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    action_type: string;
                    count: number;
                }[];
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
            get_sessions_by_type: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    session_type: string;
                    count: number;
                }[];
            };
            update_task_positions: {
                Args: {
                    task_positions: Json[];
                };
                Returns: undefined;
            };
            update_checklist_positions: {
                Args: {
                    checklist_item_positions: Json[];
                };
                Returns: undefined;
            };
            update_heading_positions: {
                Args: {
                    heading_positions: Json[];
                };
                Returns: undefined;
            };
            get_task_category_counts: {
                Args: {
                    p_user_id: string;
                };
                Returns: {
                    category: string;
                    count: number;
                }[];
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
