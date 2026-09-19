import { getArticles } from './actions'
import ArticlesList from './ArticlesList'

export const metadata = {
  title: 'Catalogue des Articles - WebFacturation',
  description: 'Gérez votre catalogue d\'articles et de services',
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="flex-1 overflow-auto bg-gray-50/30">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden">
        <h1 className="text-xl font-bold text-gray-900">Catalogue des Articles</h1>
      </header>
      <main className="p-6">
        <ArticlesList initialArticles={articles} />
      </main>
    </div>
  )
}
