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
      analytics_customer_segments: {
        Row: {
          business_id: string
          created_at: string
          criteria: Json
          customer_count: number | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          criteria: Json
          customer_count?: number | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          criteria?: Json
          customer_count?: number | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_customer_segments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_daily_stats: {
        Row: {
          active_customers: number | null
          business_id: string
          created_at: string
          date: string
          id: string
          new_customers: number | null
          revenue_cents: number | null
          total_points_earned: number | null
          total_points_redeemed: number | null
          total_stamps_earned: number | null
          total_stamps_redeemed: number | null
          total_transactions: number | null
          total_visits: number | null
          updated_at: string
        }
        Insert: {
          active_customers?: number | null
          business_id: string
          created_at?: string
          date: string
          id?: string
          new_customers?: number | null
          revenue_cents?: number | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          total_stamps_earned?: number | null
          total_stamps_redeemed?: number | null
          total_transactions?: number | null
          total_visits?: number | null
          updated_at?: string
        }
        Update: {
          active_customers?: number | null
          business_id?: string
          created_at?: string
          date?: string
          id?: string
          new_customers?: number | null
          revenue_cents?: number | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          total_stamps_earned?: number | null
          total_stamps_redeemed?: number | null
          total_transactions?: number | null
          total_visits?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_daily_stats_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          business_id: string
          created_at: string
          customer_id: string | null
          event_data: Json | null
          event_type: string
          id: string
          occurred_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_id?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          occurred_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_id?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          occurred_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          address: string
          business_id: string
          city: string
          coordinates: unknown | null
          country: string
          created_at: string
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address: string
          business_id: string
          city: string
          coordinates?: unknown | null
          country: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          business_id?: string
          city?: string
          coordinates?: unknown | null
          country?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          business_hours: Json | null
          business_type: string | null
          created_at: string
          description: string | null
          email: string
          id: string
          logo_url: string | null
          name: string
          onboarding_completed: boolean | null
          phone: string | null
          settings: Json | null
          social_links: Json | null
          theme_settings: Json | null
          user_id: string
          verification_approved_at: string | null
          verification_status: string | null
          verification_submitted_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: Json | null
          business_type?: string | null
          created_at?: string
          description?: string | null
          email: string
          id?: string
          logo_url?: string | null
          name: string
          onboarding_completed?: boolean | null
          phone?: string | null
          settings?: Json | null
          social_links?: Json | null
          theme_settings?: Json | null
          user_id: string
          verification_approved_at?: string | null
          verification_status?: string | null
          verification_submitted_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: Json | null
          business_type?: string | null
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          logo_url?: string | null
          name?: string
          onboarding_completed?: boolean | null
          phone?: string | null
          settings?: Json | null
          social_links?: Json | null
          theme_settings?: Json | null
          user_id?: string
          verification_approved_at?: string | null
          verification_status?: string | null
          verification_submitted_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      customer_cards: {
        Row: {
          card_id: string
          created_at: string
          customer_id: string
          id: string
          last_activity: string
          metadata: Json | null
          points: number
          stamps: number
          tier: string | null
        }
        Insert: {
          card_id: string
          created_at?: string
          customer_id: string
          id?: string
          last_activity?: string
          metadata?: Json | null
          points?: number
          stamps?: number
          tier?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          last_activity?: string
          metadata?: Json | null
          points?: number
          stamps?: number
          tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_cards_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_loyalty_cards: {
        Row: {
          customer_profile_id: string
          id: string
          joined_at: string
          last_activity: string
          loyalty_card_id: string
          points: number
          stamps: number
          tier: string | null
        }
        Insert: {
          customer_profile_id: string
          id?: string
          joined_at?: string
          last_activity?: string
          loyalty_card_id: string
          points?: number
          stamps?: number
          tier?: string | null
        }
        Update: {
          customer_profile_id?: string
          id?: string
          joined_at?: string
          last_activity?: string
          loyalty_card_id?: string
          points?: number
          stamps?: number
          tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_loyalty_cards_customer_profile_id_fkey"
            columns: ["customer_profile_id"]
            isOneToOne: false
            referencedRelation: "customer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_loyalty_cards_loyalty_card_id_fkey"
            columns: ["loyalty_card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_oxxkvd_cards: {
        Row: {
          business_id: string
          card_id: string
          created_at: string
          id: string
          last_activity: string
          points: number | null
          stamps: number | null
          tier: string | null
          user_email: string
        }
        Insert: {
          business_id: string
          card_id: string
          created_at?: string
          id?: string
          last_activity?: string
          points?: number | null
          stamps?: number | null
          tier?: string | null
          user_email: string
        }
        Update: {
          business_id?: string
          card_id?: string
          created_at?: string
          id?: string
          last_activity?: string
          points?: number | null
          stamps?: number | null
          tier?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_oxxkvd_cards_user_email_fkey"
            columns: ["user_email"]
            isOneToOne: false
            referencedRelation: "customer_oxxkvd_profiles"
            referencedColumns: ["user_email"]
          },
        ]
      }
      customer_oxxkvd_profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          user_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          user_email: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          user_email?: string
        }
        Relationships: []
      }
      customer_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          business_id: string
          created_at: string
          email: string
          id: string
          metadata: Json | null
          name: string
          phone: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          name: string
          phone?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_cards: {
        Row: {
          active: boolean
          business_id: string
          created_at: string
          design: Json
          id: string
          name: string
          rules: Json
          type: string
        }
        Insert: {
          active?: boolean
          business_id: string
          created_at?: string
          design?: Json
          id?: string
          name: string
          rules?: Json
          type: string
        }
        Update: {
          active?: boolean
          business_id?: string
          created_at?: string
          design?: Json
          id?: string
          name?: string
          rules?: Json
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_cards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string
          customer_card_id: string
          id: string
          metadata: Json | null
          points: number
          stamps: number
          type: string
        }
        Insert: {
          created_at?: string
          customer_card_id: string
          id?: string
          metadata?: Json | null
          points?: number
          stamps?: number
          type: string
        }
        Update: {
          created_at?: string
          customer_card_id?: string
          id?: string
          metadata?: Json | null
          points?: number
          stamps?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_card_id_fkey"
            columns: ["customer_card_id"]
            isOneToOne: false
            referencedRelation: "customer_loyalty_cards"
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
  public: {
    Enums: {},
  },
} as const
