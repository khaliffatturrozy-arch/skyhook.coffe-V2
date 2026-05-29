"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { MembershipBadge } from "@/components/ui/membership-badge"
import { Search, Users, TrendingUp, DollarSign, Loader2 } from "lucide-react"

type Customer = {
  id: string
  full_name: string
  email: string
  phone: string | null
  membership_tier: string
  total_orders: number
  total_spent: number
  last_visit: string | null
  created_at: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/customers")
      const data = await res.json()
      if (data.customers) setCustomers(data.customers)
      setLoading(false)
    })()
  }, [])

  const filtered = customers.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.full_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
  })

  function formatSpent(n: number) {
    if (n >= 1_000_000) return `IDR ${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `IDR ${(n / 1_000).toFixed(0)}K`
    return `IDR ${n}`
  }

  function timeAgo(iso: string | null) {
    if (!iso) return "Never"
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    return `${d}d ago`
  }

  const totalCustomers = customers.length
  const avgSpent = totalCustomers > 0 ? customers.reduce((s, c) => s + Number(c.total_spent), 0) / totalCustomers : 0

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
            <div><p className="text-xl font-bold text-white">{totalCustomers.toLocaleString()}</p><p className="text-white/30 text-xs">Total Customers</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <div><p className="text-xl font-bold text-white">{totalCustomers > 0 ? `${Math.round((customers.filter(c => c.total_orders > 0).length / totalCustomers) * 100)}%` : "0%"}</p><p className="text-white/30 text-xs">Active Rate</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <div><p className="text-xl font-bold text-white">{formatSpent(avgSpent)}</p><p className="text-white/30 text-xs">Avg Lifetime Value</p></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-skyhook-amber" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-white/20">No customers found</div>
        ) : (
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
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{customer.full_name}</td>
                  <td className="p-4 text-white/40 text-xs">{customer.email}</td>
                  <td className="p-4"><MembershipBadge tier={customer.membership_tier as any} size="sm" /></td>
                  <td className="p-4 text-white">{customer.total_orders}</td>
                  <td className="p-4 text-white">{formatSpent(Number(customer.total_spent))}</td>
                  <td className="p-4 text-white/40 text-xs">{timeAgo(customer.last_visit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  )
}
