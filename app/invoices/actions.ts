"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getInvoices() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching invoices:", error)
    return []
  }

  // Format to match the expected format on the frontend
  return data.map((inv: any) => ({
    id: inv.invoice_number,
    db_id: inv.id,
    client: inv.client_name,
    total: Number(inv.total_amount),
    due: Number(inv.due_amount),
    status: inv.status,
    date: inv.issue_date ? new Date(inv.issue_date).toLocaleDateString('fr-FR') : "—"
  }))
}

export async function createInvoice(invoiceData: any, lines: any[]) {
  const supabase = await createClient()

  // Find existing company
  const { data: company } = await supabase.from('companies').select('id').limit(1).single()
  
  // Format dates for postgres (YYYY-MM-DD)
  const formatForDb = (dateStr: string) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
      const [d, m, y] = dateStr.split('/')
      return `${y}-${m}-${d}`
    }
    return dateStr
  }

  const { data: invoice, error: invoiceError } = await supabase.from('invoices').insert([{
    invoice_number: invoiceData.id,
    client_name: invoiceData.client,
    company_id: company?.id || null,
    status: invoiceData.status || 'draft',
    issue_date: formatForDb(invoiceData.date),
    due_date: invoiceData.dueDate ? formatForDb(invoiceData.dueDate) : null,
    total_amount: invoiceData.amount,
    due_amount: invoiceData.amount,
    tax_rate: invoiceData.taxRate || 18
  }]).select().single()

  if (invoiceError) {
    console.error("Error creating invoice:", invoiceError)
    throw new Error("Impossible de créer la facture")
  }

  if (lines && lines.length > 0) {
    const items = lines.map(line => ({
      invoice_id: invoice.id,
      description: line.description,
      quantity: line.quantity,
      unit_price: line.unitPrice,
      total: line.quantity * line.unitPrice
    }))
    
    await supabase.from('invoice_items').insert(items)
  }

  revalidatePath('/invoices')
  revalidatePath('/')
  return { success: true, invoiceId: invoice.id }
}

export async function updateInvoiceStatus(dbId: string, newStatus: string) {
  const supabase = await createClient()
  await supabase.from('invoices').update({ status: newStatus }).eq('id', dbId)
  revalidatePath('/invoices')
  revalidatePath('/')
}

export async function getInvoiceById(invoiceNumber: string) {
  const supabase = await createClient()
  
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select(`
      *,
      invoice_items (*)
    `)
    .eq('invoice_number', invoiceNumber)
    .single()

  if (error || !invoice) return null

  // Fetch company info for the header
  const { data: company } = await supabase.from('companies').select('*').eq('id', invoice.company_id).single()

  return {
    ...invoice,
    company,
    issue_date: invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('fr-FR') : "—",
    due_date: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('fr-FR') : "—"
  }
}

export async function deleteInvoice(dbId: string) {
  const supabase = await createClient()
  await supabase.from('invoices').delete().eq('id', dbId)
  revalidatePath('/invoices')
  revalidatePath('/')
}
