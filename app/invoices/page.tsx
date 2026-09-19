import { getInvoices } from './actions'
import InvoicesList from './InvoicesList'

export default async function InvoicesPage() {
  const initialInvoices = await getInvoices()
  return <InvoicesList initialInvoices={initialInvoices} />
}
