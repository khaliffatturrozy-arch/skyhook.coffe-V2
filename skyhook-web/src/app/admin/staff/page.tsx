"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, Clock, Calendar } from "lucide-react"

const staffMembers = [
  { name: "Andi Pratama", role: "Outlet Manager", outlet: "Jakarta", shift: "09:00 - 17:00", status: "on_duty" },
  { name: "Sari Dewi", role: "Barista", outlet: "Jakarta", shift: "15:00 - 23:00", status: "on_duty" },
  { name: "Rudi Hartono", role: "Server", outlet: "Jakarta", shift: "15:00 - 23:00", status: "on_duty" },
  { name: "Maya Indah", role: "Kitchen Chef", outlet: "Bali", shift: "07:00 - 15:00", status: "off_duty" },
  { name: "Wayan Sudana", role: "Outlet Manager", outlet: "Bali", shift: "09:00 - 17:00", status: "on_duty" },
  { name: "Gede Putra", role: "Bartender", outlet: "Bali", shift: "15:00 - 23:00", status: "on_duty" },
]

export default function AdminStaffPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Staff Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage your team across all outlets</p>
        </div>
        <Button variant="primary">
          <UserPlus className="w-4 h-4 mr-2" /> Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <GlassCard>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-skyhook-amber" />
            <div><p className="text-xl font-bold text-white">36</p><p className="text-white/30 text-xs">Total Staff</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-400" />
            <div><p className="text-xl font-bold text-white">24</p><p className="text-white/30 text-xs">On Duty</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div><p className="text-xl font-bold text-white">12</p><p className="text-white/30 text-xs">Off Duty</p></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/30 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Outlet</th>
              <th className="text-left p-4">Shift</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {staffMembers.map((member) => (
              <tr key={member.name} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-white font-medium">{member.name}</td>
                <td className="p-4 text-white/60">{member.role}</td>
                <td className="p-4 text-white/40">{member.outlet}</td>
                <td className="p-4 text-white/60 text-xs">{member.shift}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === "on_duty" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-white/40"
                  }`}>
                    {member.status === "on_duty" ? "On Duty" : "Off Duty"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
