"use client"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(true)
  useEffect(() => { fetch("/api/admin/analytics").then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false)) }, [])
  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
  return (<div>
    <h1 className="text-2xl font-bold text-[#212121] mb-6">Analytics</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><p className="text-gray-400 text-xs uppercase mb-1">Total Revenue</p><p className="text-2xl font-bold text-[#212121]">IDR {((data?.totalRevenue || 0) / 1000).toFixed(1)}K</p></div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><p className="text-gray-400 text-xs uppercase mb-1">Total Orders</p><p className="text-2xl font-bold text-[#212121]">{data?.totalOrders || 0}</p></div>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"><p className="text-gray-400 text-xs uppercase mb-1">Avg Per Order</p><p className="text-2xl font-bold text-[#212121]">IDR {(data?.avgOrderValue || 0).toLocaleString()}</p></div>
    </div>
  </div>)
}
