"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import {
  Clock, ChefHat, CheckCircle2, Play, Loader2, RefreshCw,
  AlertCircle, Bell, Coffee, Printer, UtensilsCrossed,
  Zap, Timer, ListOrdered,
} from "lucide-react"

interface OrderItem {
  id: string
  menu_item_name: string
  quantity: number
  status: string
  notes?: string
}

interface TableInfo {
  table_number: string
}

interface Order {
  id: string
  table_id: string | null
  tables: TableInfo | null
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  created_at: string
  order_items: OrderItem[]
  notes?: string
  subtotal?: number
}

const STATUS_CONFIG = {
  pending: { label: "New Orders", icon: Bell, color: "#F2A541", bg: "rgba(242,165,65,0.08)", border: "rgba(242,165,65,0.15)", textColor: "#F2A541" },
  preparing: { label: "In Progress", icon: Zap, color: "#4A9EFF", bg: "rgba(74,158,255,0.08)", border: "rgba(74,158,255,0.15)", textColor: "#4A9EFF" },
  ready: { label: "Ready to Serve", icon: CheckCircle2, color: "#3BB273", bg: "rgba(59,178,115,0.08)", border: "rgba(59,178,115,0.15)", textColor: "#3BB273" },
}

const STATUS_FLOW: Record<string, string> = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
}

function elapsed(created: string) {
  const diff = Date.now() - new Date(created).getTime()
  const m = Math.floor(diff / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function KDSPage() {
  const supabase = useCallback(() => createClient(), [])

  const [checking, setChecking] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(Date.now())
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [previousOrderCount, setPreviousOrderCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null)

  useEffect(() => {
    (async () => {
      const client = supabase()
      const { data: { session } } = await client.auth.getSession()
      if (!session?.user?.id) { window.location.href = "/auth"; return }
      const { data: staff } = await client.from("staff").select("role").eq("user_id", session.user.id).maybeSingle()
      if (!staff || !["kitchen", "chef", "bartender", "admin", "manager"].includes(staff.role)) {
        window.location.href = "/dashboard"; return
      }
      setChecking(false)
    })()
  }, [supabase])

  const fetchOrders = useCallback(async () => {
    const client = supabase()
    const { data } = await client
      .from("orders")
      .select("*, tables(table_number), order_items(*)")
      .in("status", ["pending", "preparing", "ready"])
      .order("created_at", { ascending: false })
    if (data) {
      const newOrders = data as unknown as Order[]
      setOrders(newOrders)
      if (previousOrderCount > 0 && newOrders.length > previousOrderCount && soundEnabled) {
        try { new Audio("/notification.mp3").play() } catch {}
      }
      setPreviousOrderCount(newOrders.length)
    }
    setLoading(false)
    setLastUpdated(new Date())
  }, [supabase, previousOrderCount, soundEnabled])

  useEffect(() => {
    fetchOrders()
    timerRef.current = setInterval(() => setNow(Date.now()), 1000)

    const client = supabase()
    const channel = client
      .channel("kds-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => fetchOrders())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, () => fetchOrders())
      .subscribe()
    channelRef.current = channel

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      client.removeChannel(channel)
    }
  }, [fetchOrders, supabase])

  const updateStatus = async (id: string, newStatus: string) => {
    const prev = [...orders]
    setOrders((o) => o.map((ord) => (ord.id === id ? { ...ord, status: newStatus as Order["status"] } : ord)))
    try {
      const res = await fetch("/api/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: id, status: newStatus }),
      })
      if (!res.ok) { setOrders(prev) }
    } catch { setOrders(prev) }
  }

  const activeOrders = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled")
  const grouped = {
    pending: activeOrders.filter((o) => o.status === "pending"),
    preparing: activeOrders.filter((o) => o.status === "preparing"),
    ready: activeOrders.filter((o) => o.status === "ready"),
  }

  if (checking || loading) {
    return (
      <div style={{ background: "#16110D" }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(242,165,65,0.1)", border: "1px solid rgba(242,165,65,0.15)" }}>
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#F2A541" }} />
          </div>
          <p className="text-sm" style={{ color: "rgba(248,242,233,0.4)" }}>Loading Kitchen Display...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#16110D" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(242,165,65,0.03) 0%, transparent 60%)" }} />

      {/* Header */}
      <header className="relative z-10 px-4 md:px-6 h-16 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(22,17,13,0.8)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F2A541, #E0892F)" }}>
            <ChefHat className="w-5 h-5 text-[#16110D]" />
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ color: "#F8F2E9" }}>Kitchen Display</h1>
            <p className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>Realtime order management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl" style={{ background: "rgba(248,242,233,0.03)", color: "rgba(248,242,233,0.3)" }}>
            <Clock className="w-3 h-3" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] px-2 py-1.5 rounded-lg" style={{ background: "rgba(248,242,233,0.03)", color: "rgba(248,242,233,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3BB273" }} />
            <span>Synced {Math.floor((Date.now() - lastUpdated.getTime()) / 1000)}s ago</span>
          </div>
          <button onClick={fetchOrders} className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <RefreshCw className="w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.4)" }} />
          </button>
        </div>
      </header>

      {/* Status Counts */}
      <div className="relative z-10 px-4 md:px-6 pt-4 pb-2 flex gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = grouped[key as keyof typeof grouped].length
          return (
            <div key={key}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl transition-all"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
              <span className="text-xl font-bold" style={{ color: cfg.color }}>{count}</span>
              <div>
                <p className="text-[11px] font-medium" style={{ color: cfg.textColor }}>{cfg.label}</p>
                <p className="text-[9px]" style={{ color: "rgba(248,242,233,0.2)" }}>
                  {key === "pending" ? "Just arrived" : key === "preparing" ? "Being cooked" : "Ready to serve"}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Kanban Columns */}
      <div className="relative z-10 px-4 md:px-6 py-4 flex gap-4 overflow-x-auto h-[calc(100vh-10rem)] pb-8 scrollbar-none">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const items = grouped[key as keyof typeof grouped]
          const Icon = cfg.icon
          return (
            <div key={key} className="flex-1 min-w-[300px] flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  <span className="text-xs font-semibold" style={{ color: cfg.textColor }}>{cfg.label}</span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg" style={{ background: cfg.bg, color: cfg.color }}>
                  {items.length}
                </span>
              </div>

              {/* Order Cards */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 rounded-2xl"
                      style={{ background: "rgba(33,25,19,0.3)", border: "1px dashed rgba(255,255,255,0.04)" }}>
                      <ChefHat className="w-8 h-8 mb-2" style={{ color: "rgba(248,242,233,0.06)" }} />
                      <p className="text-[11px]" style={{ color: "rgba(248,242,233,0.15)" }}>No orders</p>
                    </motion.div>
                  ) : (
                    items.map((order, i) => {
                      const elapsedStr = elapsed(order.created_at)
                      const elapsedMs = Date.now() - new Date(order.created_at).getTime()
                      const isUrgent = elapsedMs > 600000
                      const isWarning = elapsedMs > 300000 && !isUrgent

                      return (
                        <motion.div key={order.id}
                          layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                          transition={{ delay: i * 0.02 }}
                          className="rounded-2xl overflow-hidden transition-all"
                          style={{
                            background: "rgba(33,25,19,0.6)",
                            border: `1px solid ${isUrgent ? "rgba(217,83,79,0.2)" : isWarning ? "rgba(242,165,65,0.15)" : "rgba(255,255,255,0.04)"}`,
                            boxShadow: isUrgent ? "0 0 20px rgba(217,83,79,0.08)" : "none",
                          }}>
                          {/* Card Header */}
                          <div className="flex items-center justify-between px-3.5 py-2.5"
                            style={{
                              borderBottom: `1px solid ${cfg.border}`,
                              background: `linear-gradient(90deg, ${cfg.bg}, transparent)`,
                            }}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold" style={{ color: "#F8F2E9" }}>
                                #{order.id.slice(0, 6).toUpperCase()}
                              </span>
                              <span className="text-[11px]" style={{ color: "rgba(248,242,233,0.3)" }}>
                                Table {order.tables?.table_number || "—"}
                              </span>
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg ${
                              isUrgent ? "" : isWarning ? "" : ""
                            }`}
                              style={{
                                background: isUrgent ? "rgba(217,83,79,0.15)" : isWarning ? "rgba(242,165,65,0.12)" : "rgba(248,242,233,0.04)",
                                color: isUrgent ? "#D9534F" : isWarning ? "#F2A541" : "rgba(248,242,233,0.3)",
                              }}>
                              <Timer className="w-3 h-3" />
                              {elapsedStr}
                            </div>
                          </div>

                          {/* Items */}
                          <div className="px-3.5 py-2.5 space-y-1">
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                                    style={{ background: "rgba(200,169,106,0.1)", color: "#C8A96A" }}>
                                    {item.quantity}
                                  </span>
                                  <span className="text-xs" style={{ color: "rgba(248,242,233,0.8)" }}>{item.menu_item_name}</span>
                                </div>
                                {item.notes && (
                                  <span className="text-[9px] italic px-1.5 py-0.5 rounded" style={{ background: "rgba(242,165,65,0.08)", color: "rgba(242,165,65,0.6)" }}>
                                    {item.notes}
                                  </span>
                                )}
                              </div>
                            ))}
                            {order.notes && (
                              <p className="text-[9px] italic mt-1.5 pt-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.03)", color: "rgba(248,242,233,0.25)" }}>
                                {order.notes}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="px-3.5 py-2.5 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                            <div className="flex-1" />
                            <button onClick={() => updateStatus(order.id, STATUS_FLOW[order.status] || order.status)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium transition-all"
                              style={{
                                background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}dd)`,
                                color: "#16110D",
                                opacity: order.status === "ready" ? 0.8 : 1,
                              }}>
                              {order.status === "pending" && <Play className="w-3.5 h-3.5" />}
                              {order.status === "preparing" && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {order.status === "ready" && <UtensilsCrossed className="w-3.5 h-3.5" />}
                              {order.status === "pending" ? "Accept" : order.status === "preparing" ? "Done" : "Serve"}
                            </button>
                          </div>

                          {/* Urgent pulse animation */}
                          {isUrgent && (
                            <div className="absolute top-2 right-2">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-2 h-2 rounded-full" style={{ background: "#D9534F" }} />
                            </div>
                          )}
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
    </div>
  )
}
