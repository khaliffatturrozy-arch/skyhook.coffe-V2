"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import {
  TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight,
} from "lucide-react"

interface DashboardData {
  stats: { totalRevenue: number; activeOrders: number; totalCustomers: number; avgOrderValue: number }
  recentOrders: any[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const stats = data ? [
    { label: "Total Revenue", value: `IDR ${(data.stats.totalRevenue / 1000).toFixed(1)}K`, change: "+12.5%", up: true, icon: DollarSign },
    { label: "Active Orders", value: String(data.stats.activeOrders), change: "+3.2%", up: true, icon: ShoppingBag },
    { label: "Total Customers", value: String(data.stats.totalCustomers), change: "+8.1%", up: true, icon: Users },
    { label: "Avg Order Value", value: `IDR ${data.stats.avgOrderValue.toLocaleString()}`, change: "+2.4%", up: true, icon: TrendingUp },
  ] : []

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
        <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Real-time overview of your business</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <GlassCard key={stat.label}>
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-skyhook-amber" />
                <span className={`flex items-center gap-1 text-xs ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/30 text-xs">{stat.label}</p>
            </GlassCard>
          )
        })}
      </div>

      <GlassCard>
        <h2 className="font-heading text-lg font-semibold mb-4">Recent Orders</h2>
        {data?.recentOrders?.length ? (
          <div className="space-y-3">
            {data.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <p className="text-white text-sm font-medium">#{order.id?.slice(0, 8)}</p>
                  <p className="text-white/30 text-xs">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-skyhook-amber/10 text-skyhook-amber"
                  }`}>{order.status}</span>
                  <span className="text-skyhook-amber font-semibold">IDR {Number(order.total).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/20 text-sm py-8 text-center">No orders yet</p>
        )}
      </GlassCard>
    </div>
  )
}
