"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp, Users, ShoppingBag, DollarSign, Calendar,
  Activity, BarChart3, Bell, ArrowUpRight, ArrowDownRight,
} from "lucide-react"

const stats = [
  { label: "Total Revenue", value: "IDR 45.8M", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Active Orders", value: "24", change: "+3.2%", up: true, icon: ShoppingBag },
  { label: "Total Customers", value: "1,847", change: "+8.1%", up: true, icon: Users },
  { label: "Avg Order Value", value: "IDR 185K", change: "-2.4%", up: false, icon: TrendingUp },
]

const recentOrders = [
  { id: "#SH-2841", customer: "Khalif", items: 3, total: "IDR 235K", status: "completed", time: "2 min ago" },
  { id: "#SH-2840", customer: "Ayu", items: 2, total: "IDR 168K", status: "preparing", time: "5 min ago" },
  { id: "#SH-2839", customer: "Bima", items: 4, total: "IDR 312K", status: "pending", time: "8 min ago" },
  { id: "#SH-2838", customer: "Citra", items: 1, total: "IDR 85K", status: "ready", time: "12 min ago" },
  { id: "#SH-2837", customer: "Dimas", items: 2, total: "IDR 145K", status: "completed", time: "15 min ago" },
]

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-skyhook-black">
      <div className="section-padding py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-heading text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-white/40 text-sm mt-1">Enterprise hospitality management</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="primary" size="sm">
                <Activity className="w-4 h-4 mr-2" />
                Live View
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                        <Icon className="w-5 h-5 text-skyhook-amber" />
                      </div>
                      <span className={`flex items-center gap-1 text-xs ${
                        stat.up ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GlassCard>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold">Revenue Overview</h2>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60 outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last 3 Months</option>
                  </select>
                </div>
                <div className="h-64 flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-white/10" />
                  <span className="text-white/20 text-sm ml-3">Analytics chart will render here</span>
                </div>
              </GlassCard>
            </div>

            <div>
              <GlassCard>
                <h2 className="font-heading text-xl font-semibold mb-6">AI Insights</h2>
                <div className="space-y-4">
                  {[
                    { title: "Peak hours", desc: "18:00 - 21:00 is your busiest period", type: "info" },
                    { title: "Top seller", desc: "Skyhook Signature is the most ordered item", type: "success" },
                    { title: "Inventory alert", desc: "Coffee beans running low (12% remaining)", type: "warning" },
                  ].map((insight) => (
                    <div key={insight.title} className="p-3 rounded-xl bg-white/5">
                      <p className="text-white text-sm font-medium mb-1">{insight.title}</p>
                      <p className="text-white/40 text-xs">{insight.desc}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          <div className="mt-8">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl font-semibold">Recent Orders</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-white/30 text-xs uppercase tracking-wider">
                      <th className="text-left pb-3 pr-4">Order</th>
                      <th className="text-left pb-3 pr-4">Customer</th>
                      <th className="text-left pb-3 pr-4">Items</th>
                      <th className="text-left pb-3 pr-4">Total</th>
                      <th className="text-left pb-3 pr-4">Status</th>
                      <th className="text-left pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pr-4 text-white font-medium">{order.id}</td>
                        <td className="py-3 pr-4 text-white/60">{order.customer}</td>
                        <td className="py-3 pr-4 text-white/60">{order.items}</td>
                        <td className="py-3 pr-4 text-white">{order.total}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                            order.status === "preparing" ? "bg-skyhook-amber/10 text-skyhook-amber" :
                            order.status === "ready" ? "bg-blue-500/10 text-blue-400" :
                            "bg-white/10 text-white/40"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-white/30">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
