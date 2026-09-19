"use client"

import * as React from "react"
import { Building2, CreditCard, Users, Save, Upload, MapPin, Receipt, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Select } from "@/components/ui/Select"

import { saveSettings } from './actions'

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [activeTab, setActiveTab] = React.useState<"general" | "billing" | "users">("general")
  const [showSuccess, setShowSuccess] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const [settings, setSettings] = React.useState(initialSettings)

  const handleChange = (field: keyof typeof settings, value: string) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await saveSettings(settings)
    setIsSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 relative">
      
      {/* Success Toast */}
      {showSuccess && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span className="font-medium text-sm">Modifications prises en compte.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les préférences de votre entreprise et de facturation.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8 w-full md:w-auto shadow-sm">
          <Save size={16} />
          {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "general" 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Building2 size={18} />
              Profil de l'entreprise
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "billing" 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Receipt size={18} />
              Facturation
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "users" 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Users size={18} />
              Utilisateurs & Accès
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* TAB: GENERAL */}
          {activeTab === "general" && (
            <>
              <Card className="border-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Logo de l'entreprise</CardTitle>
                  <CardDescription>Il apparaîtra sur vos devis et factures.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                    <span className="text-2xl font-bold font-signature text-blue-900/40 -rotate-6">{settings.companyName.substring(0,6)}</span>
                  </div>
                  <div>
                    <Button variant="outline" className="gap-2 mb-2">
                      <Upload size={16} />
                      Changer le logo
                    </Button>
                    <p className="text-xs text-gray-500">Format recommandé : PNG ou JPG (max 2MB).</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Informations générales</CardTitle>
                  <CardDescription>Les coordonnées principales de votre activité.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom de l'entreprise</Label>
                      <Input value={settings.companyName} onChange={e => handleChange('companyName', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email de contact</Label>
                      <Input type="email" value={settings.email} onChange={e => handleChange('email', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Numéro de téléphone</Label>
                      <Input value={settings.phone} onChange={e => handleChange('phone', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Site internet</Label>
                      <Input value={settings.website} onChange={e => handleChange('website', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Adresse & Informations légales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Adresse complète</Label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input value={settings.address} onChange={e => handleChange('address', e.target.value)} className="pl-9 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Code Postal</Label>
                      <Input value={settings.postalCode} onChange={e => handleChange('postalCode', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Pays</Label>
                      <Select value={settings.country} onChange={e => handleChange('country', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0">
                        <option value="CI">Côte d'Ivoire</option>
                        <option value="FR">France</option>
                        <option value="SN">Sénégal</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      <Label>N° RCCM / SIRET</Label>
                      <Input value={settings.rccm} onChange={e => handleChange('rccm', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                    <div className="space-y-2">
                      <Label>N° Compte Contribuable (NCC)</Label>
                      <Input value={settings.ncc} onChange={e => handleChange('ncc', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* TAB: BILLING */}
          {activeTab === "billing" && (
            <>
              <Card className="border-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Préférences de facturation</CardTitle>
                  <CardDescription>Ces valeurs seront utilisées par défaut lors de la création de documents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Devise par défaut</Label>
                      <Select value={settings.currency} onChange={e => handleChange('currency', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0">
                        <option value="XOF">XOF (FCFA)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Taux de TVA par défaut (%)</Label>
                      <Input type="number" value={settings.taxRate} onChange={e => handleChange('taxRate', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label>Format des numéros de facture</Label>
                    <Input value={settings.invoiceFormat} onChange={e => handleChange('invoiceFormat', e.target.value)} className="font-mono bg-gray-50 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    <p className="text-xs text-gray-500">Exemple: INV-2024-001</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Coordonnées Bancaires</CardTitle>
                  <CardDescription>Elles apparaîtront au bas de vos factures pour faciliter le paiement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom de la banque</Label>
                    <div className="relative">
                      <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input value={settings.bankName} onChange={e => handleChange('bankName', e.target.value)} className="pl-9 focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Titulaire du compte</Label>
                    <Input value={settings.accountHolder} onChange={e => handleChange('accountHolder', e.target.value)} className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                  </div>
                  <div className="space-y-2">
                    <Label>RIB / IBAN</Label>
                    <Input value={settings.iban} onChange={e => handleChange('iban', e.target.value)} className="font-mono focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Conditions Générales</CardTitle>
                  <CardDescription>Texte ajouté par défaut en bas des devis et factures.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Note de bas de page (Pénalités, Délais)</Label>
                    <textarea 
                      className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                      value={settings.notes}
                      onChange={e => handleChange('notes', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* TAB: USERS */}
          {activeTab === "users" && (
            <Card className="border-gray-200 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg">Utilisateurs</CardTitle>
                <CardDescription>Gérez les membres de votre équipe ayant accès à l'outil.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Input placeholder="Rechercher..." className="focus-visible:ring-0 focus-visible:border-blue-600 focus-visible:ring-offset-0" />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    Ajouter un membre
                  </Button>
                </div>
                
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-4 py-3">Utilisateur</th>
                        <th className="px-4 py-3">Rôle</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {settings.companyName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{settings.companyName} (Toi)</p>
                              <p className="text-xs text-gray-500">{settings.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <ShieldCheck size={14} className="text-blue-600" />
                            Propriétaire
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-400">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}



        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .font-signature {
          font-family: 'Brush Script MT', cursive, sans-serif;
        }
      `}} />
    </div>
  )
}
