import { createClient } from '@supabase/supabase-js'

// Put your Supabase URL and Service Role Key here
const SUPABASE_URL = "https://dkgtlyhqrlvqfszihzak.supabase.co"
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZ3RseWhxcmx2cWZzemloemFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAwNDM5MywiZXhwIjoyMDg5NTgwMzkzfQ.yUmAM6lDflwSlq4Dgz37QkhHkHKebWHQNdWpp3x6gJ8"

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)



async function migrateClients() {
  // Fetch clients with the new fixed_email column
  const { data: clients, error } = await supabase
    .from('clients')
    .select('client_id, fixed_email, password')

  if (error) {
    console.error("Error fetching clients:", error)
    return
  }

  for (const client of clients) {
    // Skip rows without valid fixed_email or password
    if (!client.fixed_email || !client.password) continue
    if (client.password.length < 6) continue

    const { data, error } = await supabase.auth.admin.createUser({
      email: client.fixed_email,   // use fixed_email instead of email
      password: client.password,   // must be plain text
      email_confirm: true
    })

    if (error) {
      console.error("Error creating user:", client.fixed_email, error.message)
    } else {
      console.log("Created user:", data.user.email)
    }
  }
}

migrateClients()
