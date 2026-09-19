"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getClients() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data
}

export async function createClientRecord(clientData: { name: string, email?: string, phone?: string, address?: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clients').insert([clientData]).select().single()
  
  if (error) {
    console.error("Error creating client:", error)
    throw new Error("Impossible de créer le client")
  }

  revalidatePath('/clients')
  revalidatePath('/invoices/new')
  revalidatePath('/quotes/new')
  return { success: true, client: data }
}

export async function deleteClient(id: string) {
  const supabase = await createClient()
  await supabase.from('clients').delete().eq('id', id)
  revalidatePath('/clients')
}
