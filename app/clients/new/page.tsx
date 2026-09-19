"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { createClientRecord } from "../actions"

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    // Concaténer l'adresse, ville et pays
    const rawAddress = formData.get('address') as string
    const city = formData.get('city') as string
    const country = formData.get('country') as string
    
    let fullAddress = rawAddress || ""
    if (city) fullAddress += `, ${city}`
    if (country) fullAddress += `\n${country}`

    try {
      await createClientRecord({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: fullAddress.trim()
      })
      router.push("/clients")
    } catch (err) {
      alert("Erreur lors de la création du client.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Nouveau Client</h1>
          <p className="text-sm text-gray-500 mt-1">Ajoutez un contact à votre répertoire.</p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSave}>
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6 md:p-8 space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Informations principales</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'entreprise ou du contact *</Label>
                <Input id="name" name="name" placeholder="Ex: Entreprise Alpha" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse Email</Label>
                  <Input id="email" name="email" type="email" placeholder="contact@alpha.ci" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+225 01 02 03 04 05" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Adresse & Facturation</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète</Label>
                <Input id="address" name="address" placeholder="123 Rue du Commerce, Plateau" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" name="city" placeholder="Ex: Abidjan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input id="country" name="country" placeholder="Ex: Côte d'Ivoire" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
              <Link href="/clients">
                <Button variant="outline" type="button">Annuler</Button>
              </Link>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Save size={16} />
                {loading ? "Sauvegarde..." : "Sauvegarder le client"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
