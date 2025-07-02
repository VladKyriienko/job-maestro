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
      advice: {
        Row: {
          active: boolean | null
          description: string | null
          id: number
          slug: string | null
          subtitle: string | null
          title: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id?: number
          slug?: string | null
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: number
          slug?: string | null
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      document: {
        Row: {
          active: boolean | null
          content: string
          id: number
          title: string
          type: string
        }
        Insert: {
          active?: boolean | null
          content: string
          id?: number
          title: string
          type: string
        }
        Update: {
          active?: boolean | null
          content?: string
          id?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          id: number
          question: string
        }
        Insert: {
          answer: string
          id?: number
          question: string
        }
        Update: {
          answer?: string
          id?: number
          question?: string
        }
        Relationships: []
      }
      job_categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          active: boolean | null
          contract_length: number | null
          contract_type: string | null
          created_at: string | null
          description: string | null
          hours_per_day: number | null
          id: number
          job_category: string | null
          job_type: string | null
          location: string | null
          modified_at: string | null
          posted_by: string | null
          salary: number | null
          title: string
        }
        Insert: {
          active?: boolean | null
          contract_length?: number | null
          contract_type?: string | null
          created_at?: string | null
          description?: string | null
          hours_per_day?: number | null
          id?: number
          job_category?: string | null
          job_type?: string | null
          location?: string | null
          modified_at?: string | null
          posted_by?: string | null
          salary?: number | null
          title: string
        }
        Update: {
          active?: boolean | null
          contract_length?: number | null
          contract_type?: string | null
          created_at?: string | null
          description?: string | null
          hours_per_day?: number | null
          id?: number
          job_category?: string | null
          job_type?: string | null
          location?: string | null
          modified_at?: string | null
          posted_by?: string | null
          salary?: number | null
          title?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          email: string | null
          first_name: string | null
          id: number
          job_title: string | null
          last_name: string | null
          resume_url: string | null
          role: string | null
          user_id: string | null
          working_status: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id?: number
          job_title?: string | null
          last_name?: string | null
          resume_url?: string | null
          role?: string | null
          user_id?: string | null
          working_status?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: number
          job_title?: string | null
          last_name?: string | null
          resume_url?: string | null
          role?: string | null
          user_id?: string | null
          working_status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
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
  public: {
    Enums: {},
  },
} as const

