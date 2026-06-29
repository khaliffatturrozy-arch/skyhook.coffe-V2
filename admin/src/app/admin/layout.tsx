"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/utils/cn"
import { createClient } from "@/lib/supabase"
import {
  LayoutDashboard, ShoppingBag, Utensils, Calendar, Package,
  BarChart3, Store, Users, Settings, Wallet, Bell, Briefcase,
  Loader2, ShieldAlert, Crown, LogOut,
} from "lucide-react"

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu", icon: Utensils },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/outlets", label: "Outlets", icon: Store },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: Wallet },
  { href: "/admin/waiter-calls", label: "Waiter Calls", icon: Bell },
  { href: "/admin/cms", label: "CMS", icon: Settings },
  { href: "/admin/career", label: "Career", icon: Briefcase },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [noAdmin, setNoAdmin] = useState(false)
  const [registing, setRegisting] = useState(false)

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) { window.location.href = "/auth?redirect=/admin/dashboard"; return }

      const { data: staff } = await supabase.from("staff").select("role").eq("user_id", session.user.id).in("role", ["admin", "manager"]).maybeSingle()
      if (staff) { setAuthorized(true); setChecking(false); return }

      const { data: hasAdmin } = await supabase.rpc("admin_exists")
      if (!hasAdmin) setNoAdmin(true)
      setChecking(false)
    })()
  }, [])

  async function handleRegister() {
    setRegisting(true)
    try {
      const res = await fetch("/api/admin/setup", { method: "POST" })
      const data = await res.json()
      if (res.ok) { setAuthorized(true); setNoAdmin(false) } else { alert(data.error || "Failed") }
    } finally { setRegisting(false) }
  }

  if (checking) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-[#313131]" />
    </div>
  )

  if (!authorized && noAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4"><Crown className="w-8 h-8 text-amber-600" /></div>
        <h1 className="text-2xl font-bold text-[#212121] mb-2">No Admin Found</h1>
        <p className="text-sm text-gray-500 mb-6">Register as the first admin to manage Skyhook.</p>
        <button onClick={handleRegister} disabled={registing}
          className="px-6 py-3 rounded-xl bg-[#212121] text-white font-semibold hover:bg-black disabled:opacity-50">
          {registing ? "Registering..." : "Register as First Admin"}
        </button>
      </div>
    </div>
  )

  if (!authorized) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4"><ShieldAlert className="w-8 h-8 text-red-500" /></div>
        <h1 className="text-2xl font-bold text-[#212121] mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-6">You don't have admin/manager privileges.</p>
        <a href="/auth" className="px-6 py-3 rounded-xl bg-[#212121] text-white font-semibold hover:bg-black">Sign In</a>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-200 bg-white p-4 hidden lg:block h-screen sticky top-0">
        <h2 className="text-lg font-bold mb-6 px-3 text-[#212121]">Skyhook <span className="text-gray-400">Admin</span></h2>
        <nav className="space-y-1">
          {links.map((l) => {
            const Icon = l.icon
            return (
              <Link key={l.href} href={l.href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  pathname === l.href ? "bg-gray-100 text-[#212121] font-semibold" : "text-gray-400 hover:text-[#212121] hover:bg-gray-50"
                )}>
                <Icon className="w-4 h-4" /> {l.label}
              </Link>
            )
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
