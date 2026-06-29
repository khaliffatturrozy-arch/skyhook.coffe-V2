"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/utils/cn"
import { createClient } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, ShoppingBag, Utensils, Calendar,
  Package, BarChart3, Store, Users, Settings, Wallet,
  Bell, Briefcase, Loader2, ShieldAlert, LogOut, Crown,
  ChevronLeft, ChevronRight, Coffee, Music, Gift, Image,
  Building2, TrendingUp, Menu, X, UserCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, color: "from-amber-400 to-orange-500" },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, color: "from-blue-400 to-cyan-500" },
  { href: "/admin/menu", label: "QR Menu", icon: Utensils, color: "from-emerald-400 to-teal-500" },
  { href: "/admin/reservations", label: "Reservations", icon: Calendar, color: "from-violet-400 to-purple-500" },
  { href: "/admin/events", label: "Events", icon: Music, color: "from-rose-400 to-pink-500" },
  { href: "/admin/packages", label: "Packages", icon: Gift, color: "from-amber-400 to-yellow-500" },
  { href: "/admin/gallery", label: "Gallery", icon: Image, color: "from-sky-400 to-blue-500" },
  { href: "/admin/customers", label: "Customers", icon: Users, color: "from-teal-400 to-emerald-500" },
  { href: "/admin/payments", label: "Finance", icon: Wallet, color: "from-green-400 to-emerald-500" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, color: "from-indigo-400 to-violet-500" },
  { href: "/admin/inventory", label: "Inventory", icon: Package, color: "from-orange-400 to-amber-500" },
  { href: "/admin/staff", label: "Staff", icon: UserCircle, color: "from-cyan-400 to-blue-500" },
  { href: "/admin/cms", label: "Website CMS", icon: Settings, color: "from-gray-400 to-slate-500" },
  { href: "/admin/facilities", label: "Facilities", icon: Building2, color: "from-amber-400 to-orange-500" },
]

const quickActions = [
  { label: "New Order", icon: ShoppingBag, href: "/pos", color: "bg-blue-500" },
  { label: "Reservation", icon: Calendar, href: "/admin/reservations", color: "bg-violet-500" },
  { label: "Add Menu", icon: Utensils, href: "/admin/menu", color: "bg-emerald-500" },
  { label: "Analytics", icon: TrendingUp, href: "/admin/analytics", color: "bg-amber-500" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [noAdmin, setNoAdmin] = useState(false)
  const [registing, setRegisting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user?.id) {
        window.location.href = "/auth?redirect=/admin"
        return
      }

      const { data: role, error: roleError } = await supabase
        .rpc("check_staff_role", { p_user_id: session.user.id })

      if (role && !roleError) {
        setAuthorized(true)
        setChecking(false)
        return
      }

      const { data: hasAdmin, error: adminError } = await supabase.rpc("admin_exists")
      if (adminError || !hasAdmin) setNoAdmin(true)

      setChecking(false)
    })()
  }, [])

  async function handleRegisterAdmin() {
    setRegisting(true)
    try {
      const res = await fetch("/api/admin/setup", { method: "POST" })
      const data = await res.json()
      if (res.ok) { setAuthorized(true); setNoAdmin(false) }
      else alert(data.error || "Failed to register")
    } finally { setRegisting(false) }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/auth"
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-2xl">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          </div>
          <p className="text-white/40 text-sm">Loading Skyhook OS...</p>
        </div>
      </div>
    )
  }

  if (!authorized && noAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-3xl border border-white/10 p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to Skyhook OS</h1>
            <p className="text-white/40 text-sm mb-6">No admin found. Register as the first administrator to set up your business operating system.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/"><Button variant="ghost">Back to Site</Button></Link>
              <button onClick={handleRegisterAdmin} disabled={registing}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-500/25">
                {registing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                {registing ? "Registering..." : "Register as First Admin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-3xl border border-white/10 p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-red-500/20 to-rose-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
              <ShieldAlert className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-white/40 text-sm mb-6">You do not have admin or manager privileges.</p>
            <Link href="/"><Button variant="primary">Back to Home</Button></Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,149,108,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* Glass Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a0b]/80 backdrop-blur-2xl border-b border-white/5" : "bg-transparent"}`}>
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebar(true)} className="lg:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10">
              <Menu className="w-4 h-4" />
            </button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex w-9 h-9 rounded-xl bg-white/5 border border-white/10 items-center justify-center text-white/60 hover:bg-white/10 transition-all">
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm hidden sm:block">Skyhook <span className="text-white/40 font-normal">OS</span></span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-white/40 font-medium">Live</span>
            </div>
            <button onClick={handleSignOut} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Premium Floating Sidebar */}
      <aside className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-all duration-300 hidden lg:block ${sidebarOpen ? "w-56" : "w-16"}`}>
        <div className="h-full mx-2 my-2 backdrop-blur-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] rounded-3xl border border-white/10 overflow-hidden flex flex-col">
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-none">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 relative group",
                    isActive
                      ? "bg-gradient-to-r from-white/10 to-white/5 text-white shadow-lg"
                      : "text-white/40 hover:text-white/80 hover:bg-white/5",
                  )}
                >
                  {isActive && (
                    <motion.div layoutId="sidebar-active" className="absolute left-0 w-0.5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                  )}
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all", isActive ? "bg-gradient-to-br from-amber-500/20 to-orange-500/10" : "bg-white/5")}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {sidebarOpen && <span className="truncate">{link.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          {sidebarOpen && (
            <div className="p-3 border-t border-white/5">
              <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest mb-2 px-1">Quick Actions</p>
              <div className="grid grid-cols-2 gap-1">
                {quickActions.map((qa) => (
                  <Link key={qa.label} href={qa.href}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[11px] font-medium transition-all">
                    <qa.icon className="w-3 h-3" />
                    {qa.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebar(false)}
          >
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 left-0 bottom-0 w-72 bg-[#0a0a0b] border-r border-white/10 p-4"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Coffee className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white text-sm">Skyhook <span className="text-white/40">OS</span></span>
                </div>
                <button onClick={() => setMobileSidebar(false)} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="space-y-0.5">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  return (
                    <Link key={link.href} href={link.href} onClick={() => setMobileSidebar(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all",
                        isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white/80 hover:bg-white/5",
                      )}>
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", isActive ? "bg-gradient-to-br from-amber-500/20 to-orange-500/10" : "bg-white/5")}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-16 min-h-screen ${sidebarOpen ? "lg:pl-56" : "lg:pl-16"}`}>
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
