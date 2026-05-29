"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { AdminModal } from "@/components/admin/admin-modal"
import { Package, AlertTriangle, Edit2, Trash2, Plus, Loader2 } from "lucide-react"

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", category: "beverage", quantity: 0, unit: "pcs", min_stock: 0, outlet_id: "" })

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/inventory")
    const d = await res.json()
    setItems(Array.isArray(d) ? d : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm({ name: "", category: "beverage", quantity: 0, unit: "pcs", min_stock: 0, outlet_id: "" })
    setEditing(null); setModalOpen(true)
  }

  function openEdit(item: any) {
    setForm({
      name: item.name || "", category: item.category || "beverage",
      quantity: Number(item.quantity || 0), unit: item.unit || "pcs",
      min_stock: Number(item.min_stock || 0), outlet_id: item.outlet_id || "",
    })
    setEditing(item); setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const method = editing ? "PUT" : "POST"
      const body = editing ? { ...form, id: editing.id } : form
      const res = await fetch("/api/admin/inventory", { method, body: JSON.stringify(body) })
      if (res.ok) { setModalOpen(false); load() }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return
    const res = await fetch(`/api/admin/inventory?id=${id}`, { method: "DELETE" })
    if (res.ok) load()
  }

  function getStatus(item: any): "critical" | "low" | "normal" {
    if (item.quantity <= 0) return "critical"
    if (item.quantity <= item.min_stock) return "low"
    return "normal"
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    critical: { label: "Critical", color: "text-red-400 bg-red-500/10" },
    low: { label: "Low Stock", color: "text-skyhook-amber bg-skyhook-amber/10" },
    normal: { label: "In Stock", color: "text-emerald-400 bg-emerald-500/10" },
  }

  const lowStock = items.filter(i => getStatus(i) !== "normal").length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Inventory Management</h1>
          <p className="text-white/40 text-sm mt-1">AI-powered stock tracking</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <GlassCard>
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-blue-400" />
            <div><p className="text-2xl font-bold text-white">{loading ? "-" : items.length}</p><p className="text-white/30 text-xs">Total Items</p></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-skyhook-amber" />
            <div><p className="text-2xl font-bold text-white">{loading ? "-" : lowStock}</p><p className="text-white/30 text-xs">Low Stock Alerts</p></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-skyhook-amber" /></div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-white/20">No inventory items found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left p-4">Item</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Min Stock</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => {
                const status = statusConfig[getStatus(item)]
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-medium">{item.name}</td>
                    <td className="p-4 text-white/40 text-xs capitalize">{item.category}</td>
                    <td className="p-4 text-white">{item.quantity} {item.unit}</td>
                    <td className="p-4 text-white/60">{item.min_stock}</td>
                    <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>{status.label}</span></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </GlassCard>

      <AdminModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Inventory Item" : "Add Inventory Item"}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "category", label: "Category", type: "select", options: [
            { value: "beverage", label: "Beverage" }, { value: "food", label: "Food" },
            { value: "spirit", label: "Spirit" }, { value: "packaging", label: "Packaging" },
            { value: "cleaning", label: "Cleaning" }, { value: "other", label: "Other" },
          ]},
          { name: "quantity", label: "Quantity", type: "number" },
          { name: "unit", label: "Unit", type: "text" },
          { name: "min_stock", label: "Min Stock", type: "number" },
        ]}
        values={form} onChange={(n, v) => setForm((f) => ({ ...f, [n]: v }))}
        onSubmit={handleSave} loading={saving} submitLabel={editing ? "Update" : "Create"}
      />
    </div>
  )
}
