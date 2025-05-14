export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_postal_code: string | null
          address_state: string | null
          address_street: string | null
          company_name: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          enrichment_data: Json | null
          first_name: string
          id: string
          job_title: string | null
          last_name: string
          notes: string | null
          phone: string | null
          profile_image_url: string | null
          social_profiles: Json | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_state?: string | null
          address_street?: string | null
          company_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          enrichment_data?: Json | null
          first_name: string
          id?: string
          job_title?: string | null
          last_name: string
          notes?: string | null
          phone?: string | null
          profile_image_url?: string | null
          social_profiles?: Json | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_state?: string | null
          address_street?: string | null
          company_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          enrichment_data?: Json | null
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          profile_image_url?: string | null
          social_profiles?: Json | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      follow_ups: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: number
          notes: string | null
          session_id: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: never
          notes?: string | null
          session_id?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: never
          notes?: string | null
          session_id?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          client_id: string | null
          created_at: string
          id: number
          is_pinned: boolean
          note_text: string
          program_id: number | null
          session_id: number | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: never
          is_pinned?: boolean
          note_text: string
          program_id?: number | null
          session_id?: number | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: never
          is_pinned?: boolean
          note_text?: string
          program_id?: number | null
          session_id?: number | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          currency: string
          external_payment_id: string | null
          id: number
          method: string | null
          notes: string | null
          paid_at: string | null
          program_id: number | null
          service_id: number | null
          session_id: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          currency?: string
          external_payment_id?: string | null
          id?: never
          method?: string | null
          notes?: string | null
          paid_at?: string | null
          program_id?: number | null
          service_id?: number | null
          session_id?: number | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          currency?: string
          external_payment_id?: string | null
          id?: never
          method?: string | null
          notes?: string | null
          paid_at?: string | null
          program_id?: number | null
          service_id?: number | null
          session_id?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      program_enrollments: {
        Row: {
          client_id: string
          completion_date: string | null
          created_at: string
          enrolled_at: string
          id: number
          notes: string | null
          program_id: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          completion_date?: string | null
          created_at?: string
          enrolled_at?: string
          id?: never
          notes?: string | null
          program_id: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          completion_date?: string | null
          created_at?: string
          enrolled_at?: string
          id?: never
          notes?: string | null
          program_id?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_enrollments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: number
          name: string
          price: number | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: never
          name: string
          price?: number | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: never
          name?: string
          price?: number | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          id: number
          is_active: boolean
          name: string
          price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: never
          is_active?: boolean
          name: string
          price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: never
          is_active?: boolean
          name?: string
          price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      session_attendees: {
        Row: {
          attendance_status: string
          check_in_time: string | null
          client_id: string
          created_at: string
          id: number
          notes: string | null
          session_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          attendance_status?: string
          check_in_time?: string | null
          client_id: string
          created_at?: string
          id?: never
          notes?: string | null
          session_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          attendance_status?: string
          check_in_time?: string | null
          client_id?: string
          created_at?: string
          id?: never
          notes?: string | null
          session_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_attendees_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_attendees_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          client_id: string | null
          created_at: string
          end_time: string | null
          id: number
          location: string | null
          notes: string | null
          program_id: number | null
          service_id: number | null
          start_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          end_time?: string | null
          id?: never
          location?: string | null
          notes?: string | null
          program_id?: number | null
          service_id?: number | null
          start_time: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          end_time?: string | null
          id?: never
          location?: string | null
          notes?: string | null
          program_id?: number | null
          service_id?: number | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

