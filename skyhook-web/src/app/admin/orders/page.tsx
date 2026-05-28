"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Search, Filter, Eye } from "lucide-react"

const orders = [
  { id: "#SH-2843", customer: "Khalif", table: "R12", items: 3, total: "IDR 235K", status: "pending", payment: "unpaid", time: "2 min ago" },
  { id: "#SH-2842", customer: "Ayu", table: "VIP1", items: 2, total: "IDR 168K", status: "preparing", payment: "paid", time: "5 min ago" },
  { id: "#SH-2841", customer: "Bima", table: "G5", items: 4, total: "IDR 312K", status: "completed", payment: "paid", time: "12 min ago" },
  { id: "#SH-2840", customer: "Citra", table: "S3", items: 1, total: "IDR 85K", status: "ready", payment: "paid", time: "8 min ago" },
  { id: "#SH-2839", customer: "Dimas", table: "T8", items: 2, total: "IDR 145K", status: "completed", payment: "paid", time: "15 min ago" },
  { id: "#SH-2838", customer: "Elsa", table: "L2", items: 5, total: "IDR 420K", status: "pending", payment: "unpaid", time: "1 min ago" },
]

export default function AdminOrdersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Orders Management</h1>
          <p className="text-white/40 text-sm mt-1">Track and manage all orders across outlets</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
          <Button variant="primary" size="sm">Export</Button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              placeholder="Search orders..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50"
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/30 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Table</th>
              <th className="text-left p-4">Items</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Payment</th>
              <th className="text-left p-4">Time</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{order.id}</td>
                <td className="p-4 text-white/60">{order.customer}</td>
                <td className="p-4 text-white/40">{order.table}</td>
                <td className="p-4 text-white/60">{order.items}</td>
                <td className="p-4 text-white">{order.total}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                    order.status === "preparing" ? "bg-blue-500/10 text-blue-400" :
                    order.status === "ready" ? "bg-skyhook-amber/10 text-skyhook-amber" :
                    "bg-white/10 text-white/40"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.payment === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {order.payment}
                  </span>
                </td>
                <td className="p-4 text-white/30 text-xs">{order.time}</td>
                <td className="p-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
