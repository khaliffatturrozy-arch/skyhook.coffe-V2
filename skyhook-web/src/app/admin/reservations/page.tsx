"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AdminSectionHeader } from "@/components/admin/admin-glass-card"
import { AdminStatsCard, AdminiOSWidget } from "@/components/admin/admin-stats-card"
import { createClient } from "@/lib/supabase"
import {
  Calendar, Users, Clock, CheckCircle, XCircle,
  Search, Plus, ChevronLeft, ChevronRight, Coffee,
  Sun, Moon, Star, Loader2, AlertCircle,
  Phone, Mail, MessageSquare, User, Edit3, Trash2,
} from "lucide-react"

interface TableData {
  id: string; table_number: string; capacity: number; status: string; section: string; is_vip: boolean
}

interface Reservation {
  id: string; user_id: string; table_id: string; date: string; time: string
  guests: number; status: string; notes?: string; created_at: string
  full_name?: string; phone?: string; table_number?: string; section?: string
}

const STATUS_OPTIONS = ["pending", "confirmed", "seated", "completed", "cancelled"]
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  seated: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-white/5 text-white/40 border-white/10",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0]
}

export default function ReservationsPage() {
  const [loading, setLoading] = useState(true)
  const [tables, setTables] = useState<TableData[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()))
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function load() {
      const [tablesRes, reservationsRes] = await Promise.all([
        supabase.from("tables").select("*").order("table_number"),
        supabase.from("reservations").select("*, users(full_name, phone)").order("date").order("time"),
      ])
      if (tablesRes.data) setTables(tablesRes.data as TableData[])
      if (reservationsRes.data) {
        setReservations((reservationsRes.data as any[]).map((r) => ({
          ...r,
          full_name: r.users?.full_name,
          phone: r.users?.phone,
        })))
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  const dayReservations = reservations.filter((r) => r.date === selectedDate)
  const sections = useMemo(() => {
    const s = new Map<string, TableData[]>()
    tables.forEach((t) => {
      if (!s.has(t.section)) s.set(t.section, [])
      s.get(t.section)!.push(t)
    })
    return Array.from(s.entries())
  }, [tables])

  const getTableStatus = (tableId: string) => {
    const res = dayReservations.find((r) => r.table_id === tableId && r.status !== "cancelled" && r.status !== "completed")
    return res || null
  }

  const stats = useMemo(() => {
    const d = dayReservations
    return {
      total: d.length,
      pending: d.filter((r) => r.status === "pending").length,
      confirmed: d.filter((r) => r.status === "confirmed").length,
      seated: d.filter((r) => r.status === "seated").length,
      completed: d.filter((r) => r.status === "completed").length,
      cancelled: d.filter((r) => r.status === "cancelled").length,
      guests: d.reduce((sum, r) => sum + (r.status !== "cancelled" ? r.guests : 0), 0),
    }
  }, [dayReservations])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Loading reservations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Reservations"
        description={`${formatDate(new Date())} — Manage table bookings`}
        action={
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25">
            <Plus className="w-4 h-4" /> New Reservation
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <AdminStatsCard title="Today Total" value={String(stats.total)} color="amber" delay={0} icon={<Calendar className="w-5 h-5" />} />
        <AdminStatsCard title="Pending" value={String(stats.pending)} color="amber" delay={1} icon={<Clock className="w-5 h-5" />} />
        <AdminStatsCard title="Confirmed" value={String(stats.confirmed)} color="emerald" delay={2} icon={<CheckCircle className="w-5 h-5" />} />
        <AdminStatsCard title="Seated" value={String(stats.seated)} color="blue" delay={3} icon={<Users className="w-5 h-5" />} />
        <AdminStatsCard title="Completed" value={String(stats.completed)} color="cyan" delay={4} icon={<CheckCircle className="w-5 h-5" />} />
        <AdminStatsCard title="Cancelled" value={String(stats.cancelled)} color="rose" delay={5} icon={<XCircle className="w-5 h-5" />} />
        <AdminStatsCard title="Total Guests" value={String(stats.guests)} color="violet" delay={6} icon={<Users className="w-5 h-5" />} />
      </div>

      {/* Date Picker + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-white/5 rounded-2xl border border-white/10 p-1">
          <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(formatDate(d)) }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="relative">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm text-white font-medium px-3 py-1.5 outline-none cursor-pointer [color-scheme:dark]" />
          </div>
          <button onClick={() => setSelectedDate(formatDate(new Date()))}
            className="px-2.5 py-1.5 text-[11px] font-medium text-white/40 hover:text-white transition-colors">Today</button>
          <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(formatDate(d)) }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1 bg-white/5 rounded-2xl border border-white/10 p-1">
          {["all", "pending", "confirmed", "seated", "completed", "cancelled"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-all capitalize ${
                statusFilter === s ? "bg-amber-500/20 text-amber-400" : "text-white/30 hover:text-white/60"
              }`}>{s}</button>
          ))}
        </div>

        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" placeholder="Search customer..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-amber-500/40 w-48" />
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex gap-2">
        {["all", "Rooftop Main", "Garden Terrace", "VIP Lounge"].map((s) => (
          <button key={s} onClick={() => setSectionFilter(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all ${
              sectionFilter === s ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-white/5 text-white/30 border border-transparent hover:text-white/60"
            }`}>
            {s === "all" ? <Coffee className="w-3 h-3" /> : s === "Rooftop Main" ? <Sun className="w-3 h-3" /> : s === "Garden Terrace" ? <Star className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            {s === "all" ? "All Areas" : s}
          </button>
        ))}
      </div>

      {/* Table Layout + Reservations List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Table Layout */}
        <div className="lg:col-span-2 space-y-4">
          {sections
            .filter(([name]) => sectionFilter === "all" || sectionFilter === name)
            .map(([sectionName, sectionTables]) => (
            <AdminiOSWidget key={sectionName} delay={0}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    sectionName === "Rooftop Main" ? "bg-amber-500/10 text-amber-400" :
                    sectionName === "Garden Terrace" ? "bg-emerald-500/10 text-emerald-400" :
                    "bg-violet-500/10 text-violet-400"
                  }`}>
                    {sectionName === "Rooftop Main" ? <Sun className="w-4 h-4" /> :
                     sectionName === "Garden Terrace" ? <Star className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{sectionName}</h3>
                    <p className="text-[10px] text-white/30">{sectionTables.length} tables</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
                {sectionTables.map((table) => {
                  const activeRes = getTableStatus(table.id)
                  const isOccupied = !!activeRes
                  return (
                    <div key={table.id}
                      className={`relative p-2.5 rounded-2xl border transition-all ${
                        isOccupied
                          ? activeRes!.status === "seated"
                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            : activeRes!.status === "confirmed"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                          : "bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20 hover:bg-white/[0.06]"
                      }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{table.table_number}</span>
                        <span className="text-[9px] opacity-60">{table.capacity}pax</span>
                      </div>
                      {isOccupied ? (
                        <div className="text-[9px] font-medium truncate">
                          {activeRes!.full_name || "Guest"}
                        </div>
                      ) : (
                        <div className="text-[9px] text-white/20">Available</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </AdminiOSWidget>
          ))}
        </div>

        {/* Reservations List */}
        <div className="space-y-3">
          <AdminiOSWidget delay={0}>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              Reservations for {selectedDate}
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {dayReservations
                .filter((r) => statusFilter === "all" || r.status === statusFilter)
                .filter((r) => !search || r.full_name?.toLowerCase().includes(search.toLowerCase()))
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((res) => (
                <div key={res.id} className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] transition-all">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{res.full_name || "Guest"}</p>
                        <p className="text-[10px] text-white/30">{res.guests} guests · Table {res.table_number || "TBA"}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[res.status] || "bg-white/5 text-white/40"}`}>
                      {res.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/30">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{res.time}</span>
                    {res.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{res.phone}</span>}
                  </div>
                  {res.notes && <p className="text-[10px] text-white/20 mt-1 italic">"{res.notes}"</p>}
                </div>
              ))}
              {dayReservations.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  <p className="text-sm text-white/20">No reservations for this date</p>
                </div>
              )}
            </div>
          </AdminiOSWidget>
        </div>
      </div>
    </div>
  )
}
