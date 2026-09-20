import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import LandingPageClient from './LandingPageClient'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Si l'utilisateur est déjà connecté, on l'envoie vers le dashboard
  if (user) {
    redirect('/dashboard')
  }

  return <LandingPageClient />
}
