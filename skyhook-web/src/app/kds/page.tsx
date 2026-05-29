"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Clock, ChefHat, CheckCircle2, Play, Loader2, RefreshCw } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface OrderItem {
  id: string
  menu_item_name: string
  quantity: number
  status: string
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
}

function elapsed(created: string) {
  const diff = Date.now() - new Date(created).getTime()
  const m = Math.floor(diff / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default function KDSPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [now, setNow] = useState(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null)

  const supabase = useCallback(() => createClient(), [])

  const fetchOrders = useCallback(async () => {
    const client = supabase()
    const { data } = await client
      .from("orders")
      .select("*, tables(table_number), order_items(*)")
      .in("status", ["pending", "preparing", "ready"])
      .order("created_at", { ascending: false })
    if (data) setOrders(data as unknown as Order[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchOrders()

    timerRef.current = setInterval(() => setNow(Date.now()), 1000)

    const client = supabase()
    const channel = client
      .channel("kds-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        () => fetchOrders()
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      client.removeChannel(channel)
    }
  }, [fetchOrders, supabase])

  const updateStatus = async (id: string, status: string) => {
    const prev = [...orders]
    setOrders((o) => o.map((ord) => (ord.id === id ? { ...ord, status: status as Order["status"] } : ord)))
    try {
      const res = await fetch("/api/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: id, status }),
      })
      if (!res.ok) {
        setOrders(prev)
      }
    } catch {
      setOrders(prev)
    }
  }

  const activeOrders = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled")

  const statusCounts = {
    pending: activeOrders.filter((o) => o.status === "pending").length,
    preparing: activeOrders.filter((o) => o.status === "preparing").length,
    ready: activeOrders.filter((o) => o.status === "ready").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-skyhook-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-skyhook-black">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-skyhook-amber" />
            <div>
              <h1 className="font-heading text-2xl font-bold">Kitchen Display</h1>
              <p className="text-white/30 text-xs">Realtime order management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-4 h-4 text-skyhook-amber" />
              <span className="text-white/60">{new Date().toLocaleTimeString()}</span>
            </div>
            <Button variant="secondary" size="sm" onClick={fetchOrders}>
              <RefreshCw className="w-3 h-3 mr-2" />
              Sync
            </Button>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          {[
            { label: "Pending", count: statusCounts.pending, color: "text-skyhook-amber" },
            { label: "Preparing", count: statusCounts.preparing, color: "text-blue-400" },
            { label: "Ready", count: statusCounts.ready, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <span className={`text-2xl font-bold ${s.color}`}>{s.count}</span>
              <span className="text-white/40 text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {activeOrders.length === 0 && (
          <div className="text-center py-20">
            <ChefHat className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/20 text-lg">No active orders</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              layout
            >
              <GlassCard className={`p-4 border-l-4 ${
                order.status === "pending" ? "border-l-skyhook-amber" :
                order.status === "preparing" ? "border-l-blue-500" :
                order.status === "ready" ? "border-l-emerald-500" :
                "border-l-white/10"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-bold text-lg">
                      #{order.id.slice(0, 6).toUpperCase()}
                    </span>
                    <span className="text-white/30 text-sm ml-2">
                      | Table {order.tables?.table_number || "—"}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "pending" ? "bg-skyhook-amber/10 text-skyhook-amber" :
                    order.status === "preparing" ? "bg-blue-500/10 text-blue-400" :
                    order.status === "ready" ? "bg-emerald-500/10 text-emerald-400" :
                    "bg-white/10 text-white/40"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  {order.order_items?.map((item) => (
                    <p key={item.id} className="text-white/60 text-sm">
                      {item.menu_item_name} <span className="text-white/30">x{item.quantity}</span>
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs flex items-center gap-1 ${
                    Date.now() - new Date(order.created_at).getTime() > 600000
                      ? "text-red-400"
                      : Date.now() - new Date(order.created_at).getTime() > 300000
                      ? "text-skyhook-amber"
                      : "text-white/30"
                  }`}>
                    <Clock className="w-3 h-3" />
                    {elapsed(order.created_at)}
                  </span>
                  <div className="flex gap-1">
                    {order.status === "pending" && (
                      <Button variant="primary" size="sm" onClick={() => updateStatus(order.id, "preparing")}>
                        <Play className="w-3 h-3 mr-1" /> Start
                      </Button>
                    )}
                    {order.status === "preparing" && (
                      <Button variant="primary" size="sm" onClick={() => updateStatus(order.id, "ready")}>
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button variant="gold" size="sm" onClick={() => updateStatus(order.id, "completed")}>
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Serve
                      </Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
