"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, Download, MoreHorizontal, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Select } from "@/components/ui/Select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

import { updateQuoteStatus } from './actions'

// Quotes are now fetched from Supabase via initialQuotes

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

function getStatusBadge(status: string) {
  switch (status) {
    case "accepted":
      return <Badge variant="success">Accepté</Badge>
    case "validation":
      return <Badge variant="warning">En cours de validation</Badge>
    case "canceled":
      return <Badge variant="destructive">Annulé par le client</Badge>
    case "construction":
    default:
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">En construction</Badge>
  }
}

export default function QuotesList({ initialQuotes }: { initialQuotes: any[] }) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null)

  const updateStatus = async (id: string, dbId: string, newStatus: string) => {
    setOpenMenuId(null)
    await updateQuoteStatus(dbId, newStatus)
  }

  React.useEffect(() => {
    const closeDropdown = () => setOpenMenuId(null)
    window.addEventListener('click', closeDropdown)
    return () => window.removeEventListener('click', closeDropdown)
  }, [])
  
  const filteredQuotes = initialQuotes.filter(quote => {
    const matchesSearch = quote.client.toLowerCase().includes(search.toLowerCase()) || 
                          quote.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Devis</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos devis, propositions commerciales et marges.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hidden md:flex">
            <Download size={16} />
            Exporter
          </Button>
          <Link href="/quotes/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full md:w-auto">
              <Plus size={16} />
              Nouveau devis
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Rechercher un devis, un client..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <div className="w-[180px]">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="construction">En construction</option>
                <option value="validation">En cours de validation</option>
                <option value="accepted">Accepté</option>
                <option value="canceled">Annulé par le client</option>
              </Select>
            </div>
            <Button variant="outline" size="icon">
              <Filter size={16} />
            </Button>
          </div>
        </div>

        <CardContent className="p-0 border border-gray-100 rounded-xl bg-white pb-32">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[100px]">N°</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Montant (TTC)</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow 
                  key={quote.id} 
                  className="cursor-pointer"
                  onClick={() => router.push(`/quotes/${quote.id}`)}
                >
                  <TableCell className="font-medium text-gray-900">
                    <Link href={`/quotes/${quote.id}`} className="hover:text-blue-600 hover:underline">
                      {quote.id}
                    </Link>
                  </TableCell>
                  <TableCell>{quote.client}</TableCell>
                  <TableCell className="text-gray-500">{quote.date}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(quote.total)}</TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(quote.status)}
                  </TableCell>
                  <TableCell className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === quote.id ? null : quote.id)
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    
                    {openMenuId === quote.id && (
                      <div 
                        className="absolute right-10 top-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/quotes/${quote.id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                          Voir le détail du devis
                        </Link>
                        <Link href={`/quotes/${quote.id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                          Modifier le devis
                        </Link>
                        
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        
                        <div className="group/submenu relative">
                          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center justify-between">
                            Changer de statut
                            <ChevronRight size={14} className="text-gray-400" />
                          </button>
                          
                          {/* Sub-menu */}
                          <div className="absolute top-0 right-full mr-1 hidden group-hover/submenu:block w-44 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50">
                            <button onClick={() => updateStatus(quote.id, quote.db_id, 'construction')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              En construction
                            </button>
                            <button onClick={() => updateStatus(quote.id, quote.db_id, 'validation')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              En cours de validation
                            </button>
                            <button onClick={() => updateStatus(quote.id, quote.db_id, 'accepted')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              Accepté
                            </button>
                            <button onClick={() => updateStatus(quote.id, quote.db_id, 'canceled')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              Annulé par le client
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
