"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { AdminModal } from "@/components/admin/admin-modal"
import { Plus, Calendar, Users, DollarSign, Edit2, Trash2 } from "lucide-react"

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Events Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage rooftop events, live music, and VIP experiences</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Create Event</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4">{[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}</div>
      ) : events.length === 0 ? (
        <GlassCard><p className="text-white/20 text-center py-8">No events yet</p></GlassCard>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {events.map((event: any) => (
            <GlassCard key={event.id}>
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-5 h-5 text-skyhook-amber" />
                <span className={`text-xs px-2 py-1 rounded-full ${event.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-skyhook-amber/10 text-skyhook-amber"}`}>{event.status}</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{event.title}</h3>
              <p className="text-white/30 text-xs mb-3">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
              <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {event.tickets_sold || 0}/{event.capacity}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {event.price === 0 ? "Free" : `IDR ${Number(event.price).toLocaleString()}`}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(event)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-xs transition-colors"><Edit2 className="w-3 h-3" /> Edit</button>
                <button onClick={() => handleDelete(event.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-400/40 hover:text-red-400 text-xs transition-colors"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </GlassCard>
          ))}
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
