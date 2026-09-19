"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Building2, MapPin, Package, Plus, Trash2, Globe2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"

type QuoteLine = {
  id: string
  product: string
  unitPrice: number
  quantity: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

import { createQuote } from '../actions'

export default function NewQuoteForm({ initialSettings, clients = [] }: { initialSettings: any, clients?: any[] }) {
  const router = useRouter()
  const [client, setClient] = React.useState(clients[0]?.name || "")
  const [isSaving, setIsSaving] = React.useState(false)
  const [lines, setLines] = React.useState<QuoteLine[]>([
    { id: "1", product: "", unitPrice: 0, quantity: 1 }
  ])

  const addLine = () => {
    setLines([...lines, { id: Math.random().toString(), product: "", unitPrice: 0, quantity: 1 }])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) {
      setLines(lines.filter(l => l.id !== id))
    }
  }

  const updateLine = (id: string, field: keyof QuoteLine, value: string | number) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  // Handle product selection to auto-fill price
  const handleProductSelect = (id: string, productVal: string) => {
    let price = 0
    if (productVal === "consulting") price = 150000
    if (productVal === "license") price = 250000
    if (productVal === "support") price = 75000
    
    setLines(lines.map(l => l.id === id ? { ...l, product: productVal, unitPrice: price } : l))
  }

  // Calculations
  const subTotal = lines.reduce((acc, l) => acc + (l.unitPrice * l.quantity), 0)
  const taxes = Math.round(subTotal * ((initialSettings?.taxRate || 18) / 100))
  const grandTotal = subTotal + taxes

  const handleSave = async () => {
    if (!client) {
      alert("Veuillez sélectionner un client")
      return
    }
    
    setIsSaving(true)
    const newQuote = {
      id: "DEV-345442-" + Math.floor(Math.random() * 1000),
      client: client,
      amount: grandTotal,
      status: "building",
      date: new Date().toISOString().split('T')[0],
      taxRate: initialSettings?.taxRate || 18
    }

    await createQuote(newQuote, lines)
    router.push('/quotes')
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)] bg-gray-50/50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/quotes">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">Créer un devis</h1>
            <p className="text-xs text-gray-500">Formulaire rapide</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-gray-700 bg-white shadow-sm">
            Sauvegarder brouillon
          </Button>
          <Button disabled={isSaving} onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm">
            <Save size={16} />
            {isSaving ? "Génération..." : "Générer le devis"}
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8 pb-32">
        
        {/* SECTION 1: CLIENT INFO */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
              Informations du Client
            </h2>
          </div>
          <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Client Name Dropdown */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Nom du Client</Label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <Select value={client} onChange={(e) => setClient(e.target.value)} className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-0 focus-visible:border-blue-600">
                      {clients.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                      {clients.length === 0 && <option value="" disabled>Aucun client trouvé</option>}
                    </Select>
                  </div>
                </div>

                {/* Client Address Dropdown */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Adresse du Client</Label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <Select defaultValue="" className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-0 focus-visible:border-blue-600">
                      <option value="" disabled>Sélectionner une adresse...</option>
                      <option value="hq">Siège Social (Cocody)</option>
                      <option value="warehouse">Entrepôt Principal (Yopougon)</option>
                      <option value="annex">Annexe (Plateau)</option>
                    </Select>
                  </div>
                </div>

                {/* Geographic Position Dropdown */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Position Géographique</Label>
                  <div className="relative">
                    <Globe2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <Select defaultValue="" className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-0 focus-visible:border-blue-600">
                      <option value="" disabled>Région / Ville...</option>
                      <option value="abidjan">Abidjan, Côte d'Ivoire</option>
                      <option value="bouake">Bouaké, Côte d'Ivoire</option>
                      <option value="dakar">Dakar, Sénégal</option>
                    </Select>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 2: PRODUCTS */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
              Lignes du Devis
            </h2>
          </div>
          <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 hidden md:grid grid-cols-[1fr_150px_100px_150px_40px] gap-4">
              <span className="text-xs font-semibold text-gray-500 uppercase">Produit / Service</span>
              <span className="text-xs font-semibold text-gray-500 uppercase text-right">Prix Unitaire</span>
              <span className="text-xs font-semibold text-gray-500 uppercase text-center">Quantité</span>
              <span className="text-xs font-semibold text-gray-500 uppercase text-right">Total Ligne</span>
              <span></span>
            </div>
            
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {lines.map((line, index) => (
                  <div key={line.id} className="p-6 md:px-6 md:py-4 grid grid-cols-1 md:grid-cols-[1fr_150px_100px_150px_40px] gap-4 items-end md:items-center hover:bg-gray-50/30 transition-colors group">
                    
                    {/* Product Dropdown */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500 md:hidden">Produit / Service</Label>
                      <div className="relative">
                        <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                        <Select 
                          value={line.product}
                          onChange={(e) => handleProductSelect(line.id, e.target.value)}
                          className="pl-9 bg-white border-gray-200 focus-visible:ring-0 focus-visible:border-blue-600"
                        >
                          <option value="" disabled>Choisir un produit...</option>
                          <option value="consulting">Consulting IT (Journée)</option>
                          <option value="license">Licence Logiciel Pro</option>
                          <option value="support">Support Technique Mensuel</option>
                        </Select>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500 md:hidden">Prix Unitaire</Label>
                      <Input 
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => updateLine(line.id, "unitPrice", Number(e.target.value))}
                        className="text-right bg-white border-gray-200 focus-visible:ring-0 focus-visible:border-blue-600"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-500 md:hidden">Quantité</Label>
                      <Input 
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) => updateLine(line.id, "quantity", Number(e.target.value))}
                        className="text-center bg-white border-gray-200 focus-visible:ring-0 focus-visible:border-blue-600"
                      />
                    </div>

                    {/* Line Total */}
                    <div className="text-right pt-2 md:pt-0">
                      <Label className="text-xs text-gray-500 md:hidden block mb-1">Total Ligne</Label>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(line.unitPrice * line.quantity)}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end md:justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeLine(line.id)}
                        disabled={lines.length === 1}
                        className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                <Button 
                  onClick={addLine}
                  variant="outline" 
                  className="w-full md:w-auto text-blue-600 border-blue-200 hover:bg-blue-50 bg-white gap-2 border-dashed"
                >
                  <Plus size={16} />
                  Ajouter un autre produit
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 3: TOTALS */}
        <section className="flex justify-end">
          <Card className="w-full md:w-96 border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
              <CardTitle className="text-lg">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Sous-total HT</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subTotal)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">TVA (18%)</span>
                <span className="font-semibold text-gray-900">{formatCurrency(taxes)}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total TTC</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(grandTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  )
}
