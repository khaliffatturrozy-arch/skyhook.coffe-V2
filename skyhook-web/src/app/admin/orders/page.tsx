"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Search, Eye, Loader2, ChevronRight } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<any | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders${search ? `?search=${search}` : ""}`)
      const d = await res.json()
      setOrders(d.orders || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [search])

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) { load(); setSelected(null) }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-white/10 text-white/40",
    preparing: "bg-blue-500/10 text-blue-400",
    ready: "bg-skyhook-amber/10 text-skyhook-amber",
    completed: "bg-emerald-500/10 text-emerald-400",
    cancelled: "bg-red-500/10 text-red-400",
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Orders Management</h1>
          <p className="text-white/40 text-sm mt-1">Track and manage all orders across outlets</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-white/20">No orders found</div>
        ) : selected ? (
          <div className="p-4">
            <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-sm mb-4 flex items-center gap-1"><ChevronRight className="w-4 h-4 rotate-180" /> Back</button>
            <h3 className="text-white font-bold text-lg mb-1">Order #{selected.id?.slice(0, 8)}</h3>
            <p className="text-white/40 text-xs mb-4">{new Date(selected.created_at).toLocaleString()}</p>
            <div className="space-y-2 mb-4">
              {selected.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between glass rounded-xl p-3">
                  <span className="text-white">{item.menu_item_name || item.name} x{item.quantity}</span>
                  <span className="text-white/60">IDR {Number(item.price || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <p className="text-white font-bold text-lg mb-4">Total: IDR {Number(selected.total).toLocaleString()}</p>
            <div className="flex gap-2">
              {["pending", "preparing", "ready", "completed"].map((s) => (
                <Button key={s} variant={selected.status === s ? "primary" : "ghost"} size="sm" onClick={() => updateStatus(selected.id, s)} disabled={selected.status === s}>
                  {s.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Items</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Time</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">#{order.id?.slice(0, 8)}</td>
                  <td className="p-4 text-white/60">{order.order_items?.length || 0} items</td>
                  <td className="p-4 text-white">IDR {Number(order.total).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || "bg-white/10 text-white/40"}`}>{order.status}</span>
                  </td>
                  <td className="p-4 text-white/30 text-xs">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelected(order)} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  )
}
