// Import Supabase client
import { createClient } from '@supabase/supabase-js'

// Use the same URL and anon key from your clients2.ts file
const supabaseUrl = 'https://dkgtlyhqrlvqfszihzak.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZ3RseWhxcmx2cWZzemloemFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDQzOTMsImV4cCI6MjA4OTU4MDM5M30.0zriGQGrF0TQZkU9UmLTNZvhQtaSXpzcrtLRrGwX1aE'

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "1_ingarasell@gmail.com",   // replace with one of your dummy users
    password: "TrialAccount#123"          // replace with that user’s password
  })

  if (error) {
    console.error("Login failed:", error.message)
  } else {
    console.log("Login success:", data.user)
  }
}

testLogin()
