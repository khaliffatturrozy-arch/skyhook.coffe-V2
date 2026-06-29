"use client"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
export default function AdminPaymentsPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true)
  useEffect(() => { fetch("/api/admin/payments").then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false)) }, [])
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  return (<div>
    <h1 className="text-2xl font-bold text-[#212121] mb-6">Payments</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><p className="text-gray-400 text-xs uppercase mb-1">Total Volume</p><p className="text-2xl font-bold text-[#212121]">IDR {((data?.transactions || []).reduce((s: number, t: any) => s + Number(t.total), 0) / 1000).toFixed(1)}K</p></div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><p className="text-gray-400 text-xs uppercase mb-1">Transactions</p><p className="text-2xl font-bold text-[#212121]">{(data?.transactions || []).length}</p></div>
    </div>
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100"><h2 className="font-semibold text-[#212121] text-sm">Recent Transactions</h2></div>
      {!data?.transactions?.length ? <p className="text-gray-300 text-sm py-8 text-center">No transactions</p> : (
        <table className="w-full text-sm"><thead><tr className="border-b border-gray-100 text-gray-400 text-xs uppercase"><th className="text-left p-4">Customer</th><th className="text-left p-4">Amount</th><th className="text-left p-4">Status</th><th className="text-left p-4">Method</th><th className="text-right p-4">Date</th></tr></thead>
        <tbody className="divide-y divide-gray-50">{data.transactions.map((t: any) => (<tr key={t.id} className="hover:bg-gray-50">
          <td className="p-4 font-medium text-[#212121]">{t.user?.full_name || "—"}</td><td className="p-4 font-medium">IDR {Number(t.total).toLocaleString()}</td>
          <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${t.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{t.payment_status}</span></td>
          <td className="p-4 text-gray-500 capitalize">{t.payment_method || "—"}</td>
          <td className="p-4 text-right text-gray-400 text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
        </tr>))}</tbody></table>
      )}
    </div>
  </div>)
}
