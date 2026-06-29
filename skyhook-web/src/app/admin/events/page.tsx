"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AdminSectionHeader, AdminGlassTable } from "@/components/admin/admin-glass-card"
import { AdminModal } from "@/components/admin/admin-modal"
import { Plus, Calendar, Users, DollarSign, Edit2, Trash2, Loader2, Music, PartyPopper, GraduationCap, Crown } from "lucide-react"

const TYPE_ICONS: Record<string, any> = { music: Music, party: PartyPopper, workshop: GraduationCap, vip: Crown }
const TYPE_COLORS: Record<string, string> = {
  music: "from-rose-500/10 to-pink-500/5 text-rose-400 border-rose-500/20",
  party: "from-amber-500/10 to-yellow-500/5 text-amber-400 border-amber-500/20",
  workshop: "from-blue-500/10 to-cyan-500/5 text-blue-400 border-blue-500/20",
  vip: "from-violet-500/10 to-purple-500/5 text-violet-400 border-violet-500/20",
}
const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  full: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  finished: "bg-white/5 text-white/30 border-white/10",
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", venue: "", type: "music", price: 0, capacity: 0, image_url: "", status: "active" })

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/events")
    const d = await res.json()
    setEvents(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm({ title: "", description: "", date: "", time: "", venue: "", type: "music", price: 0, capacity: 0, image_url: "", status: "active" })
    setEditing(null); setModalOpen(true)
  }

  function openEdit(e: any) {
    setForm({
      title: e.title || "", description: e.description || "", date: e.date?.slice(0, 10) || "",
      time: e.time || "", venue: e.venue || "", type: e.type || "music",
      price: Number(e.price || 0), capacity: Number(e.capacity || 0),
      image_url: e.image_url || "", status: e.status || "active",
    })
    setEditing(e); setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const method = editing ? "PUT" : "POST"
      const body = editing ? { ...form, id: editing.id } : form
      const res = await fetch("/api/admin/events", { method, body: JSON.stringify(body) })
      if (res.ok) { setModalOpen(false); load() }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return
    const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  const filtered = statusFilter === "all" ? events : events.filter((e) => e.status === statusFilter)

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Events"
        description="Manage rooftop events, live music, VIP experiences"
        action={
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setStatusFilter("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
            statusFilter === "all" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-white/5 text-white/30 border border-transparent hover:text-white/60"}`}>All ({events.length})</button>
        {["active", "draft", "cancelled", "finished"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              statusFilter === s ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-white/5 text-white/30 border border-transparent hover:text-white/60"
            }`}>{s} ({events.filter((e) => e.status === s).length})</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map((i) => <div key={i} className="h-44 rounded-3xl bg-white/5 animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[20px] border border-white/10 p-12 text-center">
          <Calendar className="w-10 h-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/20 text-sm">No events yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((event: any, i: number) => {
            const TypeIcon = TYPE_ICONS[event.type] || Calendar
            const typeColor = TYPE_COLORS[event.type] || "bg-white/5 text-white/40 border-white/10"
            return (
              <motion.div key={event.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-[20px]" />
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[20px] border border-white/10 p-5 transition-all duration-300 hover:border-white/20 h-full flex flex-col">
                  {event.image_url && (
                    <div className="w-full h-28 rounded-2xl overflow-hidden mb-4 -mx-0">
                      <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${typeColor}`}>
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                      STATUS_STYLES[event.status] || "bg-white/5 text-white/40 border-white/10"
                    }`}>{event.status}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{event.title}</h3>
                  <p className="text-xs text-white/30 mb-3">{event.date?.slice(0, 10)} at {event.time}</p>
                  <p className="text-xs text-white/20 mb-3 line-clamp-2">{event.description || ""}</p>
                  <div className="flex items-center gap-3 text-xs text-white/40 mt-auto mb-3">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.tickets_sold || 0}/{event.capacity || "-"}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {event.price === 0 ? "Free" : `IDR ${Number(event.price).toLocaleString()}`}</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => openEdit(event)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-xs transition-all"><Edit2 className="w-3 h-3" /> Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400/40 hover:text-red-400 text-xs transition-all"><Trash2 className="w-3 h-3" /> Delete</button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AdminModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Event" : "Create Event"}
        fields={[
          { name: "title", label: "Title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "date", label: "Date", type: "text", required: true },
          { name: "time", label: "Time", type: "text" },
          { name: "venue", label: "Venue", type: "text" },
          { name: "type", label: "Type", type: "select", options: [{ value: "music", label: "Live Music" }, { value: "party", label: "Party" }, { value: "workshop", label: "Workshop" }, { value: "vip", label: "VIP" }] },
          { name: "price", label: "Price (IDR)", type: "number" },
          { name: "capacity", label: "Capacity", type: "number" },
          { name: "image_url", label: "Image URL", type: "text" },
          { name: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "draft", label: "Draft" }, { value: "cancelled", label: "Cancelled" }] },
        ]}
        values={form} onChange={(n, v) => setForm((f) => ({ ...f, [n]: v }))}
        onSubmit={handleSave} loading={saving} submitLabel={editing ? "Update" : "Create"}
      />
    </div>
  )
}
