"use client"

import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import { Plus, Download, MoreHorizontal, RefreshCw, Search, ChevronRight } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

import { updateInvoiceStatus } from './invoices/actions'

export default function DashboardClient({ initialInvoices }: { initialInvoices: any[] }) {
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("date_desc")
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null)

  const updateStatus = async (dbId: string, newStatus: string) => {
    setOpenMenuId(null)
    await updateInvoiceStatus(dbId, newStatus)
  }

  React.useEffect(() => {
    const closeDropdown = () => setOpenMenuId(null)
    window.addEventListener('click', closeDropdown)
    return () => window.removeEventListener('click', closeDropdown)
  }, [])

  const filteredInvoices = initialInvoices.filter(inv => {
    const term = search.toLowerCase()
    if (!term) return true
    
    let statusFr = ""
    switch(inv.status) {
      case "paid": statusFr = "payée payé"; break;
      case "sent": statusFr = "envoyée envoyé"; break;
      case "overdue": statusFr = "en retard"; break;
      case "draft": statusFr = "brouillon"; break;
    }

    const matchesSearch = (
      inv.client.toLowerCase().includes(term) ||
      inv.id.toLowerCase().includes(term) ||
      inv.date.includes(term) ||
      inv.total.toString().includes(term) ||
      inv.due.toString().includes(term) ||
      statusFr.includes(term)
    )

    const matchesStatus = statusFilter === "all" || inv.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === "date_desc" || sortBy === "date_asc") {
      // Parse DD/MM/YYYY
      const [d1, m1, y1] = a.date.split('/')
      const [d2, m2, y2] = b.date.split('/')
      const dateA = new Date(`${y1}-${m1}-${d1}`).getTime()
      const dateB = new Date(`${y2}-${m2}-${d2}`).getTime()
      return sortBy === "date_desc" ? dateB - dateA : dateA - dateB
    }
    if (sortBy === "amount_desc") return b.total - a.total
    if (sortBy === "amount_asc") return a.total - b.total
    if (sortBy === "client_asc") return a.client.localeCompare(b.client)
    return 0
  })

  // Compute metrics
  const totalOverdue = initialInvoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.due, 0)
  const totalUpcoming = initialInvoices.filter(i => i.status === 'sent').reduce((acc, i) => acc + i.due, 0)
  const totalExpected = initialInvoices.filter(i => i.status !== 'draft' && i.status !== 'paid').reduce((acc, i) => acc + i.due, 0)
  
  // Close dropdown when clicking outside (simple hack for this demo: any click on the page body will be caught if we had a global listener, but for now we'll just let it stay open until they click again or select an option)
  
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Factures</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            Dernière mise à jour à l'instant <RefreshCw size={14} className="ml-1 text-gray-400" />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Exporter en .CSV
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus size={16} />
            Créer une facture
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-4 py-4">
        <div className="group flex flex-col items-center justify-center text-center space-y-1 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-rose-300 hover:bg-rose-50/50">
          <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-rose-600">En retard</p>
          <p className="text-3xl font-bold text-gray-900 transition-colors group-hover:text-rose-950">{formatCurrency(totalOverdue)}</p>
        </div>
        <div className="group flex flex-col items-center justify-center text-center space-y-1 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-orange-300 hover:bg-orange-50/50">
          <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-orange-600">À venir (30j)</p>
          <p className="text-3xl font-bold text-gray-900 transition-colors group-hover:text-orange-950">{formatCurrency(totalUpcoming)}</p>
        </div>
        <div className="group flex flex-col items-center justify-center text-center space-y-1 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-300 hover:bg-gray-50/80">
          <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-700">Délai moyen de paiement</p>
          <p className="text-3xl font-bold text-gray-900 transition-colors">0 <span className="text-lg font-normal text-gray-500 transition-colors group-hover:text-gray-600">jours</span></p>
        </div>
        <div className="group flex flex-col items-center justify-center text-center space-y-1 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-300 hover:bg-emerald-50/50">
          <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-emerald-600">Encaissements prévus</p>
          <p className="text-3xl font-bold text-gray-900 transition-colors group-hover:text-emerald-950">{formatCurrency(totalExpected)}</p>
        </div>
      </div>

      {/* Tableau des factures */}
      <Card className="border-none shadow-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-[140px]">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tous statuts</option>
                <option value="paid">Payée</option>
                <option value="sent">Envoyée</option>
                <option value="overdue">En retard</option>
                <option value="draft">Brouillon</option>
              </Select>
            </div>
            <div className="w-[160px]">
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date_desc">Plus récente</option>
                <option value="date_asc">Plus ancienne</option>
                <option value="amount_desc">Montant décroissant</option>
                <option value="amount_asc">Montant croissant</option>
                <option value="client_asc">Client (A-Z)</option>
              </Select>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="h-9 w-[250px] rounded-md border border-gray-200 bg-white pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="p-0 border border-gray-100 rounded-xl overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-12 text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Reste à payer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{invoice.id}</TableCell>
                  <TableCell className="text-gray-600">{invoice.client}</TableCell>
                  <TableCell className="font-medium text-gray-900">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>
                    {invoice.status === "paid" && <Badge variant="success">Payée</Badge>}
                    {invoice.status === "overdue" && <Badge variant="destructive">En retard</Badge>}
                    {invoice.status === "sent" && <Badge variant="warning">Envoyée</Badge>}
                    {invoice.status === "draft" && <Badge variant="draft">Brouillon</Badge>}
                  </TableCell>
                  <TableCell className="text-gray-600">{formatCurrency(invoice.due)}</TableCell>
                  <TableCell className="text-gray-600">{invoice.date}</TableCell>
                  <TableCell className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(openMenuId === invoice.id ? null : invoice.id)
                      }}
                      className="p-2 text-gray-400 hover:text-gray-900 rounded-md hover:bg-gray-100"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {openMenuId === invoice.id && (
                      <div 
                        className="absolute right-8 top-1/2 -translate-y-1/2 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/invoices/${invoice.id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                          Voir le détail de la facture
                        </Link>
                        <Link href={`/invoices/${invoice.id}`} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                          Modifier la facture
                        </Link>
                        
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        
                        <div className="group/submenu relative">
                          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center justify-between">
                            Changer de statut
                            <ChevronRight size={14} className="text-gray-400" />
                          </button>
                          
                          {/* Sub-menu */}
                          <div className="absolute top-0 right-full mr-1 hidden group-hover/submenu:block w-36 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50">
                            <button onClick={() => updateStatus(invoice.db_id, 'draft')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              Brouillon
                            </button>
                            <button onClick={() => updateStatus(invoice.db_id, 'sent')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              Envoyé
                            </button>
                            <button onClick={() => updateStatus(invoice.db_id, 'paid')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              Payé
                            </button>
                            <button onClick={() => updateStatus(invoice.db_id, 'overdue')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              En retard
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
          
          <div className="flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500">
            <div>Affichage de {sortedInvoices.length > 0 ? 1 : 0} à {sortedInvoices.length} sur {initialInvoices.length} résultats</div>
            <div className="flex items-center gap-2">
              <select className="h-8 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm focus-visible:outline-none">
                <option>25 par page</option>
              </select>
              <Button variant="outline" size="sm" className="h-8">Précédent</Button>
              <Button variant="outline" size="sm" className="h-8">Suivant</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
