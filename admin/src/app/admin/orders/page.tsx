"use client"
import { useState, useEffect } from "react"
import { Loader2, Search } from "lucide-react"
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState("")
  useEffect(() => { fetch(`/api/admin/orders${search ? `?search=${search}` : ""}`).then(r => r.json()).then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }, [search])
  async function updateStatus(id: string, status: string) { await fetch("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ id, status }) }); setOrders(orders.map(o => o.id === id ? { ...o, status } : o)) }
  return (<div>
    <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-[#212121]">Orders</h1>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#212121] w-64" /></div></div>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : !orders.length ? <p className="text-gray-300 text-sm py-16 text-center">No orders</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">ID</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Total</th><th className="text-left p-4">Status</th><th className="text-left p-4">Payment</th><th className="text-right p-4">Actions</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{orders.map((o: any) => (<tr key={o.id} className="hover:bg-gray-50">
          <td className="p-4 font-medium text-[#212121]">#{o.id?.slice(0, 8)}</td>
          <td className="p-4 text-gray-500">{o.user?.full_name || o.user_id?.slice(0, 8) || "—"}</td>
          <td className="p-4 font-medium">IDR {Number(o.total).toLocaleString()}</td>
          <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full capitalize ${o.status === "completed" ? "bg-emerald-100 text-emerald-700" : o.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{o.status}</span></td>
          <td className="p-4"><span className={`text-xs ${o.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"}`}>{o.payment_status}</span></td>
          <td className="p-4 text-right"><select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="text-xs rounded-lg border border-gray-200 px-2 py-1 outline-none"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="preparing">Preparing</option><option value="ready">Ready</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td>
        </tr>))}</tbody></table>
      )}
    </div>
  </div>)
}
