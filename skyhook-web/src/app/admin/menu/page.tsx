"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { AdminModal } from "@/components/admin/admin-modal"
import { createClient } from "@/lib/supabase"
import { Plus, Search, Edit2, ToggleLeft, Trash2, Loader2 } from "lucide-react"

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", description: "", category_id: "", price: 0, image_url: "", available: true })

  async function loadItems() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/menu")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {} finally { setLoading(false) }
  }

  async function loadCategories() {
    const { data } = await createClient().from("categories").select("*")
    setCategories(data || [])
  }

  useEffect(() => { loadItems(); loadCategories() }, [])

  function openAdd() {
    setForm({ name: "", description: "", category_id: "", price: 0, image_url: "", available: true })
    setEditing(null); setModalOpen(true)
  }

  function openEdit(item: any) {
    setForm({
      name: item.name || "",
      description: item.description || "",
      category_id: item.category_id || "",
      price: Number(item.price || 0),
      image_url: item.image_url || "",
      available: item.available ?? true,
    })
    setEditing(item); setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const endpoint = editing ? `/api/admin/menu` : `/api/admin/menu`
      const method = editing ? "PUT" : "POST"
      const body = editing ? { ...form, id: editing.id } : form
      const res = await fetch(endpoint, { method, body: JSON.stringify(body) })
      if (!res.ok) return
      setModalOpen(false); loadItems()
    } finally { setSaving(false) }
  }

  async function handleToggle(item: any) {
    const res = await fetch("/api/admin/menu", {
      method: "PUT",
      body: JSON.stringify({ id: item.id, ...item, available: !item.available }),
    })
    if (res.ok) loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this menu item?")) return
    const res = await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" })
    if (res.ok) loadItems()
  }

  const filtered = search ? items.filter((i) => i.name?.toLowerCase().includes(search.toLowerCase())) : items
  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold">Menu Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage your menu items and categories</p>
        </div>
        <Button variant="primary" onClick={openAdd}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input placeholder="Search menu..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs uppercase tracking-wider">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Available</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((item: any) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{item.name}</td>
                  <td className="p-4 text-white/40">{item.categories?.name || "-"}</td>
                  <td className="p-4 text-white">IDR {Number(item.price).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${item.available ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                      {item.available ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleToggle(item)} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"><ToggleLeft className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
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
        title={editing ? "Edit Menu Item" : "Add Menu Item"}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "category_id", label: "Category", type: "select", options: categoryOptions },
          { name: "price", label: "Price (IDR)", type: "number", required: true },
          { name: "image_url", label: "Image URL", type: "text" },
        ]}
        values={form} onChange={(n, v) => setForm((f) => ({ ...f, [n]: v }))}
        onSubmit={handleSave} loading={saving} submitLabel={editing ? "Update" : "Create"}
      />
    </div>
  )
}
