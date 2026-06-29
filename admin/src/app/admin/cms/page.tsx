"use client"
import { useState, useEffect } from "react"
import { Loader2, Plus } from "lucide-react"
export default function AdminCMSPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false); const [edit, setEdit] = useState<any>(null)
  const [form, setForm] = useState({ section_key: "", title: "", content: "" })
  async function load() { setLoading(true); const res = await fetch("/api/admin/cms"); setItems(Array.isArray(await res.json()) ? await res.json() : []); setLoading(false) }
  useEffect(() => { load() }, [])
  async function handleSave() { const body = edit ? { ...form, id: edit.id } : form; const method = edit ? "PUT" : "POST"; const res = await fetch("/api/admin/cms", { method, body: JSON.stringify(body) }); if (res.ok) { setModal(false); setEdit(null); load() } }
  return (<div>
    <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-[#212121]">CMS</h1><button onClick={() => { setEdit(null); setForm({ section_key: "", title: "", content: "" }); setModal(true) }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#212121] text-white text-sm font-medium hover:bg-black"><Plus className="w-4 h-4" /> Add Section</button></div>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : !items.length ? <p className="text-gray-300 text-sm py-16 text-center">No sections</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">Key</th><th className="text-left p-4">Title</th><th className="text-left p-4">Content</th><th className="text-right p-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{items.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50">
          <td className="p-4 font-mono text-xs text-[#212121]">{i.section_key}</td><td className="p-4 font-medium text-[#212121]">{i.title}</td>
          <td className="p-4 text-gray-500 text-xs max-w-xs truncate">{i.content?.slice(0, 80)}</td>
          <td className="p-4 text-right"><button onClick={() => { setEdit(i); setForm({ section_key: i.section_key, title: i.title, content: i.content || "" }); setModal(true) }} className="text-xs text-blue-600 hover:underline">Edit</button></td>
        </tr>))}</tbody></table>
      )}
    </div>
    {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setModal(false)}><div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
      <h2 className="text-lg font-bold text-[#212121] mb-4">{edit ? "Edit" : "Add"} Section</h2>
      <div className="space-y-3 mb-4">
        <div><label className="text-xs text-gray-500 mb-1 block">Section Key</label><input value={form.section_key} onChange={e => setForm({ ...form, section_key: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none" /></div>
        <div><label className="text-xs text-gray-500 mb-1 block">Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none" /></div>
        <div><label className="text-xs text-gray-500 mb-1 block">Content</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none resize-none" /></div>
      </div>
      <button onClick={handleSave} className="w-full py-2.5 rounded-xl bg-[#212121] text-white font-semibold text-sm hover:bg-black">{edit ? "Update" : "Create"}</button>
    </div></div>}
  </div>)
}
