"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { AdminSectionHeader } from "@/components/admin/admin-glass-card"
import {
  Search, Eye, Loader2, Clock, Bell, Zap, CheckCircle2,
  UtensilsCrossed, DollarSign, X, Printer, ChevronRight,
  ListOrdered, ArrowLeft, Smartphone,
} from "lucide-react"

type OrderItem = {
  id: string
  menu_item_name: string
  quantity: number
  unit_price: number
  subtotal: number
  status: string
  notes?: string
}

type Order = {
  id: string
  table_id: string | null
  tables: { table_number: string } | null
  status: string
  payment_status: string
  payment_method: string | null
  subtotal: number
  tax: number
  total: number
  notes: string | null
  created_at: string
  order_items: OrderItem[]
}

const COLUMNS = [
  { key: "pending", label: "New", icon: Bell, color: "#F2A541", desc: "Awaiting confirmation" },
  { key: "preparing", label: "Preparing", icon: Zap, color: "#4A9EFF", desc: "In the kitchen" },
  { key: "ready", label: "Ready", icon: UtensilsCrossed, color: "#3BB273", desc: "Ready to serve" },
  { key: "completed", label: "Served", icon: CheckCircle2, color: "#10B981", desc: "Delivered to table" },
  { key: "paid", label: "Paid", icon: DollarSign, color: "#8B5CF6", desc: "Payment completed" },
]

function elapsed(created: string) {
  const diff = Date.now() - new Date(created).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

const STATUS_NEXT: Record<string, string> = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
}

export default function AdminOrdersPage() {
  const supabase = useCallback(() => createClient(), [])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [view, setView] = useState<"kanban" | "table">("kanban")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null)

  const fetchOrders = useCallback(async () => {
    const res = await fetch(`/api/admin/orders${search ? `?search=${search}` : ""}`)
    const d = await res.json()
    setOrders(d.orders || [])
    setLoading(false)
    setLastUpdated(new Date())
  }, [search])

  useEffect(() => {
    fetchOrders()
    const client = supabase()
    const channel = client
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => fetchOrders())
      .subscribe()
    channelRef.current = channel
    return () => { client.removeChannel(channel) }
  }, [fetchOrders, supabase])

  const updateStatus = async (id: string, status: string) => {
    const prev = [...orders]
    setOrders((o) => o.map((ord) => ord.id === id ? { ...ord, status } : ord))
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    })
    if (!res.ok) setOrders(prev)
  }

  const updatePayment = async (id: string, paymentMethod: string = "cash") => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      body: JSON.stringify({ id, status: "completed", payment_status: "paid", payment_method: paymentMethod }),
    })
    if (res.ok) { fetchOrders(); setSelectedOrder(null) }
  }

  const getColumnOrders = (status: string) => orders.filter((o) => {
    if (status === "paid") return o.payment_status === "paid"
    return o.status === status && o.payment_status !== "paid"
  })

  return (
    <div className="space-y-4">
      <AdminSectionHeader
        title="Orders"
        description="Track orders from kitchen to checkout"
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[10px] px-2 py-1.5 rounded-lg transition-all"
              style={{ background: "rgba(248,242,233,0.03)", color: "rgba(248,242,233,0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3BB273" }} />
              Live
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "rgba(248,242,233,0.2)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-48 pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(248,242,233,0.6)" }} />
            </div>
            <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <button onClick={() => setView("kanban")}
                className="px-3 py-1.5 text-[10px] font-medium transition-all"
                style={{ background: view === "kanban" ? "rgba(200,169,106,0.12)" : "rgba(255,255,255,0.03)", color: view === "kanban" ? "#C8A96A" : "rgba(248,242,233,0.3)" }}>
                Kanban
              </button>
              <button onClick={() => setView("table")}
                className="px-3 py-1.5 text-[10px] font-medium transition-all"
                style={{ background: view === "table" ? "rgba(200,169,106,0.12)" : "rgba(255,255,255,0.03)", color: view === "table" ? "#C8A96A" : "rgba(248,242,233,0.3)" }}>
                Table
              </button>
            </div>
          </div>
        }
      />

      {selectedOrder && (
        <div className="relative">
          <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-1.5 text-[11px] mb-3 transition-all"
            style={{ color: "rgba(248,242,233,0.3)" }}>
            <ArrowLeft className="w-3 h-3" /> Back to orders
          </button>

          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(33,25,19,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="p-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold" style={{ color: "#F8F2E9" }}>
                    Order #{selectedOrder.id.slice(0, 8)}
                  </h3>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(248,242,233,0.3)" }}>
                    {new Date(selectedOrder.created_at).toLocaleString()} · Table {selectedOrder.tables?.table_number || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-lg ${
                    selectedOrder.payment_status === "paid" ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
                  }`}>
                    {selectedOrder.payment_status}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-lg"
                    style={{ background: "rgba(200,169,106,0.1)", color: "#C8A96A" }}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-2">
              {selectedOrder.order_items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(22,17,13,0.5)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: "#F8F2E9" }}>{item.menu_item_name}</span>
                      <span className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>x{item.quantity}</span>
                    </div>
                    {item.notes && (
                      <p className="text-[9px] italic mt-0.5" style={{ color: "rgba(242,165,65,0.5)" }}>{item.notes}</p>
                    )}
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: "rgba(248,242,233,0.5)" }}>
                    IDR {Number(item.subtotal || item.unit_price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(22,17,13,0.3)" }}>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(248,242,233,0.3)" }}>
                <Clock className="w-3 h-3" />
                {elapsed(selectedOrder.created_at)} ago
              </div>
              <span className="text-sm font-bold" style={{ color: "#C8A96A" }}>
                IDR {Number(selectedOrder.total).toLocaleString()}
              </span>
            </div>

            <div className="p-4 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {selectedOrder.status !== "completed" && (
                <button onClick={() => updateStatus(selectedOrder.id, STATUS_NEXT[selectedOrder.status] || "completed")}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}>
                  {STATUS_NEXT[selectedOrder.status] === "preparing" ? "Accept Order" :
                   STATUS_NEXT[selectedOrder.status] === "ready" ? "Mark Ready" :
                   "Mark Served"}
                </button>
              )}
              {selectedOrder.payment_status !== "paid" && selectedOrder.status === "completed" && (
                <button onClick={() => updatePayment(selectedOrder.id)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: "linear-gradient(135deg, #3BB273, #2D9A5E)", color: "#16110D" }}>
                  <DollarSign className="w-3 h-3 inline mr-1 -mt-0.5" /> Mark Paid
                </button>
              )}
              <button onClick={() => window.open(`/receipt?order_id=${selectedOrder.id}`, "_blank")}
                className="px-3 py-2 rounded-xl text-[10px] transition-all"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(248,242,233,0.3)" }}>
                <Printer className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectedOrder && view === "kanban" && (
        loading ? (
          <div className="grid grid-cols-5 gap-3 h-[calc(100vh-16rem)]">
            {COLUMNS.map((col) => (
              <div key={col.key} className="rounded-2xl p-4" style={{ background: "rgba(33,25,19,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-3 h-[calc(100vh-16rem)]">
            {COLUMNS.map((col) => {
              const colOrders = getColumnOrders(col.key)
              const Icon = col.icon
              const isEmpty = colOrders.length === 0
              return (
                <div key={col.key} className="flex flex-col rounded-2xl overflow-hidden"
                  style={{ background: "rgba(33,25,19,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="flex items-center justify-between px-3.5 py-2.5" style={{ borderBottom: `1px solid ${col.color}15` }}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" style={{ color: col.color }} />
                      <span className="text-xs font-semibold" style={{ color: col.color }}>{col.label}</span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg" style={{ background: `${col.color}12`, color: col.color }}>
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
                    <AnimatePresence mode="popLayout">
                      {isEmpty ? (
                        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex flex-col items-center justify-center py-10"
                          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.04)", borderRadius: "12px" }}>
                          <ListOrdered className="w-6 h-6" style={{ color: "rgba(248,242,233,0.06)" }} />
                          <p className="text-[10px] mt-1.5" style={{ color: "rgba(248,242,233,0.1)" }}>No orders</p>
                        </motion.div>
                      ) : (
                        colOrders.map((order, i) => {
                          const isUrgent = col.key === "pending" && Date.now() - new Date(order.created_at).getTime() > 300000
                          return (
                            <motion.div key={order.id}
                              layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: i * 0.02 }}
                              onClick={() => setSelectedOrder(order)}
                              className="rounded-2xl p-3 cursor-pointer transition-all hover:-translate-y-0.5"
                              style={{
                                background: "rgba(33,25,19,0.5)",
                                border: `1px solid ${isUrgent ? "rgba(217,83,79,0.2)" : "rgba(255,255,255,0.04)"}`,
                                boxShadow: isUrgent ? "0 0 12px rgba(217,83,79,0.06)" : "none",
                              }}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold" style={{ color: "#F8F2E9" }}>
                                  #{order.id.slice(0, 6)}
                                </span>
                                <span className="text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>
                                  {order.tables?.table_number ? `T${order.tables.table_number}` : ""}
                                </span>
                              </div>
                              <div className="space-y-0.5 mb-2">
                                {order.order_items?.slice(0, 3).map((item) => (
                                  <p key={item.id} className="text-[10px] truncate" style={{ color: "rgba(248,242,233,0.5)" }}>
                                    {item.menu_item_name} <span style={{ color: "rgba(248,242,233,0.2)" }}>x{item.quantity}</span>
                                  </p>
                                ))}
                                {(order.order_items?.length || 0) > 3 && (
                                  <p className="text-[9px]" style={{ color: "rgba(248,242,233,0.15)" }}>
                                    +{order.order_items.length - 3} more
                                  </p>
                                )}
                              </div>
                              <div className={`flex items-center justify-between ${isUrgent ? "" : ""}`}>
                                <span className={`text-[9px] flex items-center gap-1 ${isUrgent ? "text-red-400" : ""}`}
                                  style={{ color: isUrgent ? undefined : "rgba(248,242,233,0.2)" }}>
                                  <Clock className="w-2.5 h-2.5" />
                                  {elapsed(order.created_at)}
                                </span>
                                <span className="text-[10px] font-medium" style={{ color: "rgba(248,242,233,0.3)" }}>
                                  IDR {Number(order.total).toLocaleString()}
                                </span>
                              </div>
                            </motion.div>
                          )
                        })
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      {!selectedOrder && view === "table" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(33,25,19,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(248,242,233,0.2)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <th className="text-left px-4 py-3 font-medium">Order</th>
                  <th className="text-left px-4 py-3 font-medium">Table</th>
                  <th className="text-left px-4 py-3 font-medium">Items</th>
                  <th className="text-left px-4 py-3 font-medium">Total</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Payment</th>
                  <th className="text-left px-4 py-3 font-medium">Time</th>
                  <th className="text-right px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                {orders.map((order) => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer transition-all" style={{ background: "transparent" }}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold" style={{ color: "#F8F2E9" }}>#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "rgba(248,242,233,0.5)" }}>
                      {order.tables?.table_number || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "rgba(248,242,233,0.4)" }}>
                      {order.order_items?.length || 0} items
                    </td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: "#C8A96A" }}>
                      IDR {Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
                        order.status === "pending" ? "text-amber-400 bg-amber-500/10" :
                        order.status === "preparing" ? "text-blue-400 bg-blue-500/10" :
                        order.status === "ready" ? "text-emerald-400 bg-emerald-500/10" :
                        order.status === "completed" ? "text-green-400 bg-green-500/10" :
                        "text-gray-400 bg-gray-500/10"
                      }`}>{order.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-lg ${
                        order.payment_status === "paid" ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
                      }`}>{order.payment_status}</span>
                    </td>
                    <td className="px-4 py-3 text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>
                      {elapsed(order.created_at)} ago
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1.5 rounded-lg transition-all" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <Eye className="w-3 h-3" style={{ color: "rgba(248,242,233,0.3)" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && !loading && (
              <div className="text-center py-12">
                <ListOrdered className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(248,242,233,0.06)" }} />
                <p className="text-xs" style={{ color: "rgba(248,242,233,0.15)" }}>No orders found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
