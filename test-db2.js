import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://hkpoukidyayzhensnusk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcG91a2lkeWF5emhlbnNudXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4Mzc1NTAsImV4cCI6MjEwNTQxMzU1MH0.3OExl5pwNcNBGua3bdIBQoJ9RIX_CwgpEFMAtyZ7PO4')

async function check() {
  const { data, error } = await supabase.from('clients').select('id, name, email, phone, address, company, shipping_address').limit(1)
  console.log("Error:", error)
}
check()
