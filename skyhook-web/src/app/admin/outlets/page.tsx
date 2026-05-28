"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Store, MapPin, TrendingUp, Users as UsersIcon, DollarSign } from "lucide-react"

const outlets = [
  { name: "Skyhook Coffee — Jakarta", city: "Jakarta", manager: "Andi Pratama", staff: 12, revenue: "IDR 185M", growth: "+12.5%", status: "active" },
  { name: "Skyhook Coffee — Bali", city: "Bali", manager: "Wayan Sudana", staff: 10, revenue: "IDR 210M", growth: "+18.3%", status: "active" },
  { name: "Skyhook Coffee — Bandung", city: "Bandung", manager: "Rina Fitri", staff: 8, revenue: "IDR 98M", growth: "+8.7%", status: "active" },
  { name: "Skyhook Coffee — Surabaya", city: "Surabaya", manager: "TBA", staff: 0, revenue: "-", growth: "-", status: "coming_soon" },
  { name: "Skyhook Coffee — Yogyakarta", city: "Yogyakarta", manager: "Budi Santoso", staff: 6, revenue: "IDR 72M", growth: "+15.2%", status: "active" },
]

export default function AdminOutletsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Outlet Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage all Skyhook locations globally</p>
        </div>
        <Button variant="primary">
          <Store className="w-4 h-4 mr-2" /> Add Outlet
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <GlassCard>
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-skyhook-amber" />
            <div><p className="text-xl font-bold text-white">5</p><p className="text-white/30 text-xs">Total Outlets</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <UsersIcon className="w-5 h-5 text-blue-400" />
            <div><p className="text-xl font-bold text-white">36</p><p className="text-white/30 text-xs">Total Staff</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div><p className="text-xl font-bold text-white">IDR 565M</p><p className="text-white/30 text-xs">Total Revenue</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <div><p className="text-xl font-bold text-white">+13.7%</p><p className="text-white/30 text-xs">Avg Growth</p></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/30 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Outlet</th>
              <th className="text-left p-4">City</th>
              <th className="text-left p-4">Manager</th>
              <th className="text-left p-4">Staff</th>
              <th className="text-left p-4">Revenue</th>
              <th className="text-left p-4">Growth</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {outlets.map((outlet) => (
              <tr key={outlet.name} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{outlet.name}</td>
                <td className="p-4 text-white/60 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-skyhook-amber" /> {outlet.city}
                </td>
                <td className="p-4 text-white/60">{outlet.manager}</td>
                <td className="p-4 text-white">{outlet.staff}</td>
                <td className="p-4 text-white">{outlet.revenue}</td>
                <td className="p-4 text-emerald-400">{outlet.growth}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    outlet.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-skyhook-amber/10 text-skyhook-amber"
                  }`}>
                    {outlet.status === "active" ? "Active" : "Coming Soon"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm">Manage</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
