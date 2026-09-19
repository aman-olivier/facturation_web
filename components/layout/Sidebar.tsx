import Link from "next/link"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  CreditCard,
  ChevronDown,
  LogOut
} from "lucide-react"
import { logout } from "@/app/login/actions"

export function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col border-r bg-gray-50/40 min-h-screen">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white">
            <FileText size={18} />
          </div>
          WebFacturation
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <div className="px-4 pb-4">
          <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium border rounded-md bg-white hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">AH</div>
              <span className="truncate max-w-[120px]">Ahimo Corp</span>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </button>
        </div>

        <nav className="grid gap-1 px-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-blue-50 text-blue-700"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          
          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ventes & Paiements</p>
          </div>
          
          <Link
            href="/quotes"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <FileText size={18} />
            Devis
          </Link>
          <Link
            href="/invoices"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <FileText size={18} />
            Factures
          </Link>
          <Link
            href="/clients"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Users size={18} />
            Clients
          </Link>
          <Link
            href="/articles"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <FileText size={18} />
            Articles
          </Link>
          
          <div className="pt-4 pb-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Configuration</p>
          </div>
          
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <Settings size={18} />
            Paramètres
          </Link>
        </nav>
      </div>

      <div className="p-4 mt-auto border-t">
        <form action={logout}>
          <button type="submit" className="flex items-center gap-3 rounded-md px-3 py-2 w-full text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors">
            <LogOut size={18} />
            Déconnexion
          </button>
        </form>
      </div>
    </div>
  )
}
