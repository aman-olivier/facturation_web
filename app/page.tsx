import { getInvoices } from './invoices/actions'
import DashboardClient from './Dashboard'

export default async function DashboardPage() {
  const initialInvoices = await getInvoices()
  return <DashboardClient initialInvoices={initialInvoices} />
}
