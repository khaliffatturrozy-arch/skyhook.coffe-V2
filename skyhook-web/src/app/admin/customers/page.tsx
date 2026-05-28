"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { MembershipBadge } from "@/components/ui/membership-badge"
import { Search, Users, TrendingUp, DollarSign } from "lucide-react"

const customers = [
  { name: "Khalif", email: "khalif@email.com", tier: "Skyhook Royalty" as const, orders: 47, spent: "IDR 8.2M", lastVisit: "Today" },
  { name: "Ayu", email: "ayu@email.com", tier: "VIP Elite" as const, orders: 38, spent: "IDR 6.1M", lastVisit: "Today" },
  { name: "Bima", email: "bima@email.com", tier: "VIP Elite" as const, orders: 35, spent: "IDR 5.8M", lastVisit: "Yesterday" },
  { name: "Citra", email: "citra@email.com", tier: "Platinum" as const, orders: 28, spent: "IDR 4.2M", lastVisit: "2 days ago" },
  { name: "Dimas", email: "dimas@email.com", tier: "Platinum" as const, orders: 25, spent: "IDR 3.9M", lastVisit: "Yesterday" },
  { name: "Elsa", email: "elsa@email.com", tier: "Gold" as const, orders: 18, spent: "IDR 2.1M", lastVisit: "3 days ago" },
  { name: "Farhan", email: "farhan@email.com", tier: "Gold" as const, orders: 15, spent: "IDR 1.8M", lastVisit: "5 days ago" },
  { name: "Gita", email: "gita@email.com", tier: "Silver" as const, orders: 10, spent: "IDR 980K", lastVisit: "1 week ago" },
]

export default function AdminCustomersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Customer Management</h1>
          <p className="text-white/40 text-sm mt-1">View and manage your customer base</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <GlassCard>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-skyhook-amber" />
            <div><p className="text-xl font-bold text-white">1,847</p><p className="text-white/30 text-xs">Total Customers</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div><p className="text-xl font-bold text-white">78%</p><p className="text-white/30 text-xs">Retention Rate</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <div><p className="text-xl font-bold text-white">IDR 185K</p><p className="text-white/30 text-xs">Avg Lifetime Value</p></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input placeholder="Search customers..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/30 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Tier</th>
              <th className="text-left p-4">Orders</th>
              <th className="text-left p-4">Total Spent</th>
              <th className="text-left p-4">Last Visit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.map((customer) => (
              <tr key={customer.email} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{customer.name}</td>
                <td className="p-4 text-white/40 text-xs">{customer.email}</td>
                <td className="p-4"><MembershipBadge tier={customer.tier} size="sm" /></td>
                <td className="p-4 text-white">{customer.orders}</td>
                <td className="p-4 text-white">{customer.spent}</td>
                <td className="p-4 text-white/40 text-xs">{customer.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
