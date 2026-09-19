"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

import { deleteClient } from "./actions"

export default function ClientsListClient({ initialClients }: { initialClients: any[] }) {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  
  const filteredClients = initialClients.filter(client => 
    client.name?.toLowerCase().includes(search.toLowerCase()) || 
    client.email?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      await deleteClient(id)
    }
  }

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    router.push("/clients/new") // On simule la modification en redirigeant vers le formulaire
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez votre répertoire client.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/clients/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full md:w-auto">
              <Plus size={16} />
              Nouveau client
            </Button>
          </Link>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Rechercher un client par nom ou email..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
        </div>

        <CardContent className="p-0 border border-gray-100 rounded-xl overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow 
                  key={client.id} 
                  className="cursor-pointer group"
                >
                  <TableCell className="font-medium text-gray-900">{client.id.split('-')[0]}</TableCell>
                  <TableCell className="font-semibold text-gray-900">{client.name}</TableCell>
                  <TableCell className="text-gray-500">{client.email || '—'}</TableCell>
                  <TableCell className="text-gray-500">{client.phone || '—'}</TableCell>
                  <TableCell className="text-gray-500">{client.address || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleEdit(e, client.id)}
                        className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, client.id)}
                        className="p-2 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
