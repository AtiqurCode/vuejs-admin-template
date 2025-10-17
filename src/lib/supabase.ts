import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read: boolean
          data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          data?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          data?: any
          created_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          push_enabled: boolean
          email_enabled: boolean
          in_app_enabled: boolean
          push_subscription: any
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          push_enabled?: boolean
          email_enabled?: boolean
          in_app_enabled?: boolean
          push_subscription?: any
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          push_enabled?: boolean
          email_enabled?: boolean
          in_app_enabled?: boolean
          push_subscription?: any
          updated_at?: string
        }
      }
    }
  }
}