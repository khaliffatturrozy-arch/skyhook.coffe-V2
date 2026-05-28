"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Clock, Bell, ClipboardList, QrCode, LogOut, User } from "lucide-react"

const shifts = [
  { role: "Barista", time: "07:00 - 15:00", staff: 3, status: "active" },
  { role: "Server", time: "15:00 - 23:00", staff: 5, status: "active" },
  { role: "Kitchen", time: "15:00 - 23:00", staff: 4, status: "active" },
  { role: "Bartender", time: "18:00 - 02:00", staff: 2, status: "upcoming" },
]

const tasks = [
  { task: "Restock coffee beans (Bar #2)", priority: "high", assigned: "Staff K" },
  { task: "Clean VIP Lounge section", priority: "medium", assigned: "Staff A" },
  { task: "Prepare event setup for Neon Nights", priority: "high", assigned: "All Staff" },
  { task: "Inventory check - Pastry section", priority: "low", assigned: "Staff R" },
]

export default function StaffPage() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="section-padding py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold">Staff Portal</h1>
              <p className="text-white/40 text-sm">Skyhook Coffee — Main Rooftop</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-skyhook-amber" />
                <div>
                  <p className="text-white font-medium">Staff Name</p>
                  <p className="text-white/30 text-xs">Server · Shift: 15:00 - 23:00</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1">
                  <Clock className="w-4 h-4 mr-2" /> Clock In
                </Button>
                <Button variant="secondary" size="sm">
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-heading text-base font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm">
                  <ClipboardList className="w-4 h-4 mr-2" /> Orders
                </Button>
                <Button variant="secondary" size="sm">
                  <Bell className="w-4 h-4 mr-2" /> Waiter Call
                </Button>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
              <h2 className="font-heading text-xl font-semibold mb-4">Today's Shifts</h2>
              <div className="space-y-3">
                {shifts.map((shift) => (
                  <div key={shift.role} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="text-white text-sm font-medium">{shift.role}</p>
                      <p className="text-white/30 text-xs">{shift.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">{shift.staff} staff</p>
                      <span className={`text-xs ${
                        shift.status === "active" ? "text-emerald-400" : "text-skyhook-amber"
                      }`}>
                        {shift.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="font-heading text-xl font-semibold mb-4">Tasks</h2>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.task} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      task.priority === "high" ? "bg-red-400" :
                      task.priority === "medium" ? "bg-skyhook-amber" : "bg-emerald-400"
                    }`} />
                    <div>
                      <p className="text-white text-sm">{task.task}</p>
                      <p className="text-white/30 text-xs">Assigned: {task.assigned}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
