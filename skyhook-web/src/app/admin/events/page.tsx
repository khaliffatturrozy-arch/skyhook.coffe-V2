"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Users, DollarSign, TrendingUp } from "lucide-react"

const events = [
  { name: "Neon Nights", date: "Every Friday", tickets: 45, capacity: 60, revenue: "IDR 6.75M", status: "active" },
  { name: "Acoustic Sessions", date: "Every Saturday", tickets: 32, capacity: 40, revenue: "IDR 3.2M", status: "active" },
  { name: "Skyhook Social", date: "Jun 15", tickets: 18, capacity: 30, revenue: "Free", status: "upcoming" },
  { name: "Sunset Vibes", date: "Every Sunday", tickets: 28, capacity: 35, revenue: "IDR 2.1M", status: "active" },
  { name: "VIP Royal Dinner", date: "Jun 20", tickets: 8, capacity: 12, revenue: "IDR 4M", status: "upcoming" },
]

export default function AdminEventsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Events Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage rooftop events, live music, and VIP experiences</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" /> Create Event
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Events", value: "3", icon: Calendar, color: "text-skyhook-amber" },
          { label: "Total Attendees", value: "123", icon: Users, color: "text-blue-400" },
          { label: "Event Revenue", value: "IDR 12M", icon: DollarSign, color: "text-emerald-400" },
          { label: "Avg Fill Rate", value: "78%", icon: TrendingUp, color: "text-purple-400" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <GlassCard key={stat.label}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
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
              <th className="text-left p-4">Event</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Tickets</th>
              <th className="text-left p-4">Capacity</th>
              <th className="text-left p-4">Revenue</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((event) => (
              <tr key={event.name} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{event.name}</td>
                <td className="p-4 text-white/60">{event.date}</td>
                <td className="p-4 text-white">{event.tickets}/{event.capacity}</td>
                <td className="p-4 text-white/60">{Math.round(event.tickets / event.capacity * 100)}%</td>
                <td className="p-4 text-white">{event.revenue}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    event.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-skyhook-amber/10 text-skyhook-amber"
                  }`}>
                    {event.status}
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
