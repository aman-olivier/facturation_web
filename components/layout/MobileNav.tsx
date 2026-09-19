"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Menu,
  X,
  LogOut
} from "lucide-react"
import { logout } from "@/app/login/actions"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const close = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      {/* Top bar */}
      <div className="flex h-16 items-center justify-between border-b px-4 bg-white">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
            <FileText size={18} />
          </div>
          WebFacturation
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2 text-gray-600 hover:text-gray-900"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-50 p-4">
          <div className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">AH</div>
              <span className="font-medium text-sm">Ahimo Corp</span>
            </div>
          </div>
          
          <nav className="grid gap-1">
            <Link
              href="/"
              onClick={close}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", 
                pathname === "/" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ventes & Paiements</p>
            </div>
            
            <Link
              href="/quotes"
              onClick={close}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", 
                pathname === "/quotes" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <FileText size={18} />
              Devis
            </Link>
            <Link
              href="/invoices"
              onClick={close}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", 
                pathname === "/invoices" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <FileText size={18} />
              Factures
            </Link>
            <Link
              href="/clients"
              onClick={close}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", 
                pathname === "/clients" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Users size={18} />
              Clients
            </Link>
            <Link
              href="/articles"
              onClick={close}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", 
                pathname === "/articles" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <FileText size={18} />
              Articles
            </Link>
            
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuration</p>
            </div>
            
            <Link
              href="/settings"
              onClick={close}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", 
                pathname === "/settings" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Settings size={18} />
              Paramètres
            </Link>
          </nav>
          
          <div className="pt-6 mt-4 border-t border-gray-100">
            <form action={logout}>
              <button type="submit" onClick={close} className="flex items-center gap-3 rounded-md px-3 py-2 w-full text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
                <LogOut size={18} />
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
