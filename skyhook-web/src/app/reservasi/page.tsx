"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, CheckCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"

export default function ReservasiPage() {
  const today = new Date().toISOString().split("T")[0]
  const [date, setDate] = useState(today)
  const [time, setTime] = useState("18:00")
  const [guests, setGuests] = useState(2)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [tables, setTables] = useState<any[]>([])
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [step, setStep] = useState<"form" | "tables" | "details" | "done">("form")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const checkAvailability = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/reservations?date=${date}&time=${time}&guests=${guests}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTables(data.tables || [])
      setStep("tables")
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const bookTable = async () => {
    if (!selectedTable) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time, guests, table_id: selectedTable, name: name.trim() || undefined, email: email.trim() || undefined, phone: phone.trim() || undefined, notes: notes.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep("done")
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (step === "done") {
    return (
      <main className="min-h-screen bg-white pt-20 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#212121] mb-2">Reservation Confirmed!</h1>
          <p className="text-[rgba(33,33,33,0.6)] text-sm mb-1">{date} at {time}</p>
          <p className="text-[rgba(33,33,33,0.6)] text-sm mb-6">{guests} {guests === 1 ? "guest" : "guests"}</p>
          <Button variant="primary" onClick={() => { setStep("form"); setTables([]); setSelectedTable(null) }} className="bg-[#313131] hover:bg-black text-white rounded-full px-6">
            New Reservation
          </Button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="max-w-2xl mx-auto section-padding py-8 md:py-12">
        <div className="text-center mb-10">
          <div className="w-10 h-0.5 bg-[#313131] mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#212121] mb-2">Reservation</h1>
          <p className="text-[rgba(33,33,33,0.6)] text-sm">Book a table at Skyhook Coffee Rooftop House and Kitchen</p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Date, Time, Guests */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Date</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50">
                  <Calendar className="w-4 h-4 text-[rgba(33,33,33,0.4)] shrink-0" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-sm text-[#212121] outline-none flex-1" />
                </div>
              </div>
              <div>
                <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Time</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50">
                  <Clock className="w-4 h-4 text-[rgba(33,33,33,0.4)] shrink-0" />
                  <select value={time} onChange={(e) => setTime(e.target.value)} className="bg-transparent text-sm text-[#212121] outline-none flex-1">
                    {["17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00"].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Guests</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-gray-50/50">
                  <Users className="w-4 h-4 text-[rgba(33,33,33,0.4)] shrink-0" />
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="bg-transparent text-sm text-[#212121] outline-none flex-1">
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-3 bg-red-50 p-2.5 rounded-lg">{error}</p>}
            <Button variant="primary" className="w-full mt-4 bg-[#313131] hover:bg-black text-white rounded-full" onClick={checkAvailability} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Checking..." : "Check Availability"}
            </Button>
          </div>

          {/* Step 2: Available Tables */}
          {step === "tables" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <p className="text-sm font-medium text-[rgba(33,33,33,0.6)]">
                {tables.length > 0 ? `${tables.length} table(s) available` : "No tables available"}
              </p>
              {tables.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {tables.map((t: any) => (
                    <button key={t.id} onClick={() => setSelectedTable(t.id)}
                      className={`border rounded-xl p-4 text-left transition-all ${
                        selectedTable === t.id
                          ? "border-[#313131] bg-gray-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <p className="font-semibold text-[#212121] text-sm">Table {t.table_number}</p>
                      <p className="text-xs text-[rgba(33,33,33,0.5)] mt-1">{t.capacity} seats{t.is_vip ? " • VIP" : ""}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Your Details */}
              {tables.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-[#212121] text-sm mb-4">Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1">Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                    </div>
                    <div>
                      <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1">Email</label>
                      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="your@email.com" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                    </div>
                    <div>
                      <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1">Phone</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62 xxx" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                    </div>
                    <div>
                      <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1">Notes</label>
                      <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Special requests" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                    </div>
                  </div>
                  <Button variant="primary" className="w-full bg-[#313131] hover:bg-black text-white rounded-full" onClick={bookTable} disabled={!selectedTable || loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
                    {loading ? "Booking..." : "Confirm Reservation"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
}
