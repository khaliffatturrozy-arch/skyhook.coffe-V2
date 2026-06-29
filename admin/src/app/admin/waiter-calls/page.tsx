"use client"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
export default function AdminWaiterCallsPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  async function load() { setLoading(true); const res = await fetch("/api/admin/waiter-calls"); setItems(Array.isArray(await res.json()) ? await res.json() : []); setLoading(false) }
  useEffect(() => { load() }, [])
  async function resolve(id: string) { await fetch("/api/admin/waiter-calls", { method: "PATCH", body: JSON.stringify({ id, status: "resolved" }) }); load() }
  return (<div>
    <h1 className="text-2xl font-bold text-[#212121] mb-6">Waiter Calls</h1>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : !items.length ? <p className="text-gray-300 text-sm py-16 text-center">No waiter calls</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">Table</th><th className="text-left p-4">Notes</th><th className="text-left p-4">Status</th><th className="text-right p-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{items.filter((i: any) => i.status === "pending").map((i: any) => (<tr key={i.id} className="hover:bg-gray-50">
          <td className="p-4 font-medium text-[#212121]">{i.table_number || "—"}</td><td className="p-4 text-gray-500 text-xs">{i.notes || "—"}</td>
          <td className="p-4"><span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">{i.status}</span></td>
          <td className="p-4 text-right"><button onClick={() => resolve(i.id)} className="text-xs px-3 py-1 rounded-lg bg-[#212121] text-white hover:bg-black">Resolve</button></td>
        </tr>))}</tbody></table>
      )}
    </div>
  </div>)
}
