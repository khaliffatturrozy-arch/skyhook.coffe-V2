"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, MapPin, CheckCircle, Loader2 } from "lucide-react"

export default function ReservationsPage() {
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
  const [checking, setChecking] = useState(false)
  const [booking, setBooking] = useState(false)
  const [done, setDone] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState("")

  const checkAvailability = async () => {
    setChecking(true)
    setError("")
    setSearched(true)
    setSelectedTable(null)
    try {
      const res = await fetch(`/api/reservations?date=${date}&time=${time}&guests=${guests}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTables(data.tables || [])
    } catch (e) {
      setError((e as Error).message)
      setTables([])
    } finally {
      setChecking(false)
    }
  }

  const bookTable = async () => {
    if (!selectedTable) return
    setBooking(true)
    setError("")
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date, time, guests,
          table_id: selectedTable,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBooking(false)
    }
  }

  if (done) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <GlassCard className="p-8 text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="font-heading text-xl font-bold mb-2">Reservation Confirmed!</h1>
            <p className="text-white/40 text-sm mb-1">{date} at {time}</p>
            <p className="text-white/40 text-sm">{guests} guests</p>
            <Button variant="primary" className="mt-6" onClick={() => { setDone(false); setSearched(false); setTables([]) }}>
              New Reservation
            </Button>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 bg-gradient-to-b from-skyhook-black via-skyhook-charcoal/30 to-skyhook-black" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              Book a <span className="text-gradient-gold">Table</span>
            </h1>
            <p className="text-white/40 text-lg">Reserve your rooftop experience in advance.</p>
          </div>

          <GlassCard className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-white/40 text-xs block mb-2">Date</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Calendar className="w-4 h-4 text-skyhook-amber" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-white text-sm outline-none flex-1 [color-scheme:dark]" />
                </div>
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-2">Time</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Clock className="w-4 h-4 text-skyhook-amber" />
                  <select value={time} onChange={(e) => setTime(e.target.value)} className="bg-transparent text-white text-sm outline-none flex-1">
                    {["17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00"].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-white/40 text-xs block mb-2">Guests</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <Users className="w-4 h-4 text-skyhook-amber" />
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="bg-transparent text-white text-sm outline-none flex-1">
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mb-3 bg-red-500/10 p-2 rounded-lg">{error}</p>}
            <Button variant="primary" size="lg" className="w-full" onClick={checkAvailability} disabled={checking}>
              {checking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {checking ? "Checking..." : "Check Availability"}
            </Button>
          </GlassCard>

          {searched && (
            <>
              <h2 className="font-heading text-2xl font-bold mb-6">
                {tables.length > 0 ? `${tables.length} table(s) available` : "No tables available"}
              </h2>

              {tables.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {tables.map((t: any) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTable(t.id)}
                      className={`glass rounded-xl p-4 text-left transition-all ${
                        selectedTable === t.id
                          ? "border-skyhook-amber/50 bg-skyhook-amber/5"
                          : "hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-bold text-lg">{t.table_number}</span>
                        <span className="text-white/30 text-xs">{t.section || "Main"}</span>
                      </div>
                      <p className="text-white/40 text-xs">{t.capacity} seats{t.is_vip ? " • VIP" : ""}</p>
                    </button>
                  ))}
                </div>
              )}

              <GlassCard>
                <h3 className="font-heading text-lg font-semibold mb-4">Your Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-white/40 text-xs block mb-2">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-skyhook-amber/50" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-2">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-skyhook-amber/50" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-2">Phone</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62 xxx" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-skyhook-amber/50" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-2">Notes</label>
                    <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-skyhook-amber/50" />
                  </div>
                </div>
                <Button variant="primary" size="lg" className="w-full" onClick={bookTable} disabled={!selectedTable || booking}>
                  {booking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
                  {booking ? "Booking..." : "Confirm Reservation"}
                </Button>
              </GlassCard>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
