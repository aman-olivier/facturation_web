"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { addArticle, updateArticle, deleteArticle } from './actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

export default function ArticlesList({ initialArticles }: { initialArticles: any[] }) {
  const [articles, setArticles] = useState(initialArticles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  React.useEffect(() => {
    const closeDropdown = () => setOpenMenuId(null)
    window.addEventListener('click', closeDropdown)
    return () => window.removeEventListener('click', closeDropdown)
  }, [])

  const filteredArticles = articles.filter(a => 
    a.nom_article.toLowerCase().includes(search.toLowerCase()) || 
    a.code_article.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      code_article: formData.get('code_article'),
      nom_article: formData.get('nom_article'),
      designation: formData.get('designation'),
      prix_unitaire: Number(formData.get('prix_unitaire') || 0)
    }

    if (editingArticle) {
      await updateArticle(editingArticle.id, data)
      setArticles(articles.map(a => a.id === editingArticle.id ? { ...a, ...data } : a))
    } else {
      // Simulate optimistic insert, actions.ts will handle db
      await addArticle(data)
      window.location.reload()
    }
    
    setIsModalOpen(false)
    setEditingArticle(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      await deleteArticle(id)
      setArticles(articles.filter(a => a.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Rechercher un article..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => { setEditingArticle(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus size={16} /> Ajouter un article
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-0">
          <Table className="overflow-visible">
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-gray-600 w-32">Code</TableHead>
                <TableHead className="font-semibold text-gray-600">Nom de l'article</TableHead>
                <TableHead className="font-semibold text-gray-600">Désignation</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right w-32">Prix U.</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Aucun article trouvé.
                  </TableCell>
                </TableRow>
              )}
              {filteredArticles.map(article => (
                <TableRow key={article.id} className="group">
                  <TableCell className="font-medium text-gray-900">{article.code_article}</TableCell>
                  <TableCell className="font-semibold text-gray-900">{article.nom_article}</TableCell>
                  <TableCell className="text-gray-500 max-w-[300px] truncate">{article.designation}</TableCell>
                  <TableCell className="text-right font-medium text-gray-900">{formatCurrency(article.prix_unitaire)}</TableCell>
                  <TableCell>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === article.id ? null : article.id)
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                      
                      {openMenuId === article.id && (
                        <div 
                          className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            onClick={() => { setEditingArticle(article); setIsModalOpen(true); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => { handleDelete(article.id); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">{editingArticle ? 'Modifier l\'article' : 'Nouvel article'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingArticle(null); }} className="text-gray-400 hover:text-gray-600 font-medium">✕</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Code de l'article</label>
                  <Input name="code_article" required defaultValue={editingArticle?.code_article || ""} placeholder="Ex: ART-001" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Nom de l'article</label>
                  <Input name="nom_article" required defaultValue={editingArticle?.nom_article || ""} placeholder="Ex: Prestation Conseil" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Désignation (Description)</label>
                  <Input name="designation" defaultValue={editingArticle?.designation || ""} placeholder="Ex: Accompagnement stratégie" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Prix unitaire (FCFA)</label>
                  <Input name="prix_unitaire" type="number" required defaultValue={editingArticle?.prix_unitaire || ""} placeholder="Ex: 50000" />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
                <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingArticle(null); }}>Annuler</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingArticle ? 'Mettre à jour' : 'Ajouter l\'article'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
