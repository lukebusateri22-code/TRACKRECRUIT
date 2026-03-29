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
      profiles: {
        Row: {
          id: string
          user_id: string
          role: 'athlete' | 'coach' | 'admin'
          first_name: string
          last_name: string
          email: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'athlete' | 'coach' | 'admin'
          first_name: string
          last_name: string
          email: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'athlete' | 'coach' | 'admin'
          first_name?: string
          last_name?: string
          email?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      athlete_profiles: {
        Row: {
          id: string
          profile_id: string
          school_name: string
          graduation_year: number
          location: string
          state: string
          gpa: number
          sat_score: number | null
          act_score: number | null
          height: string | null
          weight: number | null
          phone: string | null
          instagram: string | null
          twitter: string | null
          bio: string | null
          profile_photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          school_name: string
          graduation_year: number
          location: string
          state: string
          gpa: number
          sat_score?: number | null
          act_score?: number | null
          height?: string | null
          weight?: number | null
          phone?: string | null
          instagram?: string | null
          twitter?: string | null
          bio?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          school_name?: string
          graduation_year?: number
          location?: string
          state?: string
          gpa?: number
          sat_score?: number | null
          act_score?: number | null
          height?: string | null
          weight?: number | null
          phone?: string | null
          instagram?: string | null
          twitter?: string | null
          bio?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coach_profiles: {
        Row: {
          id: string
          profile_id: string
          university_name: string
          position: string
          phone: string | null
          office_location: string | null
          bio: string | null
          profile_photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          university_name: string
          position: string
          phone?: string | null
          office_location?: string | null
          bio?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          university_name?: string
          position?: string
          phone?: string | null
          office_location?: string | null
          bio?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      personal_records: {
        Row: {
          id: string
          athlete_profile_id: string
          event: string
          performance: string
          date: string
          meet_name: string
          location: string
          is_personal_best: boolean
          created_at: string
        }
        Insert: {
          id?: string
          athlete_profile_id: string
          event: string
          performance: string
          date: string
          meet_name: string
          location: string
          is_personal_best?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          athlete_profile_id?: string
          event?: string
          performance?: string
          date?: string
          meet_name?: string
          location?: string
          is_personal_best?: boolean
          created_at?: string
        }
      }
      meet_results: {
        Row: {
          id: string
          athlete_profile_id: string
          meet_name: string
          meet_date: string
          location: string
          event: string
          performance: string
          place: string
          points: number
          is_pr: boolean
          created_at: string
        }
        Insert: {
          id?: string
          athlete_profile_id: string
          meet_name: string
          meet_date: string
          location: string
          event: string
          performance: string
          place: string
          points: number
          is_pr?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          athlete_profile_id?: string
          meet_name?: string
          meet_date?: string
          location?: string
          event?: string
          performance?: string
          place?: string
          points?: number
          is_pr?: boolean
          created_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          athlete_profile_id: string
          title: string
          url: string
          event: string
          date: string
          thumbnail_url: string | null
          views: number
          created_at: string
        }
        Insert: {
          id?: string
          athlete_profile_id: string
          title: string
          url: string
          event: string
          date: string
          thumbnail_url?: string | null
          views?: number
          created_at?: string
        }
        Update: {
          id?: string
          athlete_profile_id?: string
          title?: string
          url?: string
          event?: string
          date?: string
          thumbnail_url?: string | null
          views?: number
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      watchlist: {
        Row: {
          id: string
          coach_profile_id: string
          athlete_profile_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          coach_profile_id: string
          athlete_profile_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          coach_profile_id?: string
          athlete_profile_id?: string
          notes?: string | null
          created_at?: string
        }
      }
      verification_requests: {
        Row: {
          id: string
          profile_id: string
          status: 'pending' | 'approved' | 'rejected'
          document_urls: string[]
          school_email: string
          verification_email: string | null
          notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          status?: 'pending' | 'approved' | 'rejected'
          document_urls: string[]
          school_email: string
          verification_email?: string | null
          notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          document_urls?: string[]
          school_email?: string
          verification_email?: string | null
          notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
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
      user_role: 'athlete' | 'coach' | 'admin'
      verification_status: 'pending' | 'approved' | 'rejected'
    }
  }
}
