"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import { ROUTES } from "@/config"
import {
  LayoutDashboard, ShoppingBag, Utensils, Calendar,
  Package, BarChart3, Store, Users, Settings, Wallet,
  Bell, ChevronLeft, Briefcase,
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
  { href: ROUTES.admin.career, label: "Career", icon: Briefcase },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      <aside className="w-64 border-r border-gray-200 bg-white p-4 hidden lg:block">
        <Link href={ROUTES.admin.dashboard}>
          <h2 className="text-lg font-bold mb-6 px-3 text-[#212121]">
            Skyhook <span className="text-[rgba(33,33,33,0.5)]">Admin</span>
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
                    ? "bg-gray-100 text-[#212121] font-semibold"
                    : "text-[rgba(33,33,33,0.5)] hover:text-[#212121] hover:bg-gray-50",
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
