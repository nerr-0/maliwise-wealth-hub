import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Replace with your Supabase project details
const supabaseUrl: string = 'https://dkgtlyhqrlvqfszihzak.supabase.co'
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZ3RseWhxcmx2cWZzemloemFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDQzOTMsImV4cCI6MjA4OTU4MDM5M30.0zriGQGrF0TQZkU9UmLTNZvhQtaSXpzcrtLRrGwX1aE'

// Strongly typed Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
