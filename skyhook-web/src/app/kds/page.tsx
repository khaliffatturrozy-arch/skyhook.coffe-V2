"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Clock, ChefHat, CheckCircle2, Play, RefreshCw } from "lucide-react"

const initialOrders = [
  { id: "#SH-2843", table: "R12", items: ["Skyhook Signature x2", "Butter Croissant x1"], time: "2 min", status: "pending" as const },
  { id: "#SH-2842", table: "VIP1", items: ["Gold Cappuccino x1", "Truffle Fries x1"], time: "5 min", status: "preparing" as const },
  { id: "#SH-2841", table: "G5", items: ["Rooftop Matcha x1", "Midnight Affogato x2"], time: "8 min", status: "preparing" as const },
  { id: "#SH-2840", table: "S3", items: ["Smoked Old Fashioned x2"], time: "12 min", status: "pending" as const },
  { id: "#SH-2839", table: "T8", items: ["Tropical Cold Brew x3", "Berry Matcha Dream x1"], time: "15 min", status: "preparing" as const },
]

type OrderStatus = "pending" | "preparing" | "ready" | "completed"

interface Order {
  id: string; table: string; items: string[]; time: string; status: OrderStatus
}

export default function KDSPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  const statusCounts = {
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    ready: orders.filter(o => o.status === "ready").length,
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
            <Button variant="secondary" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className={`p-4 border-l-4 ${
                order.status === "pending" ? "border-l-skyhook-amber" :
                order.status === "preparing" ? "border-l-blue-500" :
                order.status === "ready" ? "border-l-emerald-500" :
                "border-l-white/10"
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-bold text-lg">{order.id}</span>
                    <span className="text-white/30 text-sm ml-2">| Table {order.table}</span>
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
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-white/60 text-sm">{item}</p>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {order.time}
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
