'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const companyName = formData.get('companyName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('passwordConfirm') as string

  if (password !== passwordConfirm) {
    redirect('/signup?message=Les mots de passe ne correspondent pas.')
  }

  const data = {
    email,
    password,
    options: {
      data: {
        name,
        company_name: companyName,
      }
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/signup?message=Erreur de création: ${error.message}`)
  }

  revalidatePath('/', 'layout')
  
  if (authData?.session) {
    redirect('/')
  } else {
    redirect('/login?message=Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
  }
}
