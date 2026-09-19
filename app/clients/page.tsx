import { getClients } from "./actions"
import ClientsListClient from "./ClientsListClient"

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const clients = await getClients()

  return <ClientsListClient initialClients={clients} />
}
