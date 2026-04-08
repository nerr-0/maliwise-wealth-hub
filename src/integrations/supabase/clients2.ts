import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Replace with your Supabase project details
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY

// Strongly typed Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
