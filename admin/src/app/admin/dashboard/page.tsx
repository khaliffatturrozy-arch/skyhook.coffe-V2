"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true)
  useEffect(() => { fetch("/api/admin/dashboard").then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false)) }, [])

  const stats = data ? [
    { label: "Total Revenue", value: `IDR ${(data.stats.totalRevenue / 1000).toFixed(1)}K`, change: "+12.5%", up: true, icon: DollarSign },
    { label: "Active Orders", value: String(data.stats.activeOrders), change: "+3.2%", up: true, icon: ShoppingBag },
    { label: "Total Customers", value: String(data.stats.totalCustomers), change: "+8.1%", up: true, icon: Users },
    { label: "Avg Order Value", value: `IDR ${data.stats.avgOrderValue.toLocaleString()}`, change: "+2.4%", up: true, icon: TrendingUp },
  ] : []

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#212121] mb-1">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Real-time overview of your business</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-[#212121]" />
                <span className={`flex items-center gap-1 text-xs ${s.up ? "text-emerald-600" : "text-red-600"}`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#212121] mb-1">{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          )
        })}
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold text-[#212121] mb-4">Recent Orders</h2>
        {data?.recentOrders?.length ? data.recentOrders.map((o: any) => (
          <div key={o.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div><p className="text-sm font-medium text-[#212121]">#{o.id?.slice(0, 8)}</p><p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString()}</p></div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${o.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{o.status}</span>
              <span className="font-semibold text-sm">IDR {Number(o.total).toLocaleString()}</span>
            </div>
          </div>
        )) : <p className="text-gray-300 text-sm py-8 text-center">No orders yet</p>}
      </div>
    </div>
  )
}
