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

import { updateInvoiceStatus } from './actions'

// We no longer rely on static INVOICES or localStorage. 
// They are passed in from the server via initialInvoices.

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return <Badge variant="success">Payée</Badge>
    case "sent":
      return <Badge variant="warning">Envoyée</Badge>
    case "overdue":
      return <Badge variant="destructive">En retard</Badge>
    case "draft":
    default:
      return <Badge variant="draft">Brouillon</Badge>
  }
}

export default function InvoicesList({ initialInvoices }: { initialInvoices: any[] }) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null)

  const updateStatus = async (id: string, dbId: string, newStatus: string) => {
    // Optimistic UI update can be handled by React state or we let Server Actions revalidate
    // Since we're using server actions and revalidatePath, it will refresh the data automatically
    setOpenMenuId(null)
    await updateInvoiceStatus(dbId, newStatus)
  }

  React.useEffect(() => {
    const closeDropdown = () => setOpenMenuId(null)
    window.addEventListener('click', closeDropdown)
    return () => window.removeEventListener('click', closeDropdown)
  }, [])
  
  const filteredInvoices = initialInvoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Factures</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez vos factures et suivez vos encaissements.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hidden md:flex">
            <Download size={16} />
            Exporter
          </Button>
          <Link href="/invoices/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full md:w-auto">
              <Plus size={16} />
              Nouvelle facture
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Rechercher une facture, un client..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <div className="w-[180px]">
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="paid">Payée</option>
                <option value="sent">Envoyée</option>
                <option value="overdue">En retard</option>
                <option value="draft">Brouillon</option>
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
                <TableHead className="text-right">Montant</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Reste à payer</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow 
                  key={invoice.id} 
                  className="cursor-pointer"
                  onClick={() => router.push(`/invoices/${invoice.id}`)}
                >
                  <TableCell className="font-medium text-gray-900">{invoice.id}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell className="text-gray-500">{invoice.date}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(invoice.status)}
                  </TableCell>
                  <TableCell className="text-right text-gray-500">
                    {invoice.due > 0 ? formatCurrency(invoice.due) : "-"}
                  </TableCell>
                  <TableCell className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === invoice.id ? null : invoice.id)
                      }}
                      className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    
                    {openMenuId === invoice.id && (
                      <div 
                        className="absolute right-10 top-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm"
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
                            <button onClick={() => updateStatus(invoice.id, invoice.db_id, 'draft')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              Brouillon
                            </button>
                            <button onClick={() => updateStatus(invoice.id, invoice.db_id, 'sent')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              Envoyé
                            </button>
                            <button onClick={() => updateStatus(invoice.id, invoice.db_id, 'paid')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                              Payé
                            </button>
                            <button onClick={() => updateStatus(invoice.id, invoice.db_id, 'overdue')} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
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
        </CardContent>
      </Card>
    </div>
  )
}
