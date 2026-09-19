import { getSettings } from '@/app/settings/actions'
import { getClients } from '@/app/clients/actions'
import NewInvoiceForm from './NewInvoiceForm'

export default async function NewInvoicePage() {
  const settings = await getSettings()
  const clients = await getClients()
  
  // Clean up settings to pass safe formatted address
  const initialSettings = {
    companyName: settings.companyName,
    email: settings.email,
    address: `${settings.address || ''}, ${settings.postalCode || ''}, ${settings.country || ''}`.trim().replace(/^,|,$/g, ''),
    taxRate: Number(settings.taxRate) || 18,
    bankName: settings.bankName,
    iban: settings.iban,
    notes: settings.notes
  }

  return <NewInvoiceForm initialSettings={initialSettings} clients={clients} />
}
