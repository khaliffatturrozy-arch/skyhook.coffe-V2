"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Briefcase, CheckCircle, XCircle, Clock, Search, Loader2 } from "lucide-react"

interface Application {
  id: string
  full_name: string
  email: string
  phone: string | null
  position: string
  message: string | null
  status: string
  created_at: string
}

export default function AdminCareerPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => { fetchApplications() }, [])

  const fetchApplications = async () => {
    const res = await fetch("/api/career")
    const data = await res.json()
    if (data.applications) setApplications(data.applications)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/career", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a))
  }

  const filtered = applications.filter(a =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) ||
    a.position.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  const statusIcon: Record<string, any> = { pending: Clock, reviewed: CheckCircle, accepted: CheckCircle, rejected: XCircle }
  const statusColor: Record<string, string> = { pending: "text-amber-600 bg-amber-50", reviewed: "text-blue-600 bg-blue-50", accepted: "text-emerald-600 bg-emerald-50", rejected: "text-red-600 bg-red-50" }

  return (
    <div className="min-h-screen">
      <div className="section-padding max-w-5xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#212121]">Career Applications</h1>
            <p className="text-sm text-[rgba(33,33,33,0.5)]">{applications.length} total</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, position, or email..."
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-[#313131]" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-[rgba(33,33,33,0.3)] text-sm">No applications yet</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#212121]">{app.full_name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor[app.status] || statusColor.pending}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[rgba(33,33,33,0.5)]">
                      <span>{app.email}</span>
                      {app.phone && <span>{app.phone}</span>}
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{app.position}</span>
                      <span>{new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                    {app.message && (
                      <p className="text-sm text-[rgba(33,33,33,0.6)] mt-2 bg-gray-50 rounded-lg p-3">{app.message}</p>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {app.status !== "accepted" && (
                      <button onClick={() => updateStatus(app.id, "accepted")}
                        className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Accept">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {app.status !== "rejected" && (
                      <button onClick={() => updateStatus(app.id, "rejected")}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors" title="Reject">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
