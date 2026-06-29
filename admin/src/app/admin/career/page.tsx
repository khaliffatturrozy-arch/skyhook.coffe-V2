"use client"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
export default function AdminCareerPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { fetch("/api/admin/career").then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }, [])
  async function updateStatus(id: string, status: string) { await fetch("/api/admin/career", { method: "PATCH", body: JSON.stringify({ id, status }) }); setItems(items.map(i => i.id === id ? { ...i, status } : i)) }
  return (<div>
    <h1 className="text-2xl font-bold text-[#212121] mb-6">Career Applications</h1>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : !items.length ? <p className="text-gray-300 text-sm py-16 text-center">No applications</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">Position</th><th className="text-left p-4">Status</th><th className="text-right p-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{items.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50">
          <td className="p-4 font-medium text-[#212121]">{i.full_name}</td><td className="p-4 text-gray-500">{i.email}</td>
          <td className="p-4 text-gray-500 capitalize">{i.position}</td>
          <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full capitalize ${i.status === "approved" ? "bg-emerald-100 text-emerald-700" : i.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{i.status}</span></td>
          <td className="p-4 text-right"><select value={i.status} onChange={e => updateStatus(i.id, e.target.value)} className="text-xs rounded-lg border border-gray-200 px-2 py-1 outline-none"><option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></td>
        </tr>))}</tbody></table>
      )}
    </div>
  </div>)
}
