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
      patients: {
        Row: {
          id: string
          created_at: string
          name: string
          date_of_birth: string
          medical_record_number: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          date_of_birth: string
          medical_record_number: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          date_of_birth?: string
          medical_record_number?: string
        }
      }
      examinations: {
        Row: {
          id: string
          created_at: string
          patient_id: string
          status: string
          notes: string
        }
        Insert: {
          id?: string
          created_at?: string
          patient_id: string
          status: string
          notes: string
        }
        Update: {
          id?: string
          created_at?: string
          patient_id?: string
          status?: string
          notes?: string
        }
      }
    }
  }
}