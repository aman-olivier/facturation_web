import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://hkpoukidyayzhensnusk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcG91a2lkeWF5emhlbnNudXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4Mzc1NTAsImV4cCI6MjEwNTQxMzU1MH0.3OExl5pwNcNBGua3bdIBQoJ9RIX_CwgpEFMAtyZ7PO4')

async function check() {
  const { data, error } = await supabase.rpc('get_schema') // Might not exist
  if (error) {
    // try to fetch a row from quotes and clients to see structure
    const { data: q } = await supabase.from('quotes').select('*').limit(1)
    const { data: c } = await supabase.from('clients').select('*').limit(1)
    console.log("Quotes columns:", q ? Object.keys(q[0] || {}) : "none")
    console.log("Clients columns:", c ? Object.keys(c[0] || {}) : "none")
  }
}
check()
