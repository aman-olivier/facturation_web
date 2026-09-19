import { getSettings } from '@/app/settings/actions'
import { getClients } from '@/app/clients/actions'
import NewQuoteForm from './NewQuoteForm'

export default async function NewQuotePage() {
  const settings = await getSettings()
  const clients = await getClients()
  
  return <NewQuoteForm initialSettings={settings} clients={clients} />
}
