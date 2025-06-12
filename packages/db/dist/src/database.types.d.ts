export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: string;
                    title: string;
                    notes: string | null;
                    due_date: string | null;
                    is_completed: boolean;
                    is_repeating: boolean;
                    repeat_rule: string | null;
                    user_id: string;
                    created_at: string;
                    updated_at: string;
                    deleted_at: string | null;
                };
                Insert: {
                    id?: string;
                    title: string;
                    notes?: string | null;
                    due_date?: string | null;
                    is_completed?: boolean;
                    is_repeating?: boolean;
                    repeat_rule?: string | null;
                    user_id: string;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
                Update: {
                    id?: string;
                    title?: string;
                    notes?: string | null;
                    due_date?: string | null;
                    is_completed?: boolean;
                    is_repeating?: boolean;
                    repeat_rule?: string | null;
                    user_id?: string;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
            };
            headings: {
                Row: {
                    id: string;
                    title: string;
                    project_id: string;
                    position: number;
                    user_id: string;
                    created_at: string;
                    updated_at: string;
                    deleted_at: string | null;
                };
                Insert: {
                    id?: string;
                    title: string;
                    project_id: string;
                    position: number;
                    user_id: string;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
                Update: {
                    id?: string;
                    title?: string;
                    project_id?: string;
                    position?: number;
                    user_id?: string;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
            };
            tasks: {
                Row: {
                    id: string;
                    title: string;
                    notes: string | null;
                    status: string;
                    priority: string;
                    category: string;
                    due_date: string | null;
                    completion_date: string | null;
                    is_repeating: boolean;
                    repeat_rule: string | null;
                    project_id: string | null;
                    heading_id: string | null;
                    position: number;
                    user_id: string;
                    contact_id: string | null;
                    created_at: string;
                    updated_at: string;
                    deleted_at: string | null;
                };
                Insert: {
                    id?: string;
                    title: string;
                    notes?: string | null;
                    status?: string;
                    priority?: string;
                    category?: string;
                    due_date?: string | null;
                    completion_date?: string | null;
                    is_repeating?: boolean;
                    repeat_rule?: string | null;
                    project_id?: string | null;
                    heading_id?: string | null;
                    position: number;
                    user_id: string;
                    contact_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
                Update: {
                    id?: string;
                    title?: string;
                    notes?: string | null;
                    status?: string;
                    priority?: string;
                    category?: string;
                    due_date?: string | null;
                    completion_date?: string | null;
                    is_repeating?: boolean;
                    repeat_rule?: string | null;
                    project_id?: string | null;
                    heading_id?: string | null;
                    position?: number;
                    user_id?: string;
                    contact_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
            };
            checklists: {
                Row: {
                    id: string;
                    title: string;
                    is_completed: boolean;
                    task_id: string;
                    position: number;
                    user_id: string;
                    created_at: string;
                    updated_at: string;
                    deleted_at: string | null;
                };
                Insert: {
                    id?: string;
                    title: string;
                    is_completed?: boolean;
                    task_id: string;
                    position: number;
                    user_id: string;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
                Update: {
                    id?: string;
                    title?: string;
                    is_completed?: boolean;
                    task_id?: string;
                    position?: number;
                    user_id?: string;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
            };
            tags: {
                Row: {
                    id: string;
                    name: string;
                    color: string | null;
                    user_id: string;
                    created_at: string;
                    updated_at: string;
                    deleted_at: string | null;
                };
                Insert: {
                    id?: string;
                    name: string;
                    color?: string | null;
                    user_id: string;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
                Update: {
                    id?: string;
                    name?: string;
                    color?: string | null;
                    user_id?: string;
                    created_at?: string;
                    updated_at?: string;
                    deleted_at?: string | null;
                };
            };
            task_tags: {
                Row: {
                    id: string;
                    task_id: string;
                    tag_id: string;
                    user_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    task_id: string;
                    tag_id: string;
                    user_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    task_id?: string;
                    tag_id?: string;
                    user_id?: string;
                    created_at?: string;
                };
            };
            project_tags: {
                Row: {
                    id: string;
                    project_id: string;
                    tag_id: string;
                    user_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    project_id: string;
                    tag_id: string;
                    user_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    project_id?: string;
                    tag_id?: string;
                    user_id?: string;
                    created_at?: string;
                };
            };
            task_dependencies: {
                Row: {
                    id: string;
                    task_id: string;
                    depends_on_task_id: string;
                    user_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    task_id: string;
                    depends_on_task_id: string;
                    user_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    task_id?: string;
                    depends_on_task_id?: string;
                    user_id?: string;
                    created_at?: string;
                };
            };
            contacts: {
                Row: {
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
                };
                Insert: {
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
                };
                Update: {
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
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
