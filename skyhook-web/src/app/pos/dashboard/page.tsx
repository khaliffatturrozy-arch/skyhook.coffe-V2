"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase"
import {
  Coffee, DollarSign, ShoppingBag, Users, Calendar,
  TrendingUp, Clock, Star, ArrowUp, ArrowDown,
  Loader2, ChefHat, Music,
} from "lucide-react"
import Link from "next/link"

type DashboardStats = {
  todayRevenue: number
  yesterdayRevenue: number
  activeTables: number
  totalTables: number
  ordersToday: number
  ordersYesterday: number
  topSelling: { name: string; count: number; revenue: number }[]
  peakHours: { hour: number; count: number }[]
  categorySales: { name: string; count: number; revenue: number }[]
  recentOrders: { id: string; table: string; total: number; status: string; created_at: string }[]
  memberCount: number
  eventBookings: number
  satisfaction: number
}

export default function POSDashboardPage() {
  const supabase = useCallback(() => createClient(), [])
  const [checking, setChecking] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0, yesterdayRevenue: 0, activeTables: 0, totalTables: 0,
    ordersToday: 0, ordersYesterday: 0, topSelling: [], peakHours: [],
    categorySales: [], recentOrders: [], memberCount: 0, eventBookings: 0, satisfaction: 96,
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today")

  useEffect(() => {
    (async () => {
      const client = supabase()
      const { data: { session } } = await client.auth.getSession()
      if (!session?.user?.id) { window.location.href = "/auth"; return }
      const { data: staff } = await client.from("staff").select("role").eq("user_id", session.user.id).maybeSingle()
      if (!staff || !["cashier", "admin", "manager"].includes(staff.role)) { window.location.href = "/dashboard"; return }
      setChecking(false)
    })()
  }, [supabase])

  useEffect(() => {
    (async () => {
      const client = supabase()
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const yesterdayStart = new Date(todayStart); yesterdayStart.setDate(yesterdayStart.getDate() - 1)

      const [ordersRes, tablesRes, menuRes, usersRes, eventsRes] = await Promise.all([
        client.from("orders").select("*").order("created_at", { ascending: false }),
        client.from("tables").select("*"),
        client.from("order_items").select("menu_item_name, quantity, subtotal, created_at"),
        client.from("users").select("id", { count: "exact", head: true }),
        client.from("events").select("id", { count: "exact", head: true }).eq("status", "active"),
      ])

      const orders = ordersRes.data || []
      const todayOrders = orders.filter((o) => new Date(o.created_at) >= todayStart)
      const yesterdayOrders = orders.filter((o) => {
        const d = new Date(o.created_at)
        return d >= yesterdayStart && d < todayStart
      })

      const activeTables = (tablesRes.data || []).filter((t) => t.status === "occupied").length

      const topSellingMap = new Map<string, { count: number; revenue: number }>()
      const peakHourMap = new Map<number, number>()
      const categorySalesMap = new Map<string, { count: number; revenue: number }>()

      const allItems = menuRes.data || []
      allItems.forEach((item: any) => {
        const curr = topSellingMap.get(item.menu_item_name) || { count: 0, revenue: 0 }
        curr.count += item.quantity
        curr.revenue += Number(item.subtotal || 0)
        topSellingMap.set(item.menu_item_name, curr)

        const hour = new Date(item.created_at).getHours()
        peakHourMap.set(hour, (peakHourMap.get(hour) || 0) + item.quantity)
      })

      const peakHours = Array.from(peakHourMap.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)

      setStats({
        todayRevenue: todayOrders.reduce((s, o) => s + Number(o.total || 0), 0),
        yesterdayRevenue: yesterdayOrders.reduce((s, o) => s + Number(o.total || 0), 0),
        activeTables, totalTables: (tablesRes.data || []).length,
        ordersToday: todayOrders.length,
        ordersYesterday: yesterdayOrders.length,
        topSelling: Array.from(topSellingMap.entries())
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.count - a.count).slice(0, 8),
        peakHours,
        categorySales: Array.from(categorySalesMap.entries())
          .map(([name, data]) => ({ name, ...data })),
        recentOrders: todayOrders.slice(0, 10).map((o) => ({
          id: o.id, table: "", total: Number(o.total || 0),
          status: o.status, created_at: o.created_at,
        })),
        memberCount: (usersRes.count || 0),
        eventBookings: (eventsRes.count || 0),
        satisfaction: 96,
      })
      setLoading(false)
    })()
  }, [supabase, selectedPeriod])

  const todayRevenue = stats.todayRevenue
  const yesterdayRevenue = stats.yesterdayRevenue
  const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1) : "0"
  const ordersChange = stats.ordersYesterday > 0 ? ((stats.ordersToday - stats.ordersYesterday) / stats.ordersYesterday * 100).toFixed(1) : "0"

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#16110D" }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#C8A96A" }} />
      </div>
    )
  }

  const statCards = [
    {
      label: "Today's Revenue", value: `IDR ${todayRevenue.toLocaleString()}`,
      change: `${revenueChange}%`, up: Number(revenueChange) >= 0,
      icon: DollarSign, color: "#C8A96A",
    },
    {
      label: "Active Tables", value: `${stats.activeTables}/${stats.totalTables}`,
      change: `${stats.totalTables - stats.activeTables} available`,
      up: true, icon: Coffee, color: "#3BB273",
    },
    {
      label: "Orders Today", value: stats.ordersToday.toString(),
      change: `${ordersChange}% vs yesterday`, up: Number(ordersChange) >= 0,
      icon: ShoppingBag, color: "#4A9EFF",
    },
    {
      label: "Members", value: stats.memberCount.toLocaleString(),
      change: "Registered users", up: true, icon: Users, color: "#8B5CF6",
    },
    {
      label: "Event Bookings", value: stats.eventBookings.toString(),
      change: "Active events", up: true, icon: Music, color: "#F2A541",
    },
    {
      label: "Satisfaction", value: `${stats.satisfaction}%`,
      change: "Customer rating", up: true, icon: Star, color: "#EC4899",
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: "#16110D" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(200,169,106,0.03) 0%, transparent 60%)" }} />

      <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "#F8F2E9" }}>Dashboard</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(248,242,233,0.3)" }}>Real-time business overview</p>
          </div>
          <Link href="/pos"
            className="px-4 py-2 rounded-2xl text-xs font-medium transition-all"
            style={{ background: "rgba(200,169,106,0.1)", color: "#C8A96A", border: "1px solid rgba(200,169,106,0.15)" }}>
            <Coffee className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />Open POS
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((card, i) => (
            <motion.div key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl p-4"
              style={{ background: "rgba(33,25,19,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${card.color}12` }}>
                  <card.icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className={`text-[9px] flex items-center gap-0.5 ${card.up ? "" : ""}`}
                  style={{ color: card.up ? "#3BB273" : "#D9534F" }}>
                  {card.up ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                  {card.change}
                </span>
              </div>
              <p className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>{card.label}</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: "#F8F2E9" }}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Selling */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl p-4 lg:col-span-2"
            style={{ background: "rgba(33,25,19,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold" style={{ color: "#F8F2E9" }}>Top Selling Items</h3>
              <TrendingUp className="w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.2)" }} />
            </div>
            <div className="space-y-1.5">
              {stats.topSelling.slice(0, 6).map((item, i) => (
                <div key={item.name} className="flex items-center gap-3 px-2.5 py-2 rounded-xl"
                  style={{ background: i % 2 === 0 ? "rgba(33,25,19,0.3)" : "transparent" }}>
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-bold"
                    style={{ background: i < 3 ? "rgba(200,169,106,0.15)" : "rgba(255,255,255,0.04)", color: i < 3 ? "#C8A96A" : "rgba(248,242,233,0.2)" }}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-xs truncate" style={{ color: "#F8F2E9" }}>{item.name}</span>
                  <span className="text-[10px]" style={{ color: "rgba(248,242,233,0.3)" }}>x{item.count}</span>
                  <span className="text-[10px] font-medium" style={{ color: "#C8A96A" }}>IDR {item.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Peak Hours */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl p-4"
            style={{ background: "rgba(33,25,19,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold" style={{ color: "#F8F2E9" }}>Peak Hours</h3>
              <Clock className="w-3.5 h-3.5" style={{ color: "rgba(248,242,233,0.2)" }} />
            </div>
            <div className="space-y-2">
              {stats.peakHours.map((ph) => {
                const maxCount = Math.max(...stats.peakHours.map((p) => p.count), 1)
                const pct = (ph.count / maxCount) * 100
                const label = `${ph.hour.toString().padStart(2, "0")}:00`
                return (
                  <div key={ph.hour}>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span style={{ color: "rgba(248,242,233,0.4)" }}>{label}</span>
                      <span style={{ color: "rgba(248,242,233,0.3)" }}>{ph.count} orders</span>
                    </div>
                    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        className="h-full rounded-full transition-all"
                        style={{ background: "linear-gradient(90deg, #C8A96A, #A68B4E)" }} />
                    </div>
                  </div>
                )
              })}
              {stats.peakHours.length === 0 && (
                <p className="text-[10px] text-center py-6" style={{ color: "rgba(248,242,233,0.1)" }}>No data yet</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(33,25,19,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <h3 className="text-xs font-semibold" style={{ color: "#F8F2E9" }}>Recent Orders</h3>
            <Link href="/pos" className="text-[10px] font-medium" style={{ color: "#C8A96A" }}>View All</Link>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
            {stats.recentOrders.slice(0, 6).map((order) => (
              <div key={order.id} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold" style={{ color: "#F8F2E9" }}>
                    #{order.id.slice(0, 6)}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md capitalize ${
                    order.status === "completed" ? "text-green-400 bg-green-500/10" :
                    order.status === "preparing" ? "text-blue-400 bg-blue-500/10" :
                    order.status === "ready" ? "text-emerald-400 bg-emerald-500/10" :
                    "text-amber-400 bg-amber-500/10"
                  }`}>{order.status}</span>
                </div>
                <span className="text-[11px] font-medium" style={{ color: "#C8A96A" }}>
                  IDR {order.total.toLocaleString()}
                </span>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <p className="text-[10px] text-center py-6" style={{ color: "rgba(248,242,233,0.1)" }}>No orders today</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
