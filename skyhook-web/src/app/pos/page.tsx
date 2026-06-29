"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import Link from "next/link"
import {
  Search, Plus, Minus, Trash2, CreditCard, QrCode, User, Loader2,
  CheckCircle, Users, X, Coffee, ShoppingBag, LayoutDashboard,
  ChefHat, Calendar, BarChart3, Settings, LogOut, MapPin,
  Clock, Percent, Receipt, Printer, Smartphone, Banknote, AlertCircle,
  Wallet, Gift, ChevronLeft, ChevronDown, ChevronRight, Star, Info, Tag,
  Hash, AlarmClock, Edit3, CornerDownLeft, Table2, Package,
} from "lucide-react"

type CartItem = {
  id: string; name: string; price: number; quantity: number; notes?: string
}

type MenuItem = {
  id: string; name: string; slug: string; price: number; image_url: string
  category_id: string; category_name: string; is_available: boolean
  preparation_time: number; is_featured: boolean
}

type Category = { id: string; name: string; slug: string }

type TableInfo = { id: string; table_number: string; capacity: number; status: string; section: string }

type PaymentMethod = { id: string; label: string; icon: any; desc: string }

type MemberInfo = { id: string; full_name: string; email: string; phone: string | null; membership_tier: string; loyalty_points: number }

const VOUCHERS: Record<string, { type: "percent" | "fixed"; value: number; minPurchase: number }> = {
  "WELCOME10": { type: "percent", value: 10, minPurchase: 0 },
  "COFFEE20": { type: "percent", value: 20, minPurchase: 50000 },
  "SKYHOOK50": { type: "fixed", value: 50000, minPurchase: 200000 },
  "ROOFTOP15": { type: "percent", value: 15, minPurchase: 100000 },
  "HAPPYHOUR": { type: "percent", value: 25, minPurchase: 0 },
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "qris", label: "QRIS", icon: QrCode, desc: "GoPay, OVO, DANA, ShopeePay, LinkAja" },
  { id: "cash", label: "Cash", icon: Banknote, desc: "Terima pembayaran tunai" },
  { id: "debit", label: "Debit", icon: CreditCard, desc: "Kartu debit BCA/Mandiri/BNI/BRI" },
  { id: "credit", label: "Credit Card", icon: CreditCard, desc: "Visa, Mastercard, JCB" },
  { id: "gopay", label: "GoPay", icon: Smartphone, desc: "GoPay saldo / GoPayLater" },
  { id: "ovo", label: "OVO", icon: Smartphone, desc: "OVO Cash / OVO PayLater" },
  { id: "dana", label: "DANA", icon: Smartphone, desc: "DANA saldo" },
  { id: "shopeepay", label: "ShopeePay", icon: Smartphone, desc: "ShopeePay saldo" },
  { id: "transfer", label: "Bank Transfer", icon: Receipt, desc: "BCA/Mandiri/BNI virtual account" },
]

const SIDEBAR_ITEMS = [
  { id: "pos", label: "POS", icon: ShoppingBag },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Receipt },
  { id: "reservations", label: "Reservations", icon: Calendar },
  { id: "events", label: "Events", icon: Star },
  { id: "members", label: "Members", icon: Users },
  { id: "leaderboard", label: "Leaderboard", icon: TrophyIcon },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

const ORDER_TYPE_OPTIONS = ["Dine In", "Take Away", "Event Order"]

export default function POSPage() {
  const supabase = useCallback(() => createClient(), [])

  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [userRole, setUserRole] = useState("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [menuError, setMenuError] = useState("")

  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCat, setSelectedCat] = useState("All")
  const [search, setSearch] = useState("")
  const [showPay, setShowPay] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<{ id: string; total: number } | null>(null)
  const [error, setError] = useState("")
  const [showSplit, setShowSplit] = useState(false)
  const [splitCount, setSplitCount] = useState(2)
  const [splitting, setSplitting] = useState(false)
  const [splits, setSplits] = useState<{ label: string; amount: number; id?: string; payment_status?: string }[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [activeView, setActiveView] = useState("pos")
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [showTablePicker, setShowTablePicker] = useState(false)
  const [orderType, setOrderType] = useState("Dine In")
  const [showOrderType, setShowOrderType] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [orderNotes, setOrderNotes] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("qris")
  const [paymentStep, setPaymentStep] = useState<"select" | "confirm">("select")
  const [editingCartItem, setEditingCartItem] = useState<string | null>(null)
  const [itemNoteInput, setItemNoteInput] = useState("")
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [discountPercent, setDiscountPercent] = useState(0)
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherApplied, setVoucherApplied] = useState<{ label: string; amount: number } | null>(null)
  const [voucherError, setVoucherError] = useState("")
  const [useMemberPoints, setUseMemberPoints] = useState(false)
  const [memberLookup, setMemberLookup] = useState("")
  const [foundMember, setFoundMember] = useState<MemberInfo | null>(null)
  const [memberSearching, setMemberSearching] = useState(false)
  const [redeemPoints, setRedeemPoints] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    (async () => {
      const client = supabase()
      const { data: { session } } = await client.auth.getSession()
      if (!session?.user?.id) { window.location.href = "/auth"; return }
      const { data: staff } = await client.from("staff").select("role").eq("user_id", session.user.id).maybeSingle()
      if (!staff || !["cashier", "admin", "manager", "server"].includes(staff.role)) {
        window.location.href = "/dashboard"; return
      }
      setUserRole(staff.role)
      setAuthorized(true)
      setChecking(false)
    })()
  }, [supabase])

  useEffect(() => {
    async function load() {
      try {
        const client = supabase()
        const [menuRes, catRes, tablesRes] = await Promise.all([
          client.from("menu").select("*, categories(name)").eq("is_available", true).order("sort_order"),
          client.from("categories").select("*").order("sort_order"),
          client.from("tables").select("*").order("table_number"),
        ])
        if (menuRes.error) throw new Error(menuRes.error.message)
        if (menuRes.data) {
          setMenuItems(menuRes.data.map((m: any) => ({
            id: m.id, name: m.name, slug: m.slug, price: Number(m.price),
            image_url: m.image_url || "", category_id: m.category_id,
            category_name: m.categories?.name || "",
            is_available: m.is_available, preparation_time: m.preparation_time || 5,
            is_featured: m.is_featured || false,
          })))
        }
        if (catRes.data) setCategories(catRes.data as Category[])
        if (tablesRes.data) setTables(tablesRes.data as TableInfo[])
      } catch (err) {
        setMenuError(err instanceof Error ? err.message : "Failed to load menu data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [supabase])

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, notes: "" }]
    })
  }, [])

  const updateQty = useCallback((id: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter((i) => i.quantity > 0))
  }, [])

  const updateItemNotes = useCallback((id: string, notes: string) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, notes } : i))
    setEditingCartItem(null)
  }, [])

  const searchMember = useCallback(async (query: string) => {
    if (!query.trim()) { setFoundMember(null); return }
    setMemberSearching(true)
    const client = supabase()
    const { data } = await client
      .from("users")
      .select("id, full_name, email, phone, membership_tier, loyalty_points")
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(1)
      .maybeSingle()
    if (data) setFoundMember(data as MemberInfo)
    setMemberSearching(false)
  }, [supabase])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function applyVoucher() {
    setVoucherError("")
    setVoucherApplied(null)
    if (!voucherCode.trim()) return
    const v = VOUCHERS[voucherCode.toUpperCase()]
    if (!v) { setVoucherError("Invalid voucher code"); return }
    if (subtotal < v.minPurchase) { setVoucherError(`Min. purchase IDR ${v.minPurchase.toLocaleString()}`); return }
    const amount = v.type === "percent" ? Math.round(subtotal * v.value / 100) : v.value
    setVoucherApplied({ label: `${voucherCode.toUpperCase()} (${v.type === "percent" ? `${v.value}%` : `IDR ${v.value.toLocaleString()}`})`, amount })
  }
  const voucherAmount = voucherApplied?.amount || 0
  const pointsRedeemed = useMemberPoints && foundMember ? Math.min(foundMember.loyalty_points, subtotal * 0.2, 50000) : 0
  const discountAmount = Math.round(subtotal * (discountPercent / 100)) + voucherAmount + Math.round(pointsRedeemed)
  const tax = Math.round((subtotal - Math.round(subtotal * (discountPercent / 100))) * 0.1)
  const serviceCharge = Math.round(subtotal * 0.05)
  const total = Math.max(0, subtotal - discountAmount + tax + serviceCharge)

  const placeOrder = async () => {
    if (cart.length === 0) return
    setPlacing(true)
    setError("")
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outlet_id: "a1000000-0000-0000-0000-000000000001",
          table_id: selectedTable?.id || null,
          items: cart.map((i) => ({ menu_item_id: i.id, name: i.name, price: i.price, quantity: i.quantity, notes: i.notes })),
          notes: orderNotes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to place order")
      setPlacedOrder({ id: data.order.id, total: data.order.total })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setPlacing(false)
    }
  }

  const handleNewOrder = () => {
    setCart([]); setPlacedOrder(null); setShowPay(false)
    setSplits([]); setSplitCount(2); setOrderNotes("")
    setSelectedTable(null); setDiscountPercent(0); setVoucherCode("")
    setUseMemberPoints(false); setSelectedPayment("qris")
    setPaymentStep("select"); setCustomerName(""); setCustomerPhone("")
  }

  const handleConfirmPayment = async () => {
    if (!placedOrder) return
    try {
      const res = await fetch("/api/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: placedOrder.id, status: "completed" }),
      })
      if (res.ok) {
        await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: placedOrder.id, payment_status: "paid", payment_method: selectedPayment }),
        })
      }
    } catch {
      setError("Payment confirmation failed. Please try again.")
    }
  }

  const catNames = ["All", ...categories.map((c) => c.name)]
  const filteredItems = menuItems.filter((i) => {
    const matchCat = selectedCat === "All" || i.category_name === selectedCat
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  if (checking || loading) {
    return (
      <div style={{ background: "#16110D" }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(200,169,106,0.15)", border: "1px solid rgba(200,169,106,0.2)" }}>
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C8A96A" }} />
          </div>
          <p className="text-sm" style={{ color: "rgba(248,242,233,0.4)" }}>Loading POS system...</p>
        </div>
      </div>
    )
  }

  if (!authorized) return null

  const renderSidebar = (isMobile = false) => (
    <nav className="space-y-0.5">
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = activeView === item.id
        return (
          <Link key={item.id} href={`/pos${item.id !== "pos" ? `/${item.id}` : ""}`}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 text-left no-underline ${
              isActive ? "text-[#F8F2E9]" : "text-[rgba(248,242,233,0.35)] hover:text-[rgba(248,242,233,0.7)]"
            }`}
            style={isActive ? { background: "rgba(200,169,106,0.12)" } : {}}
            onClick={() => { if (isMobile) setMobileSidebar(false) }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={isActive ? { background: "rgba(200,169,106,0.15)" } : { background: "rgba(255,255,255,0.04)" }}>
              <Icon className="w-4 h-4" />
            </div>
            {(sidebarOpen || isMobile) && <span className="truncate">{item.label}</span>}
          </Link>
        )
      })}
      <div className="pt-3 mt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={() => { const c = createClient(); c.auth.signOut(); window.location.href = "/auth" }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 text-[rgba(248,242,233,0.35)] hover:text-red-400"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
            <LogOut className="w-4 h-4" />
          </div>
          {(sidebarOpen || isMobile) && <span className="truncate">Logout</span>}
        </button>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen flex" style={{ background: "#16110D" }}>
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(200,169,106,0.04) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(200,169,106,0.02) 0%, transparent 50%)" }} />

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col shrink-0 transition-all duration-300 relative z-10 ${sidebarOpen ? "w-56" : "w-16"}`}>
        <div className="h-full m-2 rounded-3xl flex flex-col overflow-hidden backdrop-blur-2xl"
          style={{ background: "linear-gradient(180deg, rgba(33,25,19,0.8) 0%, rgba(33,25,19,0.4) 100%)", border: "1px solid rgba(200,169,106,0.08)" }}>
          <div className="flex items-center gap-3 p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)" }}>
              <Coffee className="w-5 h-5 text-[#16110D]" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "#F8F2E9" }}>Skyhook POS</p>
                <p className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>v2.0 — {userRole}</p>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              {sidebarOpen ? <ChevronLeft className="w-3 h-3" style={{ color: "rgba(248,242,233,0.4)" }} /> : <ChevronRight className="w-3 h-3" style={{ color: "rgba(248,242,233,0.4)" }} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-none">
            {renderSidebar()}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setMobileSidebar(false)}>
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 left-0 bottom-0 w-72 p-4"
              style={{ background: "#16110D", borderRight: "1px solid rgba(200,169,106,0.08)" }}>
              <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)" }}>
                  <Coffee className="w-5 h-5 text-[#16110D]" />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#F8F2E9" }}>Skyhook POS</p>
                  <p className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>{userRole}</p>
                </div>
              </div>
              {renderSidebar(true)}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 h-14 shrink-0 relative z-10"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(22,17,13,0.8)", backdropFilter: "blur(16px)" }}>
          <button onClick={() => setMobileSidebar(true)} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <MenuIcon className="w-4 h-4" style={{ color: "rgba(248,242,233,0.5)" }} />
          </button>
          <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg"
            style={{ background: "rgba(59,178,115,0.08)", border: "1px solid rgba(59,178,115,0.12)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3BB273" }} />
            <span style={{ color: "#3BB273" }}>POS Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs ml-2"
            style={{ color: "rgba(248,242,233,0.3)" }}>
            <Clock className="w-3 h-3" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(248,242,233,0.4)" }}>
            <MapPin className="w-3 h-3" />
            <span>Table {selectedTable?.table_number || "—"}</span>
          </div>
        </header>

        {/* POS Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center: Menu Grid */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 scrollbar-thin">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(248,242,233,0.25)" }} />
                <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search menu, coffee, food..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all placeholder:text-sm"
                  style={{ background: "rgba(33,25,19,0.6)", border: "1px solid rgba(200,169,106,0.08)", color: "#F8F2E9" }}
                />
              </div>

              {/* Category Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {catNames.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCat(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      selectedCat === cat
                        ? "text-[#16110D]"
                        : "text-[rgba(248,242,233,0.4)] hover:text-[rgba(248,242,233,0.7)]"
                    }`}
                    style={selectedCat === cat ? { background: "#C8A96A" } : { background: "rgba(33,25,19,0.5)" }}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              {menuError ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(217,83,79,0.5)" }} />
                  <p className="text-xs" style={{ color: "rgba(248,242,233,0.3)" }}>{menuError}</p>
                  <button onClick={() => window.location.reload()}
                    className="text-xs mt-2 underline transition-all" style={{ color: "rgba(200,169,106,0.5)" }}>
                    Retry
                  </button>
                </div>
              ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {filteredItems.map((item, i) => (
                  <motion.button key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.015 }}
                    onClick={() => addToCart(item)}
                    className="relative rounded-2xl text-left overflow-hidden transition-all duration-200 group hover:-translate-y-0.5"
                    style={{ background: "rgba(33,25,19,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    {/* Image */}
                    <div className="w-full h-20 sm:h-24 overflow-hidden" style={{ background: "rgba(33,25,19,0.8)" }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Coffee className="w-6 h-6" style={{ color: "rgba(200,169,106,0.2)" }} />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <p className="text-xs font-medium truncate" style={{ color: "#F8F2E9" }}>{item.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-semibold" style={{ color: "#C8A96A" }}>IDR {item.price.toLocaleString()}</span>
                        {item.preparation_time > 0 && (
                          <span className="text-[9px]" style={{ color: "rgba(248,242,233,0.25)" }}>
                            {item.preparation_time}m
                          </span>
                        )}
                      </div>
                      {/* Quick Add */}
                      <div className="mt-1.5 w-full py-1.5 rounded-lg text-[10px] font-semibold text-center transition-all opacity-0 group-hover:opacity-100"
                        style={{ background: "rgba(200,169,106,0.15)", color: "#C8A96A" }}>
                        + Add
                      </div>
                    </div>
                    {item.is_featured && (
                      <div className="absolute top-1.5 right-1.5">
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(200,169,106,0.2)", color: "#C8A96A" }}>
                          POPULAR
                        </span>
                      </div>
                    )}
                  </motion.button>
                ))}
                {filteredItems.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <Search className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(248,242,233,0.1)" }} />
                    <p className="text-sm" style={{ color: "rgba(248,242,233,0.2)" }}>No items found</p>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>

          {/* Right: Cart Panel */}
          <div className="w-80 xl:w-96 shrink-0 flex flex-col overflow-hidden relative"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.04)", background: "rgba(22,17,13,0.6)", backdropFilter: "blur(8px)" }}>

            {/* Order Info Header */}
            <div className="p-4 space-y-2.5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold" style={{ color: "#F8F2E9" }}>Current Order</h2>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} className="text-[11px] px-2 py-1 rounded-lg transition-all"
                    style={{ background: "rgba(217,83,79,0.1)", color: "#D9534F" }}>
                    Clear
                  </button>
                )}
              </div>

              {/* Table & Order Type */}
              <div className="flex gap-2">
                <button onClick={() => setShowTablePicker(true)}
                  className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-medium transition-all"
                  style={{ background: "rgba(33,25,19,0.6)", border: "1px solid rgba(255,255,255,0.04)", color: selectedTable ? "#C8A96A" : "rgba(248,242,233,0.35)" }}>
                  <Table2 className="w-3 h-3" />
                  {selectedTable ? `Table ${selectedTable.table_number}` : "Select Table"}
                </button>
                <div className="relative">
                  <button onClick={() => setShowOrderType(!showOrderType)}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-medium transition-all whitespace-nowrap"
                    style={{ background: "rgba(33,25,19,0.6)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(248,242,233,0.6)" }}>
                    {orderType}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showOrderType && (
                    <div className="absolute top-full right-0 mt-1 w-36 rounded-xl overflow-hidden z-20"
                      style={{ background: "#211913", border: "1px solid rgba(200,169,106,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                      {ORDER_TYPE_OPTIONS.map((opt) => (
                        <button key={opt} onClick={() => { setOrderType(opt); setShowOrderType(false) }}
                          className="w-full px-3 py-2 text-xs text-left transition-all"
                          style={{ color: opt === orderType ? "#C8A96A" : "rgba(248,242,233,0.5)", background: opt === orderType ? "rgba(200,169,106,0.08)" : "transparent" }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Customer & Member */}
              <div className="flex gap-2">
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer name"
                  className="flex-1 px-2.5 py-1.5 rounded-xl text-[11px] outline-none"
                  style={{ background: "rgba(33,25,19,0.6)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(248,242,233,0.6)" }} />
              </div>
              <div className="relative">
                <input value={memberLookup} onChange={(e) => { setMemberLookup(e.target.value); searchMember(e.target.value) }}
                  placeholder="Find member (name/email/phone)"
                  className="w-full px-2.5 py-1.5 rounded-xl text-[11px] outline-none"
                  style={{ background: "rgba(33,25,19,0.6)", border: `1px solid ${foundMember ? "rgba(200,169,106,0.2)" : "rgba(255,255,255,0.04)"}`, color: "rgba(248,242,233,0.6)" }} />
                {foundMember && (
                  <div className="flex items-center gap-2 mt-1.5 px-2.5 py-1.5 rounded-lg"
                    style={{ background: "rgba(200,169,106,0.06)" }}>
                    <Star className="w-3 h-3 shrink-0" style={{ color: "#C8A96A" }} />
                    <span className="text-[10px] font-medium" style={{ color: "#C8A96A" }}>{foundMember.full_name}</span>
                    <span className="text-[9px]" style={{ color: "rgba(248,242,233,0.3)" }}>{foundMember.membership_tier}</span>
                    <span className="text-[9px] ml-auto" style={{ color: "rgba(248,242,233,0.3)" }}>{foundMember.loyalty_points} pts</span>
                  </div>
                )}
                {memberSearching && <Loader2 className="w-3 h-3 animate-spin absolute right-3 top-2.5" style={{ color: "rgba(248,242,233,0.2)" }} />}
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
              {placedOrder ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(59,178,115,0.15)" }}>
                    <CheckCircle className="w-7 h-7" style={{ color: "#3BB273" }} />
                  </div>
                  <h3 className="text-base font-bold" style={{ color: "#F8F2E9" }}>Order Placed!</h3>
                  <p className="text-xs" style={{ color: "rgba(248,242,233,0.3)" }}>
                    #{placedOrder.id.slice(0, 8).toUpperCase()}
                  </p>

                  {splits.length > 0 && (
                    <div className="w-full space-y-1.5 mt-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(248,242,233,0.25)" }}>Split Bill</p>
                      {splits.map((s, i) => (
                        <div key={s.id || i} className="flex items-center justify-between px-3 py-2 rounded-xl"
                          style={{ background: "rgba(33,25,19,0.5)" }}>
                          <span className="text-xs" style={{ color: "#F8F2E9" }}>{s.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold" style={{ color: "#C8A96A" }}>IDR {Number(s.amount).toLocaleString()}</span>
                            <span className="text-[10px]" style={{ color: s.payment_status === "paid" ? "#3BB273" : "rgba(248,242,233,0.2)" }}>
                              {s.payment_status === "paid" ? "Paid" : "Unpaid"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {splits.length === 0 && (
                    <p className="text-lg font-bold" style={{ color: "#C8A96A" }}>IDR {Number(placedOrder.total).toLocaleString()}</p>
                  )}

                  <div className="w-full space-y-2 pt-3">
                    <button onClick={() => setShowPay(true)}
                      className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                      style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}>
                      <CreditCard className="w-4 h-4 inline mr-2 -mt-0.5" />Pay Now
                    </button>
                    {splits.length === 0 && (
                      <button onClick={() => setShowSplit(true)}
                        className="w-full py-2.5 rounded-2xl text-xs font-medium transition-all"
                        style={{ background: "rgba(200,169,106,0.1)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.15)" }}>
                        <Users className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Split Bill
                      </button>
                    )}
                    <button onClick={() => window.open(`/receipt?order_id=${placedOrder.id}`, "_blank")}
                      className="w-full py-2 rounded-xl text-xs transition-all"
                      style={{ color: "rgba(248,242,233,0.3)", background: "rgba(255,255,255,0.03)" }}>
                      <Printer className="w-3 h-3 inline mr-1.5 -mt-0.5" />Print Receipt
                    </button>
                    <button onClick={handleNewOrder}
                      className="w-full py-2 rounded-xl text-xs font-medium transition-all"
                      style={{ color: "rgba(248,242,233,0.5)", background: "rgba(255,255,255,0.03)" }}>
                      <Plus className="w-3 h-3 inline mr-1.5 -mt-0.5" />New Order
                    </button>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Coffee className="w-10 h-10 mb-3" style={{ color: "rgba(200,169,106,0.12)" }} />
                  <p className="text-xs" style={{ color: "rgba(248,242,233,0.2)" }}>Select items to start order</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div key={item.id} layout
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative group rounded-xl p-2.5 transition-all"
                    style={{ background: "rgba(33,25,19,0.4)", border: editingCartItem === item.id ? "1px solid rgba(200,169,106,0.2)" : "1px solid transparent" }}>
                    <div className="flex items-start gap-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "#F8F2E9" }}>{item.name}</p>
                        <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#C8A96A" }}>
                          IDR {(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.notes && (
                          <p className="text-[10px] mt-0.5 italic" style={{ color: "rgba(242,165,65,0.6)" }}>
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(255,255,255,0.04)" }}>
                          {item.quantity === 1 ? <Trash2 className="w-3 h-3" style={{ color: "rgba(248,242,233,0.3)" }} /> : <Minus className="w-3 h-3" style={{ color: "rgba(248,242,233,0.3)" }} />}
                        </button>
                        <span className="w-6 text-center text-xs font-medium" style={{ color: "#F8F2E9" }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                          style={{ background: "rgba(200,169,106,0.1)" }}>
                          <Plus className="w-3 h-3" style={{ color: "#C8A96A" }} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => {
                      setEditingCartItem(editingCartItem === item.id ? null : item.id)
                      setItemNoteInput(item.notes || "")
                    }}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <Edit3 className="w-3 h-3" style={{ color: "rgba(248,242,233,0.3)" }} />
                    </button>
                    {editingCartItem === item.id && (
                      <div className="mt-2 flex gap-1.5">
                        <input value={itemNoteInput} onChange={(e) => setItemNoteInput(e.target.value)}
                          placeholder="Notes (less sugar, no ice...)"
                          className="flex-1 px-2 py-1.5 rounded-lg text-[10px] outline-none"
                          style={{ background: "rgba(22,17,13,0.6)", color: "rgba(248,242,233,0.6)" }}
                          onKeyDown={(e) => { if (e.key === "Enter") updateItemNotes(item.id, itemNoteInput) }} />
                        <button onClick={() => updateItemNotes(item.id, itemNoteInput)}
                          className="px-2 py-1.5 rounded-lg text-[10px] font-medium"
                          style={{ background: "rgba(200,169,106,0.15)", color: "#C8A96A" }}>
                          <CornerDownLeft className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Payment Summary */}
            {!placedOrder && cart.length > 0 && (
              <div className="shrink-0 p-4 space-y-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                {/* Order Notes */}
                <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Order notes (optional)"
                  className="w-full px-3 py-2 rounded-xl text-[11px] outline-none resize-none h-8 transition-all focus:h-16"
                  style={{ background: "rgba(33,25,19,0.6)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(248,242,233,0.5)" }} />

                {/* Discount & Voucher */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px]"
                    style={{ background: "rgba(242,165,65,0.08)", color: "#F2A541" }}>
                    <Percent className="w-3 h-3" />
                    <select value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="bg-transparent outline-none text-[10px]"
                      style={{ color: "#F2A541" }}>
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={10}>10%</option>
                      <option value={15}>15%</option>
                      <option value={20}>20%</option>
                      <option value={25}>25%</option>
                      <option value={50}>50%</option>
                    </select>
                  </div>
                  <div className="flex-1 flex items-center gap-1">
                    <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      placeholder="Voucher"
                      className="flex-1 px-2 py-1.5 rounded-lg text-[10px] outline-none"
                      style={{ background: "rgba(33,25,19,0.6)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(248,242,233,0.5)" }} />
                    <button onClick={applyVoucher}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                      style={{ background: voucherApplied ? "rgba(59,178,115,0.1)" : "rgba(200,169,106,0.1)", color: voucherApplied ? "#3BB273" : "#C8A96A" }}>
                      {voucherApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                </div>
                {voucherApplied && (
                  <div className="flex items-center justify-between px-2 py-1 rounded-lg text-[10px]"
                    style={{ background: "rgba(59,178,115,0.06)", color: "#3BB273" }}>
                    <span>{voucherApplied.label}</span>
                    <button onClick={() => { setVoucherApplied(null); setVoucherCode("") }}><X className="w-3 h-3" /></button>
                  </div>
                )}
                {voucherError && (
                  <p className="text-[10px]" style={{ color: "#D9534F" }}>{voucherError}</p>
                )}

                {/* Member Points */}
                {foundMember && foundMember.loyalty_points > 0 && (
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px]"
                    style={{ background: useMemberPoints ? "rgba(200,169,106,0.08)" : "rgba(33,25,19,0.4)" }}>
                    <button onClick={() => setUseMemberPoints(!useMemberPoints)}
                      className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold transition-all ${useMemberPoints ? "" : ""}`}
                      style={{ background: useMemberPoints ? "#C8A96A" : "rgba(255,255,255,0.08)", color: useMemberPoints ? "#16110D" : "transparent" }}>
                      {useMemberPoints ? "✓" : ""}
                    </button>
                    <span style={{ color: "rgba(248,242,233,0.4)" }}>Redeem {Math.min(foundMember.loyalty_points, 50000).toLocaleString()} pts</span>
                    {useMemberPoints && <span style={{ color: "#C8A96A" }}>-IDR {Math.round(pointsRedeemed).toLocaleString()}</span>}
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(248,242,233,0.3)" }}>Subtotal</span>
                    <span style={{ color: "rgba(248,242,233,0.6)" }}>IDR {subtotal.toLocaleString()}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: "#F2A541" }}>Discount ({discountPercent}%)</span>
                      <span style={{ color: "#F2A541" }}>-IDR {Math.round(subtotal * discountPercent / 100).toLocaleString()}</span>
                    </div>
                  )}
                  {voucherApplied && (
                    <div className="flex justify-between">
                      <span style={{ color: "#3BB273" }}>Voucher</span>
                      <span style={{ color: "#3BB273" }}>-IDR {voucherAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {useMemberPoints && foundMember && (
                    <div className="flex justify-between">
                      <span style={{ color: "#C8A96A" }}>Points Redeemed</span>
                      <span style={{ color: "#C8A96A" }}>-IDR {Math.round(pointsRedeemed).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(248,242,233,0.3)" }}>Tax (10%)</span>
                    <span style={{ color: "rgba(248,242,233,0.6)" }}>IDR {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(248,242,233,0.3)" }}>Service (5%)</span>
                    <span style={{ color: "rgba(248,242,233,0.6)" }}>IDR {serviceCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-bold"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span style={{ color: "#F8F2E9" }}>Total</span>
                    <span style={{ color: "#C8A96A" }}>IDR {total.toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <p className="text-[11px] px-3 py-2 rounded-xl" style={{ background: "rgba(217,83,79,0.1)", color: "#D9534F" }}>
                    {error}
                  </p>
                )}

                {/* Place Order Button */}
                <button onClick={placeOrder} disabled={cart.length === 0 || placing}
                  className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}>
                  {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                  {placing ? "Placing Order..." : `Place Order · IDR ${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Picker Modal */}
      <AnimatePresence>
        {showTablePicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowTablePicker(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl overflow-hidden"
              style={{ background: "#211913", border: "1px solid rgba(200,169,106,0.1)" }}>
              <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <h2 className="text-sm font-bold" style={{ color: "#F8F2E9" }}>Select Table</h2>
                <button onClick={() => setShowTablePicker(false)} style={{ color: "rgba(248,242,233,0.3)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 max-h-80 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2">
                  {tables.map((t) => {
                    const statusColor = t.status === "available" ? "#3BB273" : t.status === "occupied" ? "#D9534F" : t.status === "reserved" ? "#F2A541" : "rgba(248,242,233,0.15)"
                    return (
                      <button key={t.id} onClick={() => { setSelectedTable(t); setShowTablePicker(false) }}
                        className="p-2.5 rounded-xl text-center transition-all"
                        style={{
                          background: selectedTable?.id === t.id ? "rgba(200,169,106,0.15)" : "rgba(33,25,19,0.5)",
                          border: `1px solid ${selectedTable?.id === t.id ? "rgba(200,169,106,0.3)" : "rgba(255,255,255,0.04)"}`,
                        }}>
                        <span className="text-xs font-bold" style={{ color: "#F8F2E9" }}>{t.table_number}</span>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                          <span className="text-[9px]" style={{ color: "rgba(248,242,233,0.3)" }}>{t.section}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split Bill Modal */}
      <AnimatePresence>
        {showSplit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 0.95 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: "#211913", border: "1px solid rgba(200,169,106,0.1)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold" style={{ color: "#F8F2E9" }}>Split Bill</h2>
                <button onClick={() => setShowSplit(false)} style={{ color: "rgba(248,242,233,0.3)" }}><X className="w-4 h-4" /></button>
              </div>
              <p className="text-xs mb-4" style={{ color: "rgba(248,242,233,0.4)" }}>
                Split IDR {Number(placedOrder?.total).toLocaleString()} equally
              </p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <button onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <Minus className="w-4 h-4" style={{ color: "rgba(248,242,233,0.5)" }} />
                </button>
                <span className="text-2xl font-bold w-8 text-center" style={{ color: "#F8F2E9" }}>{splitCount}</span>
                <button onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <Plus className="w-4 h-4" style={{ color: "rgba(248,242,233,0.5)" }} />
                </button>
              </div>
              <p className="text-[11px] text-center mb-5" style={{ color: "rgba(248,242,233,0.25)" }}>
                {splitCount} people — IDR {Math.round(Number(placedOrder?.total || 0) / splitCount / 100) * 100} each
              </p>
              <button onClick={() => {
                const total = placedOrder?.total || 0
                const perPerson = Math.round((total / splitCount) / 100) * 100
                const remainder = total - perPerson * splitCount
                setSplits(Array.from({ length: splitCount }, (_, i) => ({
                  label: `Person ${i + 1}`, amount: i === 0 ? perPerson + remainder : perPerson,
                })))
                setShowSplit(false)
              }}
                className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}>
                <Users className="w-4 h-4 inline mr-2 -mt-0.5" />Split into {splitCount}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPay && placedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowPay(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl overflow-hidden backdrop-blur-2xl"
              style={{ background: "rgba(33,25,19,0.95)", border: "1px solid rgba(200,169,106,0.1)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(200,169,106,0.04) 0%, transparent 60%)" }} />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold" style={{ color: "#F8F2E9" }}>Payment</h2>
                  <div className="text-right">
                    <p className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>Order #{placedOrder.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="text-center mb-5">
                  <p className="text-xs" style={{ color: "rgba(248,242,233,0.4)" }}>Total Amount</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: "#C8A96A" }}>IDR {Number(placedOrder.total).toLocaleString()}</p>
                </div>

                {paymentStep === "select" && (
                  <>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      {PAYMENT_METHODS.map((pm) => (
                        <button key={pm.id} onClick={() => { setSelectedPayment(pm.id); setPaymentStep("confirm") }}
                          className="p-3 rounded-2xl text-center transition-all"
                          style={{
                            background: selectedPayment === pm.id ? "rgba(200,169,106,0.12)" : "rgba(33,25,19,0.5)",
                            border: `1px solid ${selectedPayment === pm.id ? "rgba(200,169,106,0.2)" : "rgba(255,255,255,0.04)"}`,
                          }}>
                          <pm.icon className="w-5 h-5 mx-auto mb-1" style={{ color: selectedPayment === pm.id ? "#C8A96A" : "rgba(248,242,233,0.3)" }} />
                          <p className="text-[10px] font-medium" style={{ color: selectedPayment === pm.id ? "#C8A96A" : "rgba(248,242,233,0.4)" }}>
                            {pm.label}
                          </p>
                        </button>
                      ))}
                    </div>

                    <button onClick={() => setShowPay(false)}
                      className="w-full py-2.5 rounded-2xl text-xs transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", color: "rgba(248,242,233,0.4)" }}>
                      Cancel
                    </button>
                  </>
                )}

                {paymentStep === "confirm" && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl text-center"
                      style={{ background: "rgba(200,169,106,0.06)", border: "1px solid rgba(200,169,106,0.1)" }}>
                      <p className="text-xs font-medium" style={{ color: "#C8A96A" }}>
                        {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.label}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(248,242,233,0.3)" }}>
                        {PAYMENT_METHODS.find((m) => m.id === selectedPayment)?.desc}
                      </p>
                    </div>

                    <button onClick={() => setPaymentStep("select")}
                      className="w-full py-2 rounded-xl text-[11px] transition-all"
                      style={{ background: "rgba(255,255,255,0.03)", color: "rgba(248,242,233,0.3)" }}>
                      Change method
                    </button>

                    <button onClick={() => { handleConfirmPayment(); setShowPay(false); handleNewOrder() }}
                      className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}>
                      <CheckCircle className="w-4 h-4" />
                      Confirm Payment
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}
