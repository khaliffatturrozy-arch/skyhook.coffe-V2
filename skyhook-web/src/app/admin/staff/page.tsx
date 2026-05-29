"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { AdminModal } from "@/components/admin/admin-modal"
import { Users, Edit2, Trash2, Plus, Loader2 } from "lucide-react"

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ user_id: "", outlet_id: "", role: "barista", hourly_rate: 0, is_active: true, joined_at: new Date().toISOString().slice(0, 10) })

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/staff")
    const d = await res.json()
    setStaff(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm({ user_id: "", outlet_id: "", role: "barista", hourly_rate: 0, is_active: true, joined_at: new Date().toISOString().slice(0, 10) })
    setEditing(null); setModalOpen(true)
  }

  function openEdit(item: any) {
    setForm({
      user_id: item.user_id || "", outlet_id: item.outlet_id || "",
      role: item.role || "barista", hourly_rate: Number(item.hourly_rate || 0),
      is_active: item.is_active ?? true, joined_at: item.joined_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    })
    setEditing(item); setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const method = editing ? "PUT" : "POST"
      const body = editing ? { ...form, id: editing.id } : form
      const res = await fetch("/api/admin/staff", { method, body: JSON.stringify(body) })
      if (res.ok) { setModalOpen(false); load() }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete staff member?")) return
    const res = await fetch(`/api/admin/staff?id=${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Staff Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage staff, roles, and scheduling</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Staff</Button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-skyhook-amber" /></div>
        ) : staff.length === 0 ? (
          <div className="text-center py-16 text-white/20">No staff found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left p-4">User</th>
                <th className="text-left p-4">Outlet</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Rate</th>
                <th className="text-left p-4">Active</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {staff.map((s: any) => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{s.users?.email || "Unknown"}</td>
                  <td className="p-4 text-white/40">{s.outlets?.name || "-"}</td>
                  <td className="p-4 text-white/60 capitalize">{s.role}</td>
                  <td className="p-4 text-white">IDR {Number(s.hourly_rate || 0).toLocaleString()}/hr</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${s.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {s.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>

      <AdminModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Staff" : "Add Staff"}
        fields={[
          { name: "role", label: "Role", type: "select", options: [
            { value: "barista", label: "Barista" }, { value: "chef", label: "Chef" },
            { value: "server", label: "Server" }, { value: "manager", label: "Manager" },
            { value: "admin", label: "Admin" },
          ]},
          { name: "hourly_rate", label: "Hourly Rate (IDR)", type: "number" },
          { name: "joined_at", label: "Joined Date", type: "text" },
          { name: "is_active", label: "Status", type: "select", options: [{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }] },
        ]}
        values={{ ...form, is_active: String(form.is_active) }} onChange={(n, v) => setForm((f) => ({ ...f, [n]: n === "is_active" ? v === "true" : v }))}
        onSubmit={handleSave} loading={saving} submitLabel={editing ? "Update" : "Create"}
      />
    </div>
  )
}
