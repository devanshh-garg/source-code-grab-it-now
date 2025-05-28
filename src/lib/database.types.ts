export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          address: string | null
          logo_url: string | null
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          settings?: Json
        }
      }
      loyalty_cards: {
        Row: {
          id: string
          created_at: string
          business_id: string
          name: string
          type: 'stamp' | 'points' | 'tier'
          design: Json
          rules: Json
          active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          business_id: string
          name: string
          type: 'stamp' | 'points' | 'tier'
          design: Json
          rules: Json
          active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          business_id?: string
          name?: string
          type?: 'stamp' | 'points' | 'tier'
          design?: Json
          rules?: Json
          active?: boolean
        }
      }
      customers: {
        Row: {
          id: string
          created_at: string
          business_id: string
          name: string
          email: string
          phone: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          business_id: string
          name: string
          email: string
          phone?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          business_id?: string
          name?: string
          email?: string
          phone?: string | null
          metadata?: Json
        }
      }
      customer_cards: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          card_id: string
          points: number
          stamps: number
          tier: string | null
          last_activity: string
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          card_id: string
          points?: number
          stamps?: number
          tier?: string | null
          last_activity?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          customer_id?: string
          card_id?: string
          points?: number
          stamps?: number
          tier?: string | null
          last_activity?: string
          metadata?: Json
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          customer_card_id: string
          type: 'earn' | 'redeem'
          points: number
          stamps: number
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          customer_card_id: string
          type: 'earn' | 'redeem'
          points?: number
          stamps?: number
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          customer_card_id?: string
          type?: 'earn' | 'redeem'
          points?: number
          stamps?: number
          metadata?: Json
        }
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
  }
}