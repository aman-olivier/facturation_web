"use server"

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('companies').select('*').single()
  
  const defaultSettings = {
    companyName: "Ahimou Corp",
    email: "contact@ahimou.com",
    phone: "+225 01 23 45 67 89",
    website: "www.ahimou.com",
    address: "Plateau, Abidjan",
    postalCode: "BP 1234",
    country: "CI",
    rccm: "CI-ABJ-2023-B-1234",
    ncc: "1234567 A",
    currency: "XOF",
    taxRate: "18",
    invoiceFormat: "INV-YYYY-000",
    bankName: "Ecobank Côte d'Ivoire",
    accountHolder: "Ahimou Corp",
    iban: "CI001 00200 1234567890 12",
    notes: "Les paiements en retard entraîneront une pénalité de 10%. Le paiement est dû à réception de la facture."
  }

  if (error || !data) {
    return defaultSettings
  }

  return {
    companyName: data.name || defaultSettings.companyName,
    email: data.email || defaultSettings.email,
    phone: data.phone || defaultSettings.phone,
    website: data.website || defaultSettings.website,
    address: data.address || defaultSettings.address,
    postalCode: data.postal_code || defaultSettings.postalCode,
    country: data.country || defaultSettings.country,
    rccm: data.rccm || defaultSettings.rccm,
    ncc: data.ncc || defaultSettings.ncc,
    currency: data.currency || defaultSettings.currency,
    taxRate: data.tax_rate ? data.tax_rate.toString() : defaultSettings.taxRate,
    invoiceFormat: data.invoice_format || defaultSettings.invoiceFormat,
    bankName: data.bank_name || defaultSettings.bankName,
    accountHolder: data.account_holder || defaultSettings.accountHolder,
    iban: data.iban || defaultSettings.iban,
    notes: data.default_notes || defaultSettings.notes,
  }
}

export async function saveSettings(settings: any) {
  const supabase = await createClient()
  
  // Try to get the first company, since it's a single-tenant setup
  const { data: existing } = await supabase.from('companies').select('id').limit(1).single()

  const payload = {
    name: settings.companyName,
    email: settings.email,
    phone: settings.phone,
    website: settings.website,
    address: settings.address,
    postal_code: settings.postalCode,
    country: settings.country,
    rccm: settings.rccm,
    ncc: settings.ncc,
    currency: settings.currency,
    tax_rate: parseFloat(settings.taxRate) || 18,
    invoice_format: settings.invoiceFormat,
    bank_name: settings.bankName,
    account_holder: settings.accountHolder,
    iban: settings.iban,
    default_notes: settings.notes
  }

  if (existing) {
    await supabase.from('companies').update(payload).eq('id', existing.id)
  } else {
    await supabase.from('companies').insert([payload])
  }

  revalidatePath('/settings')
  return { success: true }
}
