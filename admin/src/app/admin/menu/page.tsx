"use client"
import { useState, useEffect } from "react"
import { Loader2, Plus } from "lucide-react"

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([]); const [cats, setCats] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [edit, setEdit] = useState<any>(null)
  const [form, setForm] = useState({ name: "", category_id: "", price: 0, is_available: true, preparation_time: 5 })

  async function load() { setLoading(true); const [mr, cr] = await Promise.all([fetch("/api/admin/menu"), fetch("/api/admin/menu?categories=true")]); setItems(Array.isArray(await mr.json()) ? await mr.json() : []); try { setCats(await cr.json()) } catch {}; setLoading(false) }
  useEffect(() => { load() }, [])

  async function handleSave() {
    const body = edit ? { ...form, id: edit.id } : form
    const res = await fetch("/api/admin/menu", { method: edit ? "PUT" : "POST", body: JSON.stringify(body) })
    if (res.ok) { setModal(false); setEdit(null); load() }
  }
  async function handleDelete(id: string) { if (confirm("Delete?")) { await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" }); load() } }

  return (<div>
    <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-[#212121]">Menu</h1><button onClick={() => { setEdit(null); setForm({ name: "", category_id: "", price: 0, is_available: true, preparation_time: 5 }); setModal(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#212121] text-white text-sm font-medium hover:bg-black"><Plus className="w-4 h-4" /> Add Item</button></div>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : !items.length ? <p className="text-gray-300 text-sm py-16 text-center">No menu items</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">Name</th><th className="text-left p-4">Category</th><th className="text-left p-4">Price</th><th className="text-left p-4">Available</th><th className="text-right p-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{items.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50">
          <td className="p-4 font-medium text-[#212121]">{i.name}</td>
          <td className="p-4 text-gray-500">{i.category_name || "—"}</td>
          <td className="p-4 font-medium">IDR {Number(i.price).toLocaleString()}</td>
          <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${i.is_available ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{i.is_available ? "Yes" : "No"}</span></td>
          <td className="p-4 text-right"><button onClick={() => { setEdit(i); setForm({ name: i.name, category_id: i.category_id, price: Number(i.price), is_available: i.is_available, preparation_time: i.preparation_time }); setModal(true) }} className="text-xs text-blue-600 hover:underline mr-3">Edit</button><button onClick={() => handleDelete(i.id)} className="text-xs text-red-600 hover:underline">Delete</button></td>
        </tr>))}</tbody></table>
      )}
    </div>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModal(false)}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-[#212121] mb-4">{edit ? "Edit" : "Add"} Menu Item</h2>
        <div className="space-y-3 mb-4">
          <div><label className="text-xs text-gray-500 mb-1 block">Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#212121]" /></div>
          <div><label className="text-xs text-gray-500 mb-1 block">Category</label><select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none bg-white"><option value="">Select</option>{cats.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="text-xs text-gray-500 mb-1 block">Price</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#212121]" /></div>
        </div>
        <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-[#212121] text-white font-semibold text-sm hover:bg-black">{edit ? "Update" : "Create"}</button>
      </div>
    </div>}
  </div>)
}
