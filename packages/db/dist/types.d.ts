export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export interface Database {
    public: {
        Tables: {
            clients: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    email: string | null;
                    phone: string | null;
                    status: string;
                    user_id: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    email?: string | null;
                    phone?: string | null;
                    status?: string;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    name?: string;
                    email?: string | null;
                    phone?: string | null;
                    status?: string;
                    user_id?: string;
                };
            };
            profiles: {
                Row: {
                    id: string;
                    created_at: string;
                    updated_at: string | null;
                    email: string | null;
                    full_name: string | null;
                    avatar_url: string | null;
                };
                Insert: {
                    id: string;
                    created_at?: string;
                    updated_at?: string | null;
                    email?: string | null;
                    full_name?: string | null;
                    avatar_url?: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    updated_at?: string | null;
                    email?: string | null;
                    full_name?: string | null;
                    avatar_url?: string | null;
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
    };
}
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Client = Tables<'clients'>;
export type Profile = Tables<'profiles'>;
//# sourceMappingURL=types.d.ts.map