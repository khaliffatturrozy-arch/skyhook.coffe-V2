"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { AdminModal } from "@/components/admin/admin-modal"
import { Store, MapPin, Edit2, Trash2, Plus, Loader2 } from "lucide-react"

export default function AdminOutletsPage() {
  const [outlets, setOutlets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "", email: "", is_active: true })

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/outlets")
    const d = await res.json()
    setOutlets(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm({ name: "", address: "", city: "", phone: "", email: "", is_active: true })
    setEditing(null); setModalOpen(true)
  }

  function openEdit(item: any) {
    setForm({
      name: item.name || "", address: item.address || "", city: item.city || "",
      phone: item.phone || "", email: item.email || "", is_active: item.is_active ?? true,
    })
    setEditing(item); setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const method = editing ? "PUT" : "POST"
      const body = editing ? { ...form, id: editing.id } : form
      const res = await fetch("/api/admin/outlets", { method, body: JSON.stringify(body) })
      if (res.ok) { setModalOpen(false); load() }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this outlet?")) return
    const res = await fetch(`/api/admin/outlets?id=${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Outlet Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage all Skyhook locations</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Store className="w-4 h-4 mr-2" /> Add Outlet</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <GlassCard>
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-skyhook-amber" />
            <div><p className="text-xl font-bold text-white">{loading ? "-" : outlets.length}</p><p className="text-white/30 text-xs">Total Outlets</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <div><p className="text-xl font-bold text-white">{loading ? "-" : outlets.filter((o) => o.is_active).length}</p><p className="text-white/30 text-xs">Active Locations</p></div>
          </div>
        </GlassCard>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-skyhook-amber" /></div>
      ) : outlets.length === 0 ? (
        <div className="text-center py-16 text-white/20">No outlets found</div>
      ) : (
        <div className="grid gap-4">
          {outlets.map((outlet) => (
            <GlassCard key={outlet.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{outlet.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${outlet.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                      {outlet.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-skyhook-amber" /> {outlet.address}, {outlet.city}
                  </p>
                  {outlet.phone && <p className="text-white/30 text-xs">{outlet.phone}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(outlet)} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(outlet.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <AdminModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Outlet" : "Add Outlet"}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "address", label: "Address", type: "textarea" },
          { name: "city", label: "City", type: "text" },
          { name: "phone", label: "Phone", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "is_active", label: "Status", type: "select", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] },
        ]}
        values={{ ...form, is_active: String(form.is_active) }} onChange={(n, v) => setForm((f) => ({ ...f, [n]: n === "is_active" ? v === "true" : v }))}
        onSubmit={handleSave} loading={saving} submitLabel={editing ? "Update" : "Create"}
      />
    </div>
  )
}
