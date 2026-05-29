"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import { ROUTES } from "@/config"
import {
  LayoutDashboard, ShoppingBag, Utensils, Calendar,
  Package, BarChart3, Store, Users, Settings, Wallet,
  Bell, ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  { href: ROUTES.admin.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.admin.orders, label: "Orders", icon: ShoppingBag },
  { href: ROUTES.admin.menu, label: "Menu", icon: Utensils },
  { href: ROUTES.admin.events, label: "Events", icon: Calendar },
  { href: ROUTES.admin.inventory, label: "Inventory", icon: Package },
  { href: ROUTES.admin.analytics, label: "Analytics", icon: BarChart3 },
  { href: ROUTES.admin.outlets, label: "Outlets", icon: Store },
  { href: ROUTES.admin.staff, label: "Staff", icon: Users },
  { href: ROUTES.admin.customers, label: "Customers", icon: Users },
  { href: ROUTES.admin.payments, label: "Payments", icon: Wallet },
  { href: ROUTES.admin.waiterCalls, label: "Waiter Calls", icon: Bell },
  { href: ROUTES.admin.cms, label: "CMS", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-skyhook-black pt-20">
      <aside className="w-64 border-r border-white/5 p-4 hidden lg:block">
        <Link href={ROUTES.admin.dashboard}>
          <h2 className="font-heading text-lg font-bold mb-6 px-3">
            Skyhook <span className="text-skyhook-amber">Admin</span>
          </h2>
        </Link>
        <nav className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-skyhook-amber/10 text-skyhook-amber"
                    : "text-white/40 hover:text-white hover:bg-white/5",
                )}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
