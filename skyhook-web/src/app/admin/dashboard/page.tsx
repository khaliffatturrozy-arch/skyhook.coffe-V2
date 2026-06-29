"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { AdminStatsCard, AdminiOSWidget } from "@/components/admin/admin-stats-card"
import { AdminGlassTable, AdminSectionHeader } from "@/components/admin/admin-glass-card"
import {
  TrendingUp, Users, ShoppingBag, DollarSign, Calendar,
  Music, Coffee, Sun, Clock, AlertCircle, UtensilsCrossed,
  Zap, Flame, Percent, ArrowRight, Crown,
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts"
import Link from "next/link"

const PIE_COLORS = ["#f59e0b", "#c8956c", "#10b981", "#6366f1", "#ec4899", "#06b6d4"]

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1000
    const step = Math.ceil(value / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>
}

const weeklyData = [
  { day: "Mon", revenue: 3.2, orders: 24, customers: 42 },
  { day: "Tue", revenue: 2.8, orders: 20, customers: 35 },
  { day: "Wed", revenue: 4.1, orders: 32, customers: 55 },
  { day: "Thu", revenue: 3.5, orders: 28, customers: 48 },
  { day: "Fri", revenue: 5.6, orders: 45, customers: 72 },
  { day: "Sat", revenue: 7.2, orders: 52, customers: 88 },
  { day: "Sun", revenue: 6.8, orders: 48, customers: 80 },
]

const peakHours = [
  { hour: "08", customers: 12 }, { hour: "09", customers: 8 }, { hour: "10", customers: 15 },
  { hour: "11", customers: 22 }, { hour: "12", customers: 48 }, { hour: "13", customers: 52 },
  { hour: "14", customers: 35 }, { hour: "15", customers: 18 }, { hour: "16", customers: 25 },
  { hour: "17", customers: 40 }, { hour: "18", customers: 65 }, { hour: "19", customers: 72 },
  { hour: "20", customers: 58 }, { hour: "21", customers: 42 }, { hour: "22", customers: 28 },
]

const categorySales = [
  { name: "Coffee", value: 35 }, { name: "Food", value: 30 },
  { name: "Mocktail", value: 15 }, { name: "Snacks", value: 10 },
  { name: "Dessert", value: 7 }, { name: "Other", value: 3 },
]

const topMenu = [
  { name: "Nasi Goreng Skyhook", orders: 48, revenue: 2.4, color: "bg-amber-400" },
  { name: "Coffee Signature", orders: 42, revenue: 1.8, color: "bg-emerald-400" },
  { name: "Chicken Steak", orders: 35, revenue: 2.1, color: "bg-blue-400" },
  { name: "French Fries", orders: 30, revenue: 0.9, color: "bg-violet-400" },
  { name: "Milkshake", orders: 28, revenue: 1.1, color: "bg-rose-400" },
  { name: "Burger Skyhook", orders: 25, revenue: 1.5, color: "bg-cyan-400" },
]

const upcomingEvents = [
  { title: "Live Jazz Night", date: "Today", time: "19:00", guests: 85, status: "confirmed", icon: Music },
  { title: "Acoustic Sunday", date: "Tomorrow", time: "16:00", guests: 45, status: "open", icon: Music },
  { title: "Birthday Party - Rooftop", date: "Sat, 10 Jun", time: "14:00", guests: 30, status: "confirmed", icon: Calendar },
]

const notifications = [
  { type: "info", message: "3 new reservations for tonight", time: "5m ago" },
  { type: "warning", message: "Low stock: Coffee beans (2kg remaining)", time: "15m ago" },
  { type: "success", message: "Order #SKY-0421 completed", time: "25m ago" },
  { type: "info", message: "Rooftop fully booked for Saturday", time: "1h ago" },
  { type: "warning", message: "Kitchen prep time delayed +15min", time: "2h ago" },
]

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null
  return (
    <div className="bg-[#1a1a1d]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-white/60 text-xs font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.name}: {p.name === "revenue" ? `IDR ${p.value}M` : p.value}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ revenue: 7200000, orders: 24, reservations: 18, customers: 156, rooftop: 85 })

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClient()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString())
        const { count: reservationCount } = await supabase.from("reservations").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString())
        const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

        setStats({
          revenue: 7200000,
          orders: orderCount || 0,
          reservations: reservationCount || 0,
          customers: userCount || 0,
          rooftop: 85,
        })
      } catch { /* use defaults */ }
      setTimeout(() => setLoading(false), 400)
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Dashboard"
        description="Real-time operational overview — Skyhook Coffee"
      />

      {/* iOS Widget Grid — Adaptive Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <AdminStatsCard title="Today's Revenue" value={`IDR ${(stats.revenue / 1000000).toFixed(1)}M`} change="+12.5%" trend="up" color="amber" delay={0} icon={<DollarSign className="w-5 h-5" />} />
        <AdminStatsCard title="Active Orders" value={String(stats.orders)} change="+8.2%" trend="up" color="blue" delay={1} icon={<ShoppingBag className="w-5 h-5" />} />
        <AdminStatsCard title="Reservations" value={String(stats.reservations)} change="+15.3%" trend="up" color="violet" delay={2} icon={<Calendar className="w-5 h-5" />} />
        <AdminStatsCard title="Total Customers" value={String(stats.customers)} change="+22.1%" trend="up" color="emerald" delay={3} icon={<Users className="w-5 h-5" />} />
        <AdminStatsCard title="Rooftop Status" value={`${stats.rooftop}%`} subtitle="150/180 guests" change="Almost Full" trend="down" color="rose" delay={4} icon={<Sun className="w-5 h-5" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AdminiOSWidget delay={0} size="wide">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Weekly Revenue</h2>
              <p className="text-[11px] text-white/30 mt-0.5">This week performance</p>
            </div>
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +15.2%
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#revGrad)" name="revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminiOSWidget>

        <AdminiOSWidget delay={1}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Peak Hours</h2>
              <p className="text-[11px] text-white/30 mt-0.5">Today's traffic</p>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="customers" radius={[8, 8, 0, 0]} fill="#c8956c" opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminiOSWidget>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Best Selling Menu */}
        <AdminiOSWidget delay={0}>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Best Sellers</h2>
          </div>
          <div className="space-y-1.5">
            {topMenu.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-bold text-white/20 w-5 text-center">{i + 1}</span>
                  <div className={`w-1 h-5 rounded-full ${item.color}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-white/30">{item.orders} orders</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-white/60">IDR {item.revenue}M</span>
              </div>
            ))}
          </div>
        </AdminiOSWidget>

        {/* Category Distribution */}
        <AdminiOSWidget delay={1}>
          <div className="flex items-center gap-2 mb-4">
            <Percent className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Sales by Category</h2>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categorySales} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                  {categorySales.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {categorySales.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                <span className="text-white/40">{c.name}</span>
                <span className="text-white/60 font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </AdminiOSWidget>

        {/* Events + Notifications stacking */}
        <AdminiOSWidget delay={2}>
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-semibold text-white">Events</h2>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((ev, i) => {
              const Icon = ev.icon
              return (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/[0.03]">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{ev.title}</p>
                    <p className="text-[10px] text-white/30">{ev.date} · {ev.time}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    ev.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  }`}>{ev.status}</span>
                </div>
              )
            })}
          </div>
          <Link href="/admin/events" className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60 mt-3 transition-colors">
            View all events <ArrowRight className="w-3 h-3" />
          </Link>
        </AdminiOSWidget>

        {/* Alerts */}
        <AdminiOSWidget delay={3}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Alerts</h2>
          </div>
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2 rounded-2xl bg-white/[0.03]">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  n.type === "warning" ? "bg-amber-400" : n.type === "success" ? "bg-emerald-400" : "bg-blue-400"
                }`} />
                <div className="min-w-0">
                  <p className="text-sm text-white/70">{n.message}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </AdminiOSWidget>
      </div>
    </div>
  )
}
