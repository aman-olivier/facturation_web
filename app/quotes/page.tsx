import { getQuotes } from './actions'
import QuotesList from './QuotesList'

export default async function QuotesPage() {
  const initialQuotes = await getQuotes()
  return <QuotesList initialQuotes={initialQuotes} />
}
