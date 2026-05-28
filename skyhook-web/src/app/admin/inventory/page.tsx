"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Package, AlertTriangle, TrendingDown, RefreshCw } from "lucide-react"

const inventoryItems = [
  { name: "Coffee Beans - Arabica", stock: 12, unit: "kg", min: 5, max: 50, status: "normal" },
  { name: "Coffee Beans - Robusta", stock: 3, unit: "kg", min: 5, max: 40, status: "low" },
  { name: "Milk - Fresh", stock: 25, unit: "L", min: 10, max: 60, status: "normal" },
  { name: "Milk - Oat", stock: 8, unit: "L", min: 5, max: 30, status: "normal" },
  { name: "Sugar - Brown", stock: 2, unit: "kg", min: 3, max: 20, status: "low" },
  { name: "Chocolate - Belgian", stock: 7, unit: "kg", min: 2, max: 15, status: "normal" },
  { name: "Syrup - Vanilla", stock: 1, unit: "L", min: 2, max: 10, status: "critical" },
  { name: "Croissant Dough", stock: 20, unit: "pcs", min: 10, max: 50, status: "normal" },
]

const statusConfig = {
  critical: { label: "Critical", color: "text-red-400 bg-red-500/10" },
  low: { label: "Low Stock", color: "text-skyhook-amber bg-skyhook-amber/10" },
  normal: { label: "In Stock", color: "text-emerald-400 bg-emerald-500/10" },
}

export default function AdminInventoryPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Inventory Management</h1>
          <p className="text-white/40 text-sm mt-1">AI-powered stock tracking and forecasting</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Sync
          </Button>
          <Button variant="primary" size="sm">
            <Package className="w-4 h-4 mr-2" /> Add Stock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Items", value: "156", icon: Package, color: "text-blue-400" },
          { label: "Low Stock Alerts", value: "3", icon: AlertTriangle, color: "text-skyhook-amber" },
          { label: "Auto-Order Ready", value: "2", icon: TrendingDown, color: "text-red-400" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <GlassCard key={stat.label}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/30 text-xs">{stat.label}</p>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/30 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Item</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Min / Max</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">AI Forecast</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {inventoryItems.map((item) => {
              const status = statusConfig[item.status as keyof typeof statusConfig]
              return (
                <tr key={item.name} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{item.name}</td>
                  <td className="p-4 text-white">{item.stock} {item.unit}</td>
                  <td className="p-4 text-white/60">{item.min} / {item.max} {item.unit}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="p-4 text-white/40 text-xs">
                    {item.status === "critical" ? "Order immediately" :
                     item.status === "low" ? "Order within 3 days" : "Sufficient for 2 weeks"}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">Restock</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
