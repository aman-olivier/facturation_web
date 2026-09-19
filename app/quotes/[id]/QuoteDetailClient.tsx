"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ArrowLeft, Search, Plus, MoreVertical, Edit, 
  MapPin, User, Building2, Copy, Send, CheckCircle2, Link as LinkIcon, Trash2
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

type QuoteLine = {
  id: string
  name: string
  description: string
  qty: number
  uom: string
  unitCost: number
  unitPrice: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

import { updateQuoteStatus, deleteQuote, addQuoteContact, updateQuoteContact, deleteQuoteContact, updateQuoteInfo } from '../actions'
import { useRouter } from "next/navigation"

function getStatusLabel(status: string) {
  switch (status) {
    case "accepted": return "Accepté";
    case "validation": return "En cours de validation";
    case "canceled": return "Annulé par le client";
    case "construction":
    default: return "En construction";
  }
}

export default function QuoteDetailClient({ quote }: { quote: any }) {
  const router = useRouter()
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false)
  const [isNotesModalOpen, setIsNotesModalOpen] = React.useState(false)
  const [isEditClientModalOpen, setIsEditClientModalOpen] = React.useState(false)
  const [editingContact, setEditingContact] = React.useState<any>(null)
  const [openContactMenuId, setOpenContactMenuId] = React.useState<string | null>(null)
  const [notes, setNotes] = React.useState(quote.notes || "")
  const [clientNameInput, setClientNameInput] = React.useState(quote.client_name || "")

  // Suggestion d'articles (combobox)
  const [articleSearch, setArticleSearch] = React.useState("")
  const [showArticleSuggestions, setShowArticleSuggestions] = React.useState(false)
  const [selectedLines, setSelectedLines] = React.useState<string[]>([])

  // Champs modifiables
  const [shippingCost, setShippingCost] = React.useState(quote.shipping_cost || 0)
  const [discount, setDiscount] = React.useState(quote.discount || 0)
  const [taxRate, setTaxRate] = React.useState(quote.tax_rate || 18)
  
  const [editingField, setEditingField] = React.useState<'shipping' | 'discount' | 'tax' | null>(null)

  // Contacts provenant de la BDD
  const contacts = quote.quote_contacts || []
  const allArticles = quote.all_articles || []
  
  const filteredArticles = allArticles.filter((a: any) => 
    a.nom_article.toLowerCase().includes(articleSearch.toLowerCase()) || 
    a.code_article.toLowerCase().includes(articleSearch.toLowerCase())
  )

  React.useEffect(() => {
    const closeDropdown = () => {
      setOpenContactMenuId(null)
      setShowArticleSuggestions(false)
    }
    window.addEventListener('click', closeDropdown)
    return () => window.removeEventListener('click', closeDropdown)
  }, [])

  // Utiliser les lignes de la BDD ou un tableau vide
  const [lines, setLines] = React.useState<any[]>(quote.quote_items?.map((l:any) => ({
    id: l.id,
    name: l.description,
    description: "",
    qty: l.quantity,
    uom: "Unité",
    unitCost: l.unit_price,
    unitPrice: l.unit_price
  })) || [])


  // L'utilisateur peut ajouter une ligne vide
  const addLine = () => {
    setLines([...lines, { 
      id: Math.random().toString(), 
      name: "Nouvel article", 
      description: "", 
      qty: 1, 
      uom: "Each", 
      unitCost: 0, 
      unitPrice: 0 
    }])
  }

  const updateLine = (id: string, field: keyof QuoteLine, value: string | number) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const removeLine = (id: string) => {
    setLines(lines.filter(l => l.id !== id))
  }

  // Calculations
  const costTotal = lines.reduce((acc, l) => acc + (l.qty * l.unitCost), 0)
  const subTotal = lines.reduce((acc, l) => acc + (l.qty * l.unitPrice), 0)
  const activeShippingCost = subTotal > 0 ? shippingCost : 0
  const activeDiscount = subTotal > 0 ? discount : 0
  const taxes = subTotal > 0 ? Math.round((subTotal - activeDiscount) * (taxRate / 100)) : 0
  
  const grandTotal = subTotal + activeShippingCost - activeDiscount + taxes
  const profitMarkup = subTotal - costTotal
  const marginPercent = subTotal > 0 ? (profitMarkup / subTotal) * 100 : 0

  const handlePrint = () => {
    window.print()
  }

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      await deleteQuote(quote.id)
      router.push("/quotes")
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      await deleteQuoteContact(contactId)
    }
  }

  const handleSaveContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      nom: formData.get('nom'),
      email: formData.get('email'),
      fournisseur_nom: formData.get('fournisseur_nom'),
      produits_fournis: formData.get('produits_fournis')
    }
    
    if (editingContact) {
      await updateQuoteContact(editingContact.id, data)
    } else {
      await addQuoteContact(quote.id, data)
    }
    
    setIsContactModalOpen(false)
    setEditingContact(null)
  }

  const handleSaveNotes = async () => {
    await updateQuoteInfo(quote.id, { notes })
    setIsNotesModalOpen(false)
  }

  const handleSaveClientName = async () => {
    await updateQuoteInfo(quote.id, { client_name: clientNameInput })
    setIsEditClientModalOpen(false)
  }

  const handleArticleSelect = (article: any) => {
    setLines([...lines, { 
      id: Math.random().toString(), 
      name: article.nom_article, 
      description: article.designation || "", 
      qty: 1, 
      uom: "Unité", 
      unitCost: article.prix_unitaire || 0, 
      unitPrice: article.prix_unitaire || 0 
    }])
    setArticleSearch("")
    setShowArticleSuggestions(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      alert(`Simulation: Le fichier ${e.target.files[0].name} a été sélectionné pour l'upload.`)
    }
  }

  const handleSaveField = async (field: 'shipping' | 'discount' | 'tax', valStr: string) => {
    const val = Number(valStr) || 0
    setEditingField(null)
    if (field === 'shipping') {
      setShippingCost(val)
      await updateQuoteInfo(quote.id, { shipping_cost: val })
    } else if (field === 'discount') {
      setDiscount(val)
      await updateQuoteInfo(quote.id, { discount: val })
    } else if (field === 'tax') {
      setTaxRate(val)
      await updateQuoteInfo(quote.id, { tax_rate: val })
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] h-full bg-white relative">
      
      {/* Header section (Non-sticky to flow with page) */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 print:hidden">
          <Link href="/quotes" className="hover:text-gray-900 transition-colors">Devis</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Devis pour {quote.client_name}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold shrink-0">
              MH
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                Devis pour {quote.client_name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Dernière émission : {quote.issue_date} par {quote.company?.name}
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-500 uppercase font-semibold">Status</span>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 ml-1">{getStatusLabel(quote.status)}</Badge>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-500 uppercase font-semibold">ID</span>
                  <span className="font-mono text-gray-900 ml-1">{quote.id}</span>
                  <Copy size={12} className="text-blue-500 ml-1 cursor-pointer print:hidden" />
                </div>
                <button 
                  onClick={() => setIsEmailModalOpen(true)}
                  className="bg-emerald-500 text-white hover:bg-emerald-600 px-2 py-0.5 rounded-full text-xs font-medium transition-colors"
                >
                  Expédier au client
                </button>
                <Badge className="bg-rose-500 text-white hover:bg-rose-600">Priorité Haute</Badge>
                <button className="text-blue-600 font-medium text-xs flex items-center gap-1 hover:underline">
                  Ajouter <Plus size={12} />
                </button>
              </div>

              <div className="flex gap-12 mt-4 text-xs">
                <div>
                  <span className="text-gray-500 uppercase font-semibold block mb-1">Client</span>
                  <a href="#" className="text-blue-600 font-medium flex items-center gap-1 hover:underline">
                    {quote.client_name} <LinkIcon size={10} className="print:hidden" />
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 uppercase font-semibold block mb-1">Fournisseur</span>
                  <a href="#" className="text-blue-600 font-medium flex items-center gap-1 hover:underline">
                    {quote.company?.name || "Ahimou Corp"} <LinkIcon size={10} className="print:hidden" />
                  </a>
                  <span className="text-gray-500">{quote.company?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <Button variant="outline" className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-transparent" onClick={handleDelete}>
              Supprimer
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9 px-6 rounded-md" onClick={handlePrint}>
              <Send size={16} />
              Télécharger PDF
            </Button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex gap-6 mt-6 border-b border-gray-100 print:hidden">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium text-sm px-1 flex items-center gap-2">
            <Edit size={14} /> Gérer
          </button>
          <button className="text-gray-500 hover:text-gray-900 pb-2 font-medium text-sm px-1 transition-colors">
            Activités
          </button>
          <button className="text-gray-500 hover:text-gray-900 pb-2 font-medium text-sm px-1 transition-colors">
            Communication
          </button>
          <button className="text-gray-500 hover:text-gray-900 pb-2 font-medium text-sm px-1 transition-colors">
            Documents
          </button>
          <button className="text-gray-500 hover:text-gray-900 pb-2 font-medium text-sm px-1 transition-colors">
            Email
          </button>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        <div className="max-w-[1400px] mx-auto p-4 md:p-6 pb-32 grid lg:grid-cols-[320px_1fr] gap-6">
          
          {/* LEFT SIDEBAR */}
          <div className="space-y-4 print:hidden">
            
            {/* Company/Fournisseur Card */}
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">FR</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Fournisseur</p>
                      <p className="font-semibold text-gray-900 text-sm">{quote.company?.name || "Votre entreprise"}</p>
                    </div>
                  </div>
                  <MoreVertical size={16} className="text-gray-400" />
                </div>
                
                <div className="flex justify-between items-center mb-3 text-xs">
                  <span className="text-gray-500">Contacts <br/> {contacts.length} {contacts.length > 1 ? 'contacts' : 'contact'}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
                    onClick={() => { setEditingContact(null); setIsContactModalOpen(true); }}
                  >
                    Ajouter contact
                  </Button>
                </div>

                <div className="space-y-3">
                  {contacts.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Aucun contact fournisseur.</p>
                  )}
                  {contacts.map((contact: any) => (
                    <div key={contact.id} className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><User size={14}/></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-blue-600">{contact.nom}</p>
                        <p className="text-xs text-gray-500 truncate">{contact.email}</p>
                        {contact.fournisseur_nom && <p className="text-[10px] text-gray-400 uppercase font-semibold">{contact.fournisseur_nom}</p>}
                      </div>
                      
                      {/* CRUD Menu */}
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenContactMenuId(openContactMenuId === contact.id ? null : contact.id)
                          }}
                          className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {openContactMenuId === contact.id && (
                          <div 
                            className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => { setEditingContact(contact); setIsContactModalOpen(true); setOpenContactMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            >
                              Mettre à jour
                            </button>
                            <button 
                              onClick={() => { handleDeleteContact(contact.id); setOpenContactMenuId(null); }}
                              className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50"
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">MH</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Client</p>
                      <p className="font-semibold text-gray-900 text-sm">Martin Army Communit...</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Building2 size={10} /> Dept of Veterans Affairs</p>
                    </div>
                  </div>
                  <Edit size={14} className="text-gray-400" />
                </div>
                
                {/* Simulated Map Area */}
                <div className="h-24 bg-blue-50/50 rounded-lg mb-3 border border-blue-100 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                   <MapPin className="text-blue-500 z-10" />
                </div>
                
                <p className="text-sm text-gray-700 font-medium leading-relaxed pr-6 relative mb-2">
                  1255 Wilford Hall Loop BLDG 4430,
                  Lackland Air Force Base, TX 78236, USA
                  <Copy size={14} className="absolute right-0 top-1 text-gray-400 cursor-pointer" />
                </p>
                
                <a href="#" className="text-blue-600 text-xs font-semibold hover:underline">Voir sur la carte →</a>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex gap-3 items-start">
                  <MapPin size={16} className="text-gray-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Destination de livraison</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">98493, 9600 Veterans Dr</p>
                    <p className="text-xs text-gray-600">Tacoma, WA, USA</p>
                    <Button variant="outline" size="sm" className="mt-2 h-7 text-xs text-blue-600 border-blue-200 bg-white">Changer l'adresse</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="space-y-6">
            
            {/* Phase Block */}
            <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Phase 1</h2>
                    <p className="text-sm text-gray-500">Nous allons offrir ces services dans la phase 1</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => setIsEditClientModalOpen(true)}>
                      Éditer
                    </Button>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{quote.client_name}</p>
                      <p className="text-xs text-gray-500">Dernière modif. {quote.updated_at}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-sm shrink-0">
                      {quote.client_name ? quote.client_name.substring(0, 2).toUpperCase() : 'C'}
                    </div>
                  </div>
                </div>

                {/* Phase Tabs */}
                <div className="flex gap-6 border-b border-gray-100 mb-4 print:hidden">
                  <button className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium text-sm px-1 flex items-center gap-2">
                    Articles <Badge className="bg-blue-100 text-blue-700 ml-1 rounded-full px-1.5 min-w-[20px] justify-center">{lines.length}</Badge>
                  </button>
                  <label className="text-gray-500 hover:text-gray-900 pb-2 font-medium text-sm px-1 transition-colors flex items-center gap-2 cursor-pointer">
                    Pièces jointes <Badge className="bg-gray-100 text-gray-600 ml-1 rounded-full px-1.5 min-w-[20px] justify-center">0</Badge>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button onClick={() => setIsNotesModalOpen(true)} className="text-gray-500 hover:text-gray-900 pb-2 font-medium text-sm px-1 transition-colors flex items-center gap-2">
                    Notes <Badge className="bg-gray-100 text-gray-600 ml-1 rounded-full px-1.5 min-w-[20px] justify-center">{quote.notes ? '1' : '0'}</Badge>
                  </button>
                </div>

                {/* Search Bar / Combobox */}
                <div className="flex gap-3 mb-4 print:hidden relative" onClick={(e) => e.stopPropagation()}>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input 
                      placeholder="Rechercher des articles dans le catalogue..." 
                      className="pl-9 bg-gray-50/50 border-gray-200" 
                      value={articleSearch}
                      onChange={(e) => {
                        setArticleSearch(e.target.value)
                        setShowArticleSuggestions(true)
                      }}
                      onFocus={() => setShowArticleSuggestions(true)}
                    />
                    
                    {/* Suggestions dropdown */}
                    {showArticleSuggestions && articleSearch.length >= 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {filteredArticles.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 text-center">Aucun article trouvé dans le catalogue.</div>
                        ) : (
                          filteredArticles.map((article: any) => (
                            <button 
                              key={article.id}
                              className="w-full text-left p-3 hover:bg-gray-50 flex justify-between items-center border-b border-gray-100 last:border-0"
                              onClick={() => handleArticleSelect(article)}
                            >
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{article.nom_article}</p>
                                <p className="text-xs text-gray-500">{article.code_article} • {article.designation}</p>
                              </div>
                              <span className="font-medium text-sm text-gray-900">{formatCurrency(article.prix_unitaire)}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Parcourir</Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 mb-6 print:hidden">
                  <input type="checkbox" className="rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span>Afficher les ajustements comme lignes d'articles</span>
                </div>

                <div className="flex justify-between items-center mb-4 print:hidden">
                  <span className="text-sm font-semibold text-gray-900">{lines.length} articles</span>
                  <div className="flex gap-2">
                    <Button onClick={() => setSelectedLines(lines.map(l => l.id))} variant="outline" size="sm" className="h-8 text-blue-600 border-blue-200">Sélectionner tout</Button>
                    <Button onClick={() => setSelectedLines([])} variant="outline" size="sm" className="h-8 text-gray-600">Désélectionner tout</Button>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 w-10"></th>
                      <th className="px-4 py-3 w-12 text-center">#</th>
                      <th className="px-4 py-3 min-w-[250px]">Nom</th>
                      <th className="px-4 py-3 text-center">Qté / Unité</th>
                      <th className="px-4 py-3 text-right">Coût U.</th>
                      <th className="px-4 py-3 text-right">Prix U.</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {lines.map((line, idx) => (
                      <tr key={line.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-4 align-top">
                          <input 
                            type="checkbox" 
                            className="rounded text-blue-600 border-gray-300 mt-1 focus:ring-blue-500 cursor-pointer" 
                            checked={selectedLines.includes(line.id)}
                            onChange={() => setSelectedLines(prev => prev.includes(line.id) ? prev.filter(x => x !== line.id) : [...prev, line.id])}
                          />
                        </td>
                        <td className="px-4 py-4 align-top text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-medium text-gray-900">{idx + 1}</span>
                            <button className="text-blue-500 bg-blue-50 rounded-sm p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={12}/></button>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <Input 
                            value={line.name} 
                            onChange={(e) => updateLine(line.id, 'name', e.target.value)}
                            className="h-8 font-semibold text-gray-900 border-transparent hover:border-gray-200 focus:border-blue-500 px-2 -ml-2 w-full mb-1"
                          />
                          <Input 
                            value={line.description} 
                            onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                            className="h-7 text-xs text-gray-500 border-transparent hover:border-gray-200 focus:border-blue-500 px-2 -ml-2 w-full"
                            placeholder="Description..."
                          />
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex items-center justify-center gap-1">
                            <Input 
                              type="number" 
                              value={line.qty} 
                              onChange={(e) => updateLine(line.id, 'qty', Number(e.target.value))}
                              className="h-8 w-16 text-center border-transparent hover:border-gray-200 px-1"
                            />
                            <span className="text-gray-400">/</span>
                            <Input 
                              value={line.uom} 
                              onChange={(e) => updateLine(line.id, 'uom', e.target.value)}
                              className="h-8 w-16 text-center border-transparent hover:border-gray-200 px-1 text-gray-500"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top text-right">
                          <Input 
                            type="number" 
                            value={line.unitCost} 
                            onChange={(e) => updateLine(line.id, 'unitCost', Number(e.target.value))}
                            className="h-8 text-right border-transparent hover:border-gray-200 px-2 text-gray-500 w-24 ml-auto"
                          />
                        </td>
                        <td className="px-4 py-4 align-top text-right">
                          <Input 
                            type="number" 
                            value={line.unitPrice} 
                            onChange={(e) => updateLine(line.id, 'unitPrice', Number(e.target.value))}
                            className="h-8 text-right font-medium border-transparent hover:border-gray-200 px-2 text-gray-900 w-24 ml-auto"
                          />
                        </td>
                        <td className="px-4 py-4 align-top text-right font-semibold text-gray-900 pt-5">
                          {formatCurrency(line.qty * line.unitPrice)}
                        </td>
                        <td className="px-4 py-4 align-top pt-5 text-right">
                          <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => removeLine(line.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Phase Subtotals */}
              <div className="bg-white p-6 border-t border-gray-100 flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 group">
                    <span className="flex items-center gap-2">
                      Frais de port
                      <button onClick={() => setEditingField('shipping')} className="text-blue-500 bg-blue-50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit size={12} />
                      </button>
                    </span>
                    {editingField === 'shipping' ? (
                      <Input 
                        autoFocus
                        defaultValue={shippingCost}
                        onBlur={(e) => handleSaveField('shipping', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveField('shipping', e.currentTarget.value)}
                        className="w-24 h-6 text-right text-sm px-1 py-0"
                        type="number"
                      />
                    ) : (
                      <span>{formatCurrency(activeShippingCost)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 group">
                    <span className="flex items-center gap-2">
                      Remise totale
                      <button onClick={() => setEditingField('discount')} className="text-blue-500 bg-blue-50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit size={12} />
                      </button>
                    </span>
                    {editingField === 'discount' ? (
                      <Input 
                        autoFocus
                        defaultValue={discount}
                        onBlur={(e) => handleSaveField('discount', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveField('discount', e.currentTarget.value)}
                        className="w-24 h-6 text-right text-sm px-1 py-0"
                        type="number"
                      />
                    ) : (
                      <span>{formatCurrency(activeDiscount)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 group">
                    <span className="flex items-center gap-2">
                      Taxes ({taxRate}%)
                      <button onClick={() => setEditingField('tax')} className="text-blue-500 bg-blue-50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit size={12} />
                      </button>
                    </span>
                    {editingField === 'tax' ? (
                      <div className="flex items-center gap-1">
                        <Input 
                          autoFocus
                          defaultValue={taxRate}
                          onBlur={(e) => handleSaveField('tax', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveField('tax', e.currentTarget.value)}
                          className="w-16 h-6 text-right text-sm px-1 py-0"
                          type="number"
                        />
                        <span>%</span>
                      </div>
                    ) : (
                      <span>{formatCurrency(taxes)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                    <span>Total Phase 1</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 print:hidden">
        <div className="max-w-[1400px] mx-auto flex items-stretch">
          
          <div className="flex-1 flex items-center justify-around py-3 px-6 divide-x divide-gray-100">
            <div className="px-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Sous-total</p>
              <p className="font-bold text-gray-900">{formatCurrency(subTotal)}</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Coûts</p>
              <p className="font-bold text-gray-900">{formatCurrency(costTotal)}</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Port</p>
              <p className="font-bold text-gray-900">{formatCurrency(shippingCost)}</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Remise</p>
              <p className="font-bold text-gray-900">{formatCurrency(discount)}</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Taxes</p>
              <p className="font-bold text-gray-900">{formatCurrency(taxes)}</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Marge brute</p>
              <p className="font-bold text-gray-900">{formatCurrency(profitMarkup)}</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Marge %</p>
              <p className="font-bold text-gray-900">{marginPercent.toFixed(1)}%</p>
            </div>
          </div>

          <div className="bg-blue-600 text-white flex flex-col justify-center items-center px-12 cursor-pointer hover:bg-blue-700 transition-colors">
            <p className="text-xs font-medium uppercase opacity-90 mb-1">Total Général</p>
            <p className="text-xl font-bold">{formatCurrency(grandTotal)}</p>
          </div>

        </div>
      </div>

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Expédier le devis</h2>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-medium"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Adresse email du client</label>
                <Input defaultValue={quote.client_email || ""} placeholder="client@exemple.com" />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Message (Optionnel)</label>
                <textarea 
                  className="w-full min-h-[100px] border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={`Bonjour,\n\nVeuillez trouver ci-joint notre devis N° ${quote.id} d'un montant de ${formatCurrency(grandTotal)}.\n\nCordialement,\n${quote.company?.name || "Ahimou Corp"}`}
                />
              </div>

              {/* Aperçu Miniature */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-4 items-center">
                <div className="w-12 h-16 bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0">
                  <span className="text-[8px] font-bold text-gray-300 uppercase">PDF</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Devis_{quote.id}.pdf</p>
                  <p className="text-xs text-gray-500">{formatCurrency(grandTotal)} • {lines.length} articles</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>Annuler</Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={() => {
                  alert("Devis expédié avec succès ! (Simulation)");
                  setIsEmailModalOpen(false);
                }}
              >
                <Send size={16} className="mr-2" /> Envoyer le devis
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">{editingContact ? 'Mettre à jour le contact' : 'Ajouter un contact'}</h2>
              <button 
                onClick={() => { setIsContactModalOpen(false); setEditingContact(null); }}
                className="text-gray-400 hover:text-gray-600 font-medium"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSaveContact}>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Nom du contact</label>
                  <Input name="nom" required defaultValue={editingContact?.nom || ""} placeholder="Ex: TJ Buxton" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Adresse email</label>
                  <Input type="email" name="email" required defaultValue={editingContact?.email || ""} placeholder="Ex: tj.buxton@fidelissd.com" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Nom du fournisseur</label>
                  <Input name="fournisseur_nom" required defaultValue={editingContact?.fournisseur_nom || ""} placeholder="Ex: Fidelis Sustainability" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Produits fournis</label>
                  <Input name="produits_fournis" defaultValue={editingContact?.produits_fournis || ""} placeholder="Ex: Matériel informatique, Cosmétiques..." />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
                <Button type="button" variant="outline" onClick={() => { setIsContactModalOpen(false); setEditingContact(null); }}>Annuler</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingContact ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Notes */}
      {isNotesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Notes du Devis</h2>
              <button onClick={() => setIsNotesModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-medium">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <textarea 
                className="w-full h-32 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ajouter une note..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <Button type="button" variant="outline" onClick={() => setIsNotesModalOpen(false)}>Annuler</Button>
              <Button type="button" onClick={handleSaveNotes} className="bg-blue-600 hover:bg-blue-700 text-white">Sauvegarder</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Client */}
      {isEditClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Éditer le client</h2>
              <button onClick={() => setIsEditClientModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-medium">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <label className="text-sm font-semibold text-gray-700">Nom du client</label>
              <Input 
                value={clientNameInput}
                onChange={(e) => setClientNameInput(e.target.value)}
                placeholder="Ex: Romary Cosmétiques"
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
              <Button type="button" variant="outline" onClick={() => setIsEditClientModalOpen(false)}>Annuler</Button>
              <Button type="button" onClick={handleSaveClientName} className="bg-blue-600 hover:bg-blue-700 text-white">Sauvegarder</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
