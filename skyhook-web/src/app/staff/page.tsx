"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Clock, Bell, ClipboardList, QrCode, LogOut, User, Loader2 } from "lucide-react"

export default function StaffPage() {
  const [data, setData] = useState<any>({ staff: [], tasks: [], shifts: [], currentUser: null })
  const [loading, setLoading] = useState(true)
  const [clocking, setClocking] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch("/api/staff/portal")
    const d = await res.json()
    setData(d)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function clockIn(staffId: string) {
    setClocking(true)
    await fetch("/api/staff/portal", { method: "POST", body: JSON.stringify({ action: "clock-in", staff_id: staffId }) })
    load()
    setClocking(false)
  }

  async function clockOut(staffId: string) {
    setClocking(true)
    await fetch("/api/staff/portal", { method: "POST", body: JSON.stringify({ action: "clock-out", staff_id: staffId }) })
    load()
    setClocking(false)
  }

  async function updateTask(taskId: string, status: string) {
    await fetch("/api/staff/portal", { method: "POST", body: JSON.stringify({ action: "update-task", task_id: taskId, status }) })
    load()
  }

  const activeShift = data.shifts?.find((s: any) => s.status === "active" && !s.clock_out)
  const currentStaff = data.currentUser ? data.staff?.find((s: any) => s.user_id === data.currentUser.id) : null

  return (
    <div className="pt-24 min-h-screen">
      <div className="section-padding py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold">Staff Portal</h1>
              <p className="text-white/40 text-sm">Skyhook Coffee — {currentStaff?.outlets?.name || "Main Rooftop"}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm"><Bell className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm"><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <GlassCard>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-skyhook-amber" />
                <div>
                  <p className="text-white font-medium">{currentStaff ? `Staff - ${currentStaff.role}` : "Staff Name"}</p>
                  <p className="text-white/30 text-xs">{currentStaff?.role || "Server"} · {activeShift ? "On Shift" : "Off Duty"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {activeShift ? (
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => clockOut(currentStaff.id)} disabled={clocking}>
                    <LogOut className="w-4 h-4 mr-2" /> {clocking ? "..." : "Clock Out"}
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => clockIn(currentStaff?.id || data.staff[0]?.id)} disabled={clocking || !currentStaff}>
                    <Clock className="w-4 h-4 mr-2" /> {clocking ? "..." : "Clock In"}
                  </Button>
                )}
                <Button variant="secondary" size="sm"><QrCode className="w-4 h-4" /></Button>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-heading text-base font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm"><ClipboardList className="w-4 h-4 mr-2" /> Orders</Button>
                <Button variant="secondary" size="sm"><Bell className="w-4 h-4 mr-2" /> Waiter Call</Button>
              </div>
            </GlassCard>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-skyhook-amber" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard>
                <h2 className="font-heading text-xl font-semibold mb-4">Staff On Duty</h2>
                <div className="space-y-3">
                  {data.staff?.filter((s: any) => s.is_active).map((staff: any) => (
                    <div key={staff.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div>
                        <p className="text-white text-sm font-medium capitalize">{staff.role}</p>
                        <p className="text-white/30 text-xs">{staff.users?.email || "Unknown"}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">{staff.outlets?.name || "Active"}</span>
                    </div>
                  ))}
                  {data.staff?.length === 0 && <p className="text-white/20 text-center py-4">No staff data</p>}
                </div>
              </GlassCard>

              <GlassCard>
                <h2 className="font-heading text-xl font-semibold mb-4">Tasks</h2>
                <div className="space-y-2">
                  {data.tasks?.map((task: any) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${task.priority === "high" ? "bg-red-400" : task.priority === "medium" ? "bg-skyhook-amber" : "bg-emerald-400"}`} />
                      <div className="flex-1">
                        <p className="text-white text-sm">{task.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${task.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : task.status === "in_progress" ? "bg-blue-500/10 text-blue-400" : "bg-white/10 text-white/40"}`}>{task.status}</span>
                      </div>
                      {task.status !== "completed" && (
                        <button onClick={() => updateTask(task.id, task.status === "pending" ? "in_progress" : "completed")} className="text-xs text-skyhook-amber hover:text-skyhook-gold whitespace-nowrap">
                          {task.status === "pending" ? "Start" : "Complete"}
                        </button>
                      )}
                    </div>
                  ))}
                  {data.tasks?.length === 0 && <p className="text-white/20 text-center py-4">No tasks</p>}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
