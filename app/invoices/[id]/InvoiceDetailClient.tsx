"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Send, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
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

import { updateInvoiceStatus, deleteInvoice } from '../actions'

export default function InvoiceDetailClient({ invoice }: { invoice: any }) {
  const router = useRouter()
  // Compute totals
  const subtotal = invoice.invoice_items?.reduce((acc: number, line: any) => acc + (line.quantity * line.unit_price), 0) || 0
  const tva = Math.round(subtotal * (invoice.tax_rate / 100))
  const total = subtotal + tva

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.")) {
      await deleteInvoice(invoice.id)
      router.push("/invoices")
    }
  }

  const handleChangeStatus = async () => {
    await updateInvoiceStatus(invoice.id, 'paid')
  }

  const handlePrint = () => {
    window.print()
  }



  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/invoices">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Facture {invoice.invoice_number}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Créée le {invoice.issue_date}</span>
              {invoice.status === 'draft' && <Badge variant="draft">Brouillon</Badge>}
              {invoice.status === 'sent' && <Badge variant="warning">Envoyée</Badge>}
              {invoice.status === 'paid' && <Badge variant="success">Payée</Badge>}
              {invoice.status === 'overdue' && <Badge variant="destructive">En retard</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-transparent hover:border-rose-200 transition-colors" onClick={handleDelete}>
            <Trash2 size={16} />
            <span className="hidden sm:inline">Supprimer</span>
          </Button>
          <Link href="/invoices/new">
            <Button variant="outline" className="gap-2">
              <Edit size={16} />
              <span className="hidden sm:inline">Modifier</span>
            </Button>
          </Link>
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Send size={16} />
            <span className="hidden sm:inline">Télécharger PDF</span>
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" onClick={handleChangeStatus}>
            <CheckCircle size={16} />
            Marquer payée
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        {/* Document Facture */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-8 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">De</h3>
                <p className="font-bold text-gray-900 text-xl">{invoice.company?.name || "Votre Entreprise"}</p>
                <p className="text-gray-500 text-sm mt-1 whitespace-pre-line">{invoice.company?.address}</p>
                <p className="text-blue-600 text-sm mt-1">{invoice.company?.email}</p>
                <p className="text-gray-500 text-sm mt-1">RCCM: {invoice.company?.rccm}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Facturé à</h3>
                <p className="font-medium text-gray-900 text-lg">{invoice.client_name}</p>
              </div>
            </div>

            <div className="flex justify-between items-start pt-6 border-t border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Détails</h3>
                <p className="text-sm text-gray-900"><span className="text-gray-500">Émise le:</span> {invoice.issue_date}</p>
                <p className="text-sm text-gray-900 mt-1"><span className="text-gray-500">Échéance:</span> {invoice.due_date}</p>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{invoice.invoice_number}</h1>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-100">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Qté</TableHead>
                    <TableHead className="text-right">Prix Unitaire</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.invoice_items?.map((line: any) => (
                    <TableRow key={line.id}>
                      <TableCell className="font-medium text-gray-900">{line.description}</TableCell>
                      <TableCell className="text-center text-gray-500">{line.quantity}</TableCell>
                      <TableCell className="text-right text-gray-500">{formatCurrency(line.unit_price)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(line.quantity * line.unit_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total HT</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>TVA ({invoice.tax_rate || 18}%)</span>
                  <span>{formatCurrency(tva)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total TTC</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Historique */}
        <div className="space-y-6 print:hidden">
          <Card className="border-gray-200 shadow-sm bg-gray-50/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                Historique
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Facture créée</p>
                    <p className="text-xs text-gray-500">Le 12/12/2024 par Ahimo Corp</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Facture envoyée / Mise à jour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
