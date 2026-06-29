"use client"
import { useState, useEffect } from "react"
import { Loader2, Plus } from "lucide-react"
export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [edit, setEdit] = useState<any>(null)
  const [form, setForm] = useState({ name: "", category: "", quantity: 0, unit: "pcs", min_stock: 0 })
  async function load() { setLoading(true); const res = await fetch("/api/admin/inventory"); setItems(Array.isArray(await res.json()) ? await res.json() : []); setLoading(false) }
  useEffect(() => { load() }, [])
  async function handleSave() { const body = edit ? { ...form, id: edit.id } : form; const res = await fetch("/api/admin/inventory", { method: edit ? "PUT" : "POST", body: JSON.stringify(body) }); if (res.ok) { setModal(false); setEdit(null); load() } }
  async function handleDelete(id: string) { if (confirm("Delete?")) { await fetch(`/api/admin/inventory?id=${id}`, { method: "DELETE" }); load() } }
  return (<div>
    <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-[#212121]">Inventory</h1><button onClick={() => { setEdit(null); setForm({ name: "", category: "", quantity: 0, unit: "pcs", min_stock: 0 }); setModal(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#212121] text-white text-sm font-medium hover:bg-black"><Plus className="w-4 h-4" /> Add Item</button></div>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : !items.length ? <p className="text-gray-300 text-sm py-16 text-center">No inventory</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">Name</th><th className="text-left p-4">Category</th><th className="text-left p-4">Qty</th><th className="text-left p-4">Unit</th><th className="text-left p-4">Min Stock</th><th className="text-right p-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{items.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50">
          <td className="p-4 font-medium text-[#212121]">{i.name}</td><td className="p-4 text-gray-500 capitalize">{i.category || "—"}</td>
          <td className="p-4"><span className={`font-medium ${Number(i.quantity) <= Number(i.min_stock) ? "text-red-600" : "text-[#212121]"}`}>{i.quantity}</span></td>
          <td className="p-4 text-gray-500">{i.unit}</td><td className="p-4 text-gray-500">{i.min_stock}</td>
          <td className="p-4 text-right"><button onClick={() => { setEdit(i); setForm({ name: i.name, category: i.category || "", quantity: Number(i.quantity), unit: i.unit, min_stock: Number(i.min_stock) }); setModal(true) }} className="text-xs text-blue-600 hover:underline mr-3">Edit</button><button onClick={() => handleDelete(i.id)} className="text-xs text-red-600 hover:underline">Delete</button></td>
        </tr>))}</tbody></table>
      )}
    </div>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModal(false)}><div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
      <h2 className="text-lg font-bold text-[#212121] mb-4">{edit ? "Edit" : "Add"} Inventory</h2>
      <div className="space-y-3 mb-4">
        <div><label className="text-xs text-gray-500 mb-1 block">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none" /></div>
        <div><label className="text-xs text-gray-500 mb-1 block">Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none" /></div>
        <div><label className="text-xs text-gray-500 mb-1 block">Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none" /></div>
      </div>
      <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-[#212121] text-white font-semibold text-sm hover:bg-black">{edit ? "Update" : "Create"}</button>
    </div></div>}
  </div>)
}
