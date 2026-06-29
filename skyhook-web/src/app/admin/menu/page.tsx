"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AdminSectionHeader, AdminGlassTable, AdminSearchBar } from "@/components/admin/admin-glass-card"
import { AdminiOSWidget } from "@/components/admin/admin-stats-card"
import { AdminModal } from "@/components/admin/admin-modal"
import { createClient } from "@/lib/supabase"
import {
  Plus, Search, Edit2, Trash2, Loader2, Coffee,
  UtensilsCrossed, DollarSign, Image, PackageOpen,
} from "lucide-react"

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [form, setForm] = useState({ name: "", description: "", category_id: "", price: 0, image_url: "", is_available: true })

  const supabase = createClient()

  async function loadItems() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/menu")
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch {} finally { setLoading(false) }
  }

  async function loadCategories() {
    const { data } = await supabase.from("categories").select("*").order("sort_order")
    setCategories(data || [])
  }

  useEffect(() => { loadItems(); loadCategories() }, [])

  function openAdd() {
    setForm({ name: "", description: "", category_id: categories[0]?.id || "", price: 0, image_url: "", is_available: true })
    setEditing(null); setModalOpen(true)
  }

  function openEdit(item: any) {
    setForm({
      name: item.name || "", description: item.description || "",
      category_id: item.category_id || "", price: Number(item.price || 0),
      image_url: item.image_url || "", is_available: item.is_available ?? true,
    })
    setEditing(item); setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const method = editing ? "PUT" : "POST"
      const body = editing ? { ...form, id: editing.id } : form
      const res = await fetch("/api/admin/menu", { method, body: JSON.stringify(body) })
      if (res.ok) { setModalOpen(false); loadItems() }
    } finally { setSaving(false) }
  }

  async function handleToggle(item: any) {
    const res = await fetch("/api/admin/menu", {
      method: "PUT",
      body: JSON.stringify({ id: item.id, ...item, is_available: !item.is_available }),
    })
    if (res.ok) loadItems()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return
    const res = await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" })
    if (res.ok) loadItems()
  }

  const filtered = items
    .filter((i) => selectedCategory === "all" || i.category_id === selectedCategory)
    .filter((i) => !search || i.name?.toLowerCase().includes(search.toLowerCase()))

  const stats = {
    total: items.length,
    available: items.filter((i) => i.is_available).length,
    categories: categories.length,
    avgPrice: items.length ? Math.round(items.reduce((s, i) => s + Number(i.price), 0) / items.length) : 0,
  }

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="QR Menu"
        description="Manage menu items, pricing, and availability"
        action={
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[20px] border border-white/10 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><UtensilsCrossed className="w-5 h-5 text-amber-400" /></div>
          <div><p className="text-2xl font-bold text-white">{stats.total}</p><p className="text-xs text-white/40">Total Items</p></div>
        </div>
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[20px] border border-white/10 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Coffee className="w-5 h-5 text-emerald-400" /></div>
          <div><p className="text-2xl font-bold text-white">{stats.available}</p><p className="text-xs text-white/40">Available</p></div>
        </div>
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[20px] border border-white/10 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><PackageOpen className="w-5 h-5 text-violet-400" /></div>
          <div><p className="text-2xl font-bold text-white">{stats.categories}</p><p className="text-xs text-white/40">Categories</p></div>
        </div>
        <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[20px] border border-white/10 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-blue-400" /></div>
          <div><p className="text-2xl font-bold text-white">IDR {stats.avgPrice.toLocaleString()}</p><p className="text-xs text-white/40">Avg Price</p></div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setSelectedCategory("all")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === "all" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-white/5 text-white/30 border border-transparent hover:text-white/60"
          }`}>All</button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-white/5 text-white/30 border border-transparent hover:text-white/60"
            }`}>{cat.name}</button>
        ))}
      </div>

      <AdminGlassTable>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <AdminSearchBar value={search} onChange={setSearch} placeholder="Search menu..." />
          <span className="text-xs text-white/20">{filtered.length} items</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/20 text-[11px] uppercase tracking-widest border-b border-white/5">
                  <th className="text-left p-4 font-medium">Item</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((item: any, i: number) => (
                  <motion.tr key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center overflow-hidden">
                          {item.image_url ? <img src={item.image_url} alt="" className="w-full h-full object-cover" /> : <Image className="w-4 h-4 text-white/20" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          {item.description && <p className="text-[10px] text-white/30 truncate max-w-[200px]">{item.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><span className="text-xs text-white/40">{item.categories?.name || "-"}</span></td>
                    <td className="p-4"><span className="text-sm font-semibold text-white">IDR {Number(item.price).toLocaleString()}</span></td>
                    <td className="p-4">
                      <button onClick={() => handleToggle(item)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                          item.available
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        }`}>
                          {item.is_available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-white/30 hover:text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminGlassTable>

      <AdminModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Edit Menu Item" : "Add Menu Item"}
        fields={[
          { name: "name", label: "Name", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "category_id", label: "Category", type: "select", options: categories.map((c) => ({ value: c.id, label: c.name })) },
          { name: "price", label: "Price (IDR)", type: "number", required: true },
          { name: "image_url", label: "Image URL", type: "text" },
        ]}
        values={form} onChange={(n, v) => setForm((f) => ({ ...f, [n]: v }))}
        onSubmit={handleSave} loading={saving} submitLabel={editing ? "Update" : "Create"}
      />
    </div>
  )
}
