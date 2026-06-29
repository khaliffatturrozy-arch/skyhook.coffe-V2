"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import {
  Coffee, Table2, Users, Clock, Bell, CheckCircle2,
  Plus, Minus, Send, Search, X, Loader2, Utensils,
  MapPin, CreditCard, QrCode, ShoppingBag,
} from "lucide-react"

type MenuItem = {
  id: string; name: string; price: number; image_url: string
  category_name: string; preparation_time: number; is_featured: boolean
}

type Category = { id: string; name: string }

type TableInfo = {
  id: string; table_number: string; capacity: number
  status: string; section: string
}

type OrderSummary = {
  id: string; status: string; total: number
  created_at: string; table_id: string | null
  order_items: { menu_item_name: string; quantity: number }[]
}

const TABLE_SECTIONS = [
  { key: "indoor", label: "Indoor Area", icon: Coffee },
  { key: "rooftop", label: "Rooftop Area", icon: Coffee },
  { key: "vip", label: "VIP Lounge", icon: Users },
  { key: "event", label: "Event Area", icon: MapPin },
]

const STATUS_COLORS: Record<string, string> = {
  available: "#3BB273", occupied: "#D9534F",
  reserved: "#F2A541", cleaning: "#7A6045",
}

function elapsed(created: string) {
  const diff = Date.now() - new Date(created).getTime()
  const m = Math.floor(diff / 60000)
  return m > 0 ? `${m}m` : `${Math.floor(diff / 1000)}s`
}

export default function WaiterPage() {
  const supabase = useCallback(() => createClient(), [])
  const [checking, setChecking] = useState(true)
  const [tables, setTables] = useState<TableInfo[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeOrders, setActiveOrders] = useState<OrderSummary[]>([])
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null)
  const [selectedCat, setSelectedCat] = useState("All")
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([])
  const [section, setSection] = useState("rooftop")
  const [showOrderPanel, setShowOrderPanel] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")
  const [placedOrder, setPlacedOrder] = useState<{ id: string; total: number } | null>(null)
  const [recentOrder, setRecentOrder] = useState<OrderSummary | null>(null)
  const [error, setError] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    (async () => {
      const client = supabase()
      const { data: { session } } = await client.auth.getSession()
      if (!session?.user?.id) { window.location.href = "/auth"; return }
      const { data: staff } = await client.from("staff").select("role").eq("user_id", session.user.id).maybeSingle()
      if (!staff || !["server", "waiter", "cashier", "admin", "manager", "host"].includes(staff.role)) {
        window.location.href = "/dashboard"; return
      }
      setChecking(false)
    })()
  }, [supabase])

  useEffect(() => {
    (async () => {
      const client = supabase()
      const [tablesRes, menuRes, catRes, ordersRes] = await Promise.all([
        client.from("tables").select("*").order("table_number"),
        client.from("menu").select("*, categories(name)").eq("is_available", true).order("sort_order"),
        client.from("categories").select("*").order("sort_order"),
        client.from("orders").select("*, order_items(*)").in("status", ["pending", "preparing", "ready", "completed"]).order("created_at", { ascending: false }),
      ])
      if (tablesRes.data) setTables(tablesRes.data as TableInfo[])
      if (menuRes.data) {
        setMenuItems(menuRes.data.map((m: any) => ({
          id: m.id, name: m.name, price: Number(m.price), image_url: m.image_url || "",
          category_name: m.categories?.name || "", preparation_time: m.preparation_time || 5,
          is_featured: m.is_featured || false,
        })))
      }
      if (catRes.data) setCategories(catRes.data as Category[])
      if (ordersRes.data) setActiveOrders(ordersRes.data as OrderSummary[])
    })()
  }, [supabase])

  const filteredTables = tables.filter((t) => t.section?.toLowerCase() === section)
  const catNames = ["All", ...categories.map((c) => c.name)]
  const filteredItems = menuItems.filter((i) => {
    const matchCat = selectedCat === "All" || i.category_name === selectedCat
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter((i) => i.quantity > 0))
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const grandTotal = total + Math.round(total * 0.1)

  const placeOrder = async () => {
    if (cart.length === 0 || !selectedTable) return
    setPlacing(true)
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outlet_id: "a1000000-0000-0000-0000-000000000001",
          table_id: selectedTable.id,
          items: cart.map((i) => ({ menu_item_id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          notes: orderNotes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPlacedOrder({ id: data.order.id, total: data.order.total })
      setRecentOrder({ ...data.order, order_items: cart.map((i) => ({ menu_item_name: i.name, quantity: i.quantity })) })
      setTables((prev) => prev.map((t) => t.id === selectedTable.id ? { ...t, status: "occupied" } : t))
    } catch (e) {
      setError((e as Error).message || "Failed to place order")
    } finally { setPlacing(false) }
  }

  const callWaiter = async (tableId: string) => {
    await fetch("/api/waiter-calls", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_id: tableId, type: "assistance" }),
    })
  }

  const requestBill = async (tableId: string) => {
    await fetch("/api/waiter-calls", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_id: tableId, type: "bill" }),
    })
  }

  const tableOrders = selectedTable ? activeOrders.filter((o) => o.table_id === selectedTable.id) : []

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#16110D" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C8A96A" }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#16110D" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(200,169,106,0.03) 0%, transparent 60%)" }} />

      {/* Header */}
      <header className="px-4 h-14 flex items-center justify-between relative z-10"
        style={{ background: "rgba(22,17,13,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)" }}>
            <Coffee className="w-4 h-4 text-[#16110D]" />
          </div>
          <span className="text-sm font-bold" style={{ color: "#F8F2E9" }}>Waiter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg" style={{ background: "rgba(59,178,115,0.08)", color: "#3BB273" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3BB273" }} />
            Online
          </div>
          <Clock className="w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.3)" }} />
          <span className="text-[11px]" style={{ color: "rgba(248,242,233,0.3)" }}>{new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Left: Table Map */}
        <div className="w-80 shrink-0 flex flex-col overflow-hidden" style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="p-3 space-y-1">
            <h2 className="text-xs font-semibold" style={{ color: "#F8F2E9" }}>Table Map</h2>
            <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              {TABLE_SECTIONS.map((s) => (
                <button key={s.key} onClick={() => setSection(s.key)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all"
                  style={{
                    background: section === s.key ? "rgba(200,169,106,0.12)" : "rgba(33,25,19,0.5)",
                    color: section === s.key ? "#C8A96A" : "rgba(248,242,233,0.4)",
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#3BB273" }} /> Available</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#D9534F" }} /> Occupied</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#F2A541" }} /> Reserved</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 pt-0 space-y-1.5 scrollbar-thin">
            {filteredTables.map((table) => {
              const hasOrders = tableOrders.length > 0 && table.id === selectedTable?.id
              return (
                <motion.button key={table.id} layout
                  onClick={() => { setSelectedTable(table); setShowOrderPanel(true) }}
                  className="w-full rounded-xl p-3 text-left transition-all"
                  style={{
                    background: selectedTable?.id === table.id ? "rgba(200,169,106,0.08)" : "rgba(33,25,19,0.4)",
                    border: `1px solid ${selectedTable?.id === table.id ? "rgba(200,169,106,0.15)" : "rgba(255,255,255,0.04)"}`,
                    borderLeft: `3px solid ${STATUS_COLORS[table.status] || "rgba(255,255,255,0.1)"}`,
                  }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{ background: selectedTable?.id === table.id ? "rgba(200,169,106,0.15)" : "rgba(33,25,19,0.5)", color: "#F8F2E9" }}>
                        {table.table_number}
                      </div>
                      <div>
                        <p className="text-xs font-medium" style={{ color: "#F8F2E9" }}>Table {table.table_number}</p>
                        <p className="text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>
                          {table.capacity} seats · {table.section}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md capitalize"
                      style={{ background: `${STATUS_COLORS[table.status]}15`, color: STATUS_COLORS[table.status] }}>
                      {table.status}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Center: Table Detail + Ordering */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selectedTable ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Table2 className="w-12 h-12 mx-auto mb-3" style={{ color: "rgba(248,242,233,0.06)" }} />
                <p className="text-sm" style={{ color: "rgba(248,242,233,0.15)" }}>Select a table to start</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: "rgba(200,169,106,0.1)", color: "#C8A96A" }}>
                    {selectedTable.table_number}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold" style={{ color: "#F8F2E9" }}>Table {selectedTable.table_number}</h2>
                    <p className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>
                      {selectedTable.section} · {selectedTable.capacity} seats
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => callWaiter(selectedTable.id)}
                    className="px-3 py-2 rounded-xl text-[10px] font-medium transition-all flex items-center gap-1"
                    style={{ background: "rgba(242,165,65,0.1)", color: "#F2A541" }}>
                    <Bell className="w-3 h-3" /> Call Waiter
                  </button>
                  <button onClick={() => requestBill(selectedTable.id)}
                    className="px-3 py-2 rounded-xl text-[10px] font-medium transition-all flex items-center gap-1"
                    style={{ background: "rgba(200,169,106,0.1)", color: "#C8A96A" }}>
                    <CreditCard className="w-3 h-3" /> Request Bill
                  </button>
                </div>
              </div>

              {/* Active Orders for Table */}
              {tableOrders.length > 0 && (
                <div className="px-4 py-3 space-y-1.5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(248,242,233,0.2)" }}>Active Orders</p>
                  {tableOrders.slice(0, 3).map((o) => (
                    <div key={o.id} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "rgba(33,25,19,0.4)" }}>
                      <div>
                        <p className="text-[11px] font-medium" style={{ color: "#F8F2E9" }}>
                          #{o.id.slice(0, 6)} <span className="text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>{elapsed(o.created_at)} ago</span>
                        </p>
                        <p className="text-[9px]" style={{ color: "rgba(248,242,233,0.3)" }}>
                          {o.order_items?.map((i) => `${i.menu_item_name}x${i.quantity}`).join(", ")}
                        </p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md capitalize" style={{ background: `${o.status === "pending" ? "#F2A541" : o.status === "preparing" ? "#4A9EFF" : "#3BB273"}15`, color: o.status === "pending" ? "#F2A541" : o.status === "preparing" ? "#4A9EFF" : "#3BB273" }}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Menu Ordering */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(248,242,233,0.2)" }} />
                  <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Add items to table..."
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm outline-none"
                    style={{ background: "rgba(33,25,19,0.6)", border: "1px solid rgba(200,169,106,0.08)", color: "#F8F2E9" }}
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                  {catNames.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCat(cat)}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition-all shrink-0"
                      style={{
                        background: selectedCat === cat ? "#C8A96A" : "rgba(33,25,19,0.5)",
                        color: selectedCat === cat ? "#16110D" : "rgba(248,242,233,0.4)",
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {filteredItems.map((item, i) => (
                    <motion.button key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.015 }}
                      onClick={() => addToCart(item)}
                      className="rounded-2xl p-3 text-left transition-all active:scale-[0.97]"
                      style={{ background: "rgba(33,25,19,0.5)", border: "1px solid rgba(255,255,255,0.04)", minHeight: 80 }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-16 object-cover rounded-xl mb-2" />
                      ) : (
                        <div className="w-full h-16 rounded-xl mb-2 flex items-center justify-center" style={{ background: "rgba(200,169,106,0.06)" }}>
                          <Coffee className="w-5 h-5" style={{ color: "rgba(200,169,106,0.2)" }} />
                        </div>
                      )}
                      <p className="text-xs font-medium truncate" style={{ color: "#F8F2E9" }}>{item.name}</p>
                      <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#C8A96A" }}>IDR {item.price.toLocaleString()}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Quick Cart */}
        <div className="w-72 shrink-0 flex flex-col overflow-hidden" style={{ borderLeft: "1px solid rgba(255,255,255,0.04)", background: "rgba(22,17,13,0.6)" }}>
          {placedOrder ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(59,178,115,0.15)" }}>
                <CheckCircle2 className="w-7 h-7" style={{ color: "#3BB273" }} />
              </div>
              <h3 className="text-sm font-bold" style={{ color: "#F8F2E9" }}>Order Sent!</h3>
              <p className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>#{placedOrder.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-base font-bold" style={{ color: "#C8A96A" }}>IDR {placedOrder.total.toLocaleString()}</p>
              <button onClick={() => { setPlacedOrder(null); setCart([]); setOrderNotes("") }}
                className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}>
                <Plus className="w-4 h-4 inline mr-2 -mt-0.5" /> New Order
              </button>
            </div>
          ) : (
            <>
              <div className="p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <h3 className="text-xs font-semibold" style={{ color: "#F8F2E9" }}>
                  {selectedTable ? `Table ${selectedTable.table_number}` : "Select a table"}
                </h3>
                <p className="text-[10px]" style={{ color: "rgba(248,242,233,0.2)" }}>{cart.length} items · IDR {total.toLocaleString()}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <ShoppingBag className="w-8 h-8" style={{ color: "rgba(248,242,233,0.06)" }} />
                    <p className="text-[10px] mt-2" style={{ color: "rgba(248,242,233,0.15)" }}>Tap items to add</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 px-2.5 py-2 rounded-xl" style={{ background: "rgba(33,25,19,0.4)" }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={{ color: "#F8F2E9" }}>{item.name}</p>
                        <p className="text-[10px]" style={{ color: "#C8A96A" }}>IDR {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <Minus className="w-3 h-3" style={{ color: "rgba(248,242,233,0.3)" }} />
                        </button>
                        <span className="w-6 text-center text-xs font-medium" style={{ color: "#F8F2E9" }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(200,169,106,0.1)" }}>
                          <Plus className="w-3 h-3" style={{ color: "#C8A96A" }} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <textarea value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Table notes..."
                  className="w-full px-2.5 py-2 rounded-xl text-[10px] outline-none resize-none h-12"
                  style={{ background: "rgba(33,25,19,0.6)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(248,242,233,0.5)" }} />
                {error && (
                  <p className="text-[10px] px-2 py-1.5 rounded-xl" style={{ background: "rgba(217,83,79,0.1)", color: "#D9534F" }}>
                    {error}
                  </p>
                )}
                <div className="flex justify-between text-xs pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color: "rgba(248,242,233,0.3)" }}>Total</span>
                  <span className="font-bold" style={{ color: "#C8A96A" }}>IDR {grandTotal.toLocaleString()}</span>
                </div>
                <button onClick={placeOrder} disabled={cart.length === 0 || !selectedTable || placing}
                  className="w-full py-3 rounded-2xl text-sm font-semibold transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}>
                  {placing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {placing ? "Sending..." : "Send to Kitchen"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
