import { getQuoteById } from '../actions'
import QuoteDetailClient from './QuoteDetailClient'
import { notFound } from 'next/navigation'

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const quote = await getQuoteById(resolvedParams.id)

  if (!quote) {
    notFound()
  }

  return <QuoteDetailClient quote={quote} />
}
