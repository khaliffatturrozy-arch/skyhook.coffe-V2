"use client"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
export default function AdminCustomersPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { fetch("/api/admin/customers").then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false)) }, [])
  return (<div>
    <h1 className="text-2xl font-bold text-[#212121] mb-6">Customers</h1>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div> : !items.length ? <p className="text-gray-300 text-sm py-16 text-center">No customers</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">Tier</th><th className="text-left p-4">Points</th><th className="text-left p-4">Spent</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{items.map((i: any) => (<tr key={i.id} className="hover:bg-gray-50">
          <td className="p-4 font-medium text-[#212121]">{i.full_name || "—"}</td><td className="p-4 text-gray-500">{i.email}</td>
          <td className="p-4 capitalize">{i.membership_tier}</td><td className="p-4">{i.loyalty_points || 0}</td>
          <td className="p-4 font-medium">IDR {Number(i.total_spent || 0).toLocaleString()}</td>
        </tr>))}</tbody></table>
      )}
    </div>
  </div>)
}
