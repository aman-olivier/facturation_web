"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getQuotes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching quotes:", error)
    return []
  }

  return data.map((q: any) => ({
    id: q.quote_number,
    db_id: q.id,
    client: q.client_name,
    total: Number(q.total_amount),
    status: q.status,
    date: q.issue_date ? new Date(q.issue_date).toLocaleDateString('fr-FR') : "—"
  }))
}

export async function createQuote(quoteData: any, lines: any[]) {
  const supabase = await createClient()

  const { data: company } = await supabase.from('companies').select('id').limit(1).single()
  
  const formatForDb = (dateStr: string) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
      const [d, m, y] = dateStr.split('/')
      return `${y}-${m}-${d}`
    }
    return dateStr
  }

  const { data: quote, error: quoteError } = await supabase.from('quotes').insert([{
    quote_number: quoteData.id,
    client_name: quoteData.client,
    company_id: company?.id || null,
    status: quoteData.status || 'building',
    issue_date: formatForDb(quoteData.date),
    total_amount: quoteData.amount,
    tax_rate: quoteData.taxRate || 18
  }]).select().single()

  if (quoteError) {
    console.error("Error creating quote:", quoteError)
    throw new Error("Impossible de créer le devis")
  }

  if (lines && lines.length > 0) {
    const items = lines.map(line => ({
      quote_id: quote.id,
      description: line.description,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      total: line.quantity * line.unitPrice
    }))
    
    await supabase.from('quote_items').insert(items)
  }

  revalidatePath('/quotes')
  return { success: true, quoteId: quote.id }
}

export async function updateQuoteStatus(dbId: string, newStatus: string) {
  const supabase = await createClient()
  await supabase.from('quotes').update({ status: newStatus }).eq('id', dbId)
  revalidatePath('/quotes')
}

export async function getQuoteById(quoteNumber: string) {
  const supabase = await createClient()
  
  const { data: quote, error } = await supabase
    .from('quotes')
    .select(`
      *,
      quote_items (*),
      quote_contacts (*)
    `)
    .eq('quote_number', quoteNumber)
    .single()

  if (error || !quote) return null

  // Fetch company info for the header
  const { data: company } = await supabase.from('companies').select('*').eq('id', quote.company_id).single()

  // Fetch all articles for the combobox
  const { data: articles } = await supabase.from('articles').select('*')

  return {
    ...quote,
    company,
    all_articles: articles || [],
    issue_date: quote.issue_date ? new Date(quote.issue_date).toLocaleDateString('fr-FR') : "—",
    updated_at: quote.updated_at ? new Date(quote.updated_at).toLocaleDateString('fr-FR') : "—"
  }
}

export async function deleteQuote(dbId: string) {
  const supabase = await createClient()
  await supabase.from('quotes').delete().eq('id', dbId)
  revalidatePath('/quotes')
}

export async function addQuoteContact(quoteId: string, data: any) {
  const supabase = await createClient()
  await supabase.from('quote_contacts').insert([{
    quote_id: quoteId,
    nom: data.nom,
    email: data.email,
    fournisseur_nom: data.fournisseur_nom,
    produits_fournis: data.produits_fournis
  }])
  revalidatePath('/quotes')
}

export async function updateQuoteContact(id: string, data: any) {
  const supabase = await createClient()
  await supabase.from('quote_contacts').update({
    nom: data.nom,
    email: data.email,
    fournisseur_nom: data.fournisseur_nom,
    produits_fournis: data.produits_fournis
  }).eq('id', id)
  revalidatePath('/quotes')
}

export async function deleteQuoteContact(id: string) {
  const supabase = await createClient()
  await supabase.from('quote_contacts').delete().eq('id', id)
  revalidatePath('/quotes')
}

export async function updateQuoteInfo(id: string, updates: { client_name?: string, notes?: string }) {
  const supabase = await createClient()
  await supabase.from('quotes').update({
    ...updates,
    updated_at: new Date().toISOString()
  }).eq('id', id)
  revalidatePath('/quotes/[id]', 'page')
}


