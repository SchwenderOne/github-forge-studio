export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      financial_transactions: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          household_id: string
          id: string
          paid_by: string
          split_with: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          description: string
          household_id: string
          id?: string
          paid_by: string
          split_with?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          household_id?: string
          id?: string
          paid_by?: string
          split_with?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      long_term_purchases: {
        Row: {
          created_at: string
          created_by: string
          household_id: string
          id: string
          name: string
          needed_by: string | null
          status: string
          total_cost: number
          user1_share: number
          user2_share: number
        }
        Insert: {
          created_at?: string
          created_by: string
          household_id: string
          id?: string
          name: string
          needed_by?: string | null
          status?: string
          total_cost: number
          user1_share: number
          user2_share: number
        }
        Update: {
          created_at?: string
          created_by?: string
          household_id?: string
          id?: string
          name?: string
          needed_by?: string | null
          status?: string
          total_cost?: number
          user1_share?: number
          user2_share?: number
        }
        Relationships: [
          {
            foreignKeyName: "long_term_purchases_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          created_at: string
          created_by: string
          household_id: string
          id: string
          image_url: string | null
          last_watered_by: string | null
          last_watered_date: string | null
          location: string | null
          name: string
          next_watering_date: string | null
          notes: string | null
          species: string | null
          updated_at: string
          watering_frequency_days: number
        }
        Insert: {
          created_at?: string
          created_by: string
          household_id: string
          id?: string
          image_url?: string | null
          last_watered_by?: string | null
          last_watered_date?: string | null
          location?: string | null
          name: string
          next_watering_date?: string | null
          notes?: string | null
          species?: string | null
          updated_at?: string
          watering_frequency_days?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          household_id?: string
          id?: string
          image_url?: string | null
          last_watered_by?: string | null
          last_watered_date?: string | null
          location?: string | null
          name?: string
          next_watering_date?: string | null
          notes?: string | null
          species?: string | null
          updated_at?: string
          watering_frequency_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "plants_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          household_id: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          household_id?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          household_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          cleaning_frequency_days: number
          created_at: string
          household_id: string
          id: string
          last_cleaned_by: string | null
          last_cleaned_date: string | null
          name: string
          next_assigned_to: string | null
        }
        Insert: {
          cleaning_frequency_days?: number
          created_at?: string
          household_id: string
          id?: string
          last_cleaned_by?: string | null
          last_cleaned_date?: string | null
          name: string
          next_assigned_to?: string | null
        }
        Update: {
          cleaning_frequency_days?: number
          created_at?: string
          household_id?: string
          id?: string
          last_cleaned_by?: string | null
          last_cleaned_date?: string | null
          name?: string
          next_assigned_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_items: {
        Row: {
          assigned_to: string | null
          completed: boolean
          cost: number | null
          created_at: string
          created_by: string
          household_id: string
          id: string
          name: string
          split_with: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed?: boolean
          cost?: number | null
          created_at?: string
          created_by: string
          household_id: string
          id?: string
          name: string
          split_with?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed?: boolean
          cost?: number | null
          created_at?: string
          created_by?: string
          household_id?: string
          id?: string
          name?: string
          split_with?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
