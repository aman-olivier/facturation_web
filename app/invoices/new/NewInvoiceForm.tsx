"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Send, Mail, FileText, LayoutTemplate, Building2, User, Save, CheckCircle2, Download, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"

type LineItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

import { createInvoice } from '../actions'

export default function NewInvoiceForm({ initialSettings, clients = [] }: { initialSettings: any, clients?: any[] }) {
  const router = useRouter()
  const [client, setClient] = React.useState(clients[0]?.name || "")
  const [dateIssue, setDateIssue] = React.useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = React.useState("")
  const [lines, setLines] = React.useState<LineItem[]>([
    { id: "1", description: "Brand Guidelines", quantity: 2, unitPrice: 1250000 },
    { id: "2", description: "Logo Usage", quantity: 3, unitPrice: 1000000 },
  ])
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const [settings] = React.useState(initialSettings)

  const handleSave = () => {
    setIsModalOpen(true)
  }

  const completeSave = async () => {
    const rawDate = dateIssue || new Date().toISOString().split('T')[0]
    const dateParts = rawDate.split('-')
    const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : rawDate

    const newInvoice = {
      id: "INV-345442-" + Math.floor(Math.random() * 1000),
      client: client,
      amount: total,
      status: "draft",
      date: formattedDate,
      dueDate: dueDate,
      taxRate: settings.taxRate
    }
    
    // Call server action to save to Supabase
    await createInvoice(newInvoice, lines)
    
    router.push('/invoices')
  }

  const printPdf = () => {
    window.print()
  }

  const addLine = () => {
    setLines([...lines, { id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0 }])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(l => l.id !== id))
    }
  }

  const updateLine = (id: string, field: keyof LineItem, value: string | number) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const subtotal = Math.round(lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0))
  const discount = 0
  const tva = Math.round(subtotal * (settings.taxRate / 100))
  const total = subtotal + tva - discount

  return (
    <div className="grid lg:grid-cols-[450px_1fr] xl:grid-cols-[550px_1fr] min-h-[calc(100vh-64px)] h-full bg-gray-50/30">
      {/* LEFT COLUMN: FORM */}
      <div className="bg-white border-r border-gray-200 overflow-y-auto p-6 md:p-8 space-y-8 h-full">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/invoices" className="hover:text-gray-900 transition-colors">Factures</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">Créer une facture</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Créer une facture</h1>
          <p className="text-sm text-gray-500">Créez une nouvelle facture et envoyez-la instantanément.</p>
        </div>

        {/* TABS (Visual only as per mockup) */}
        <div className="flex p-1 bg-gray-100/80 rounded-lg">
          <button className="flex-1 py-1.5 text-sm font-medium bg-white rounded-md shadow-sm text-gray-900">Standard</button>
          <button className="flex-1 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Multiple</button>
          <button className="flex-1 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Récurrente</button>
        </div>

        <div className="space-y-6">
          <h2 className="text-sm font-bold text-gray-900">Informations de la facture</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 relative group">
              <Label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Émetteur *</Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input className="pl-9 pt-2 border-blue-600 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" value={settings.companyName} readOnly />
              </div>
            </div>
            
            <div className="space-y-2 relative group">
              <Label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Facturé à *</Label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <Select className="pl-9 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" value={client} onChange={(e) => setClient(e.target.value)}>
                  {clients.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  {clients.length === 0 && <option value="">Aucun client trouvé</option>}
                </Select>
              </div>
            </div>

            <div className="space-y-2 relative group">
              <Label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Date d'émission *</Label>
              <Input type="date" value={dateIssue} onChange={(e) => setDateIssue(e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
            </div>

            <div className="space-y-2 relative group">
              <Label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Date d'échéance *</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
            </div>
          </div>
          
          <div className="space-y-2 relative group">
            <Label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Numéro de facture</Label>
            <Input defaultValue="# INV-345442-000" className="bg-gray-50/50 font-mono focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Articles / Services</h2>
            <div className="w-[140px]">
              <Select className="h-8 text-xs py-1" defaultValue="fcfa">
                <option value="fcfa">XOF (FCFA)</option>
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {lines.map((line, index) => (
              <div key={line.id} className="relative rounded-xl border border-gray-200 p-4 space-y-4 group mt-6">
                <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-gray-900">Article {index + 1}</div>
                <button 
                  onClick={() => removeLine(line.id)}
                  className="absolute -top-3 right-4 bg-white px-2 text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                
                <div className="space-y-2 relative">
                  <Label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Nom de l'article</Label>
                  <div className="relative">
                    <LayoutTemplate size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      className="pl-9 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" 
                      value={line.description}
                      onChange={(e) => updateLine(line.id, "description", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Qté</Label>
                    <Input 
                      type="number" min="1"
                      className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0"
                      value={line.quantity}
                      onChange={(e) => updateLine(line.id, "quantity", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">Prix unitaire (FCFA)</Label>
                    <Input 
                      type="number" min="0"
                      className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0"
                      value={line.unitPrice}
                      onChange={(e) => updateLine(line.id, "unitPrice", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={addLine} variant="outline" className="w-full border-dashed text-gray-600 hover:text-gray-900 hover:bg-gray-50 gap-2">
            <Plus size={16} />
            Ajouter un article
          </Button>
        </div>
      </div>

      {/* RIGHT COLUMN: PREVIEW */}
      <div className="bg-gray-50/50 flex flex-col h-full overflow-hidden">
        {/* Actions Bar */}
        <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-900 hidden md:block">Aperçu</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-9 text-gray-600">
                <Mail size={14} />
                <span className="hidden xl:inline">Email</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-9 text-gray-600">
                <FileText size={14} />
                <span className="hidden xl:inline">PDF</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-9">Sauvegarder brouillon</Button>
            <Button onClick={handleSave} className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Save size={14} />
              Enregistrer
            </Button>
          </div>
        </div>

        {/* Live Preview Document */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar">
          <div className="bg-white shadow-xl shadow-black/5 w-full max-w-[210mm] min-h-[297mm] h-max p-12 flex flex-col relative shrink-0">
            {/* Corner Deco / Logo */}
            <div className="absolute top-12 right-12 w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white">
              <Building2 size={32} />
            </div>

            <div className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">FACTURE</h1>
              <p className="text-gray-500 font-mono text-sm">Numéro de facture #INV-345442-000</p>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Émise par :</h3>
                <p className="font-semibold text-gray-900 text-lg">{settings.companyName}</p>
                <p className="text-gray-500 text-sm mt-1">{settings.email}</p>
                <p className="text-gray-500 text-sm">{settings.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Facturée à :</h3>
                <p className="font-semibold text-gray-900 text-lg">{client}</p>
                <p className="text-gray-500 text-sm mt-1">contact@{client.toLowerCase().replace(/\s+/g, '')}.com</p>
                <p className="text-gray-500 text-sm">Adresse du client</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Date d'émission :</h3>
                <p className="font-semibold text-gray-900">{dateIssue || "—"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Date d'échéance :</h3>
                <p className="font-semibold text-gray-900">{dueDate || "—"}</p>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Articles / Services</h3>
              <table className="w-full text-sm mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="text-left font-semibold py-3 text-gray-900">Description</th>
                    <th className="text-center font-semibold py-3 text-gray-900 w-24">Qté</th>
                    <th className="text-right font-semibold py-3 text-gray-900 w-32">Prix unitaire</th>
                    <th className="text-right font-semibold py-3 text-gray-900 w-40">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lines.map((line) => (
                    <tr key={line.id}>
                      <td className="py-4 text-gray-900 font-medium">{line.description || "—"}</td>
                      <td className="py-4 text-center text-gray-500">{line.quantity}</td>
                      <td className="py-4 text-right text-gray-500">{formatCurrency(line.unitPrice)}</td>
                      <td className="py-4 text-right font-semibold text-gray-900">{formatCurrency(line.quantity * line.unitPrice)}</td>
                    </tr>
                  ))}
                  {lines.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 italic">Aucun article ajouté.</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Sous-total HT</span>
                    <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>TVA ({settings.taxRate}%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(tva)}</span>
                  </div>
                  <div className="pt-3 border-t-2 border-gray-900 flex justify-between font-bold text-lg text-gray-900">
                    <span>Total TTC</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Méthode de paiement</h3>
                  <p className="text-sm text-gray-500">Virement Bancaire (EFT)</p>
                  <p className="text-sm text-gray-500">Banque : {settings.bankName}</p>
                  <p className="text-sm text-gray-500">Numéro de compte : {settings.iban}</p>
                  <p className="text-sm text-gray-500 mt-2 p-3 bg-gray-50 rounded-md italic">Note : {settings.notes}</p>
                </div>
                <div className="text-right flex flex-col justify-end items-end">
                  <div className="w-48 h-12 border-b border-gray-300 mb-2 flex items-end justify-center pb-2">
                    {/* Placeholder for Signature */}
                    <span className="font-signature text-2xl text-blue-900/50 -rotate-3">{settings.companyName.substring(0, 15)}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Signature Autorisée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .font-signature {
          font-family: 'Brush Script MT', cursive, sans-serif;
        }
      `}} />

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Facture prête !</h3>
              <p className="text-gray-500 mb-6">
                La facture pour <span className="font-semibold text-gray-900">{client}</span> a été générée avec succès. 
                Que souhaitez-vous faire maintenant ?
              </p>
              
              <div className="space-y-3">
                <Button onClick={printPdf} className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 text-base">
                  <Download size={18} />
                  Télécharger (PDF)
                </Button>
                <Button onClick={completeSave} variant="outline" className="w-full h-11 text-gray-600 text-base">
                  Fermer et retourner à la liste
                </Button>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
