"use client"
import { useState, useEffect } from "react"
import { Loader2, Plus } from "lucide-react"
export default function AdminEventsPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [edit, setEdit] = useState<any>(null)
  const [form, setForm] = useState({ title: "", type: "live_music", date: "", price: 0, capacity: 50 })
  async function load() { setLoading(true); const res = await fetch("/api/admin/events"); setItems(Array.isArray(await res.json()) ? await res.json() : []); setLoading(false) }
  useEffect(() => { load() }, [])
  async function handleSave() { const body = edit ? { ...form, id: edit.id } : form; const res = await fetch("/api/admin/events", { method: edit ? "PUT" : "POST", body: JSON.stringify(body) }); if (res.ok) { setModal(false); setEdit(null); load() } }
  async function handleDelete(id: string) { if (confirm("Delete?")) { await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" }); load() } }
  return (<div>
    <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-[#212121]">Events</h1><button onClick={() => { setEdit(null); setForm({ title: "", type: "live_music", date: "", price: 0, capacity: 50 }); setModal(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#212121] text-white text-sm font-medium hover:bg-black"><Plus className="w-4 h-4" /> Add Event</button></div>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : !items.length ? <p className="text-gray-300 text-sm py-16 text-center">No events</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">Title</th><th className="text-left p-4">Date</th><th className="text-left p-4">Type</th><th className="text-left p-4">Price</th><th className="text-right p-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{items.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50">
          <td className="p-4 font-medium text-[#212121]">{i.title}</td><td className="p-4 text-gray-500">{i.date}</td>
          <td className="p-4 capitalize">{i.type.replace("_", " ")}</td><td className="p-4 font-medium">{i.price ? `IDR ${Number(i.price).toLocaleString()}` : "Free"}</td>
          <td className="p-4 text-right"><button onClick={() => { setEdit(i); setForm({ title: i.title, type: i.type, date: i.date, price: Number(i.price || 0), capacity: i.capacity }); setModal(true) }} className="text-xs text-blue-600 hover:underline mr-3">Edit</button><button onClick={() => handleDelete(i.id)} className="text-xs text-red-600 hover:underline">Delete</button></td>
        </tr>))}</tbody></table>
      )}
    </div>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModal(false)}><div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
      <h2 className="text-lg font-bold text-[#212121] mb-4">{edit ? "Edit" : "Add"} Event</h2>
      <div className="space-y-3 mb-4">
        <div><label className="text-xs text-gray-500 mb-1 block">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#212121]" /></div>
        <div><label className="text-xs text-gray-500 mb-1 block">Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none bg-white"><option value="live_music">Live Music</option><option value="dj_night">DJ Night</option><option value="vip">VIP</option><option value="community">Community</option><option value="seasonal">Seasonal</option></select></div>
        <div><label className="text-xs text-gray-500 mb-1 block">Date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#212121]" /></div>
        <div><label className="text-xs text-gray-500 mb-1 block">Price (0 = free)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#212121]" /></div>
      </div>
      <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-[#212121] text-white font-semibold text-sm hover:bg-black">{edit ? "Update" : "Create"}</button>
    </div></div>}
  </div>)
}
