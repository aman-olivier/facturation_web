import { getInvoiceById } from '../actions'
import InvoiceDetailClient from './InvoiceDetailClient'
import { notFound } from 'next/navigation'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const invoice = await getInvoiceById(resolvedParams.id)

  if (!invoice) {
    notFound()
  }

  return <InvoiceDetailClient invoice={invoice} />
}
