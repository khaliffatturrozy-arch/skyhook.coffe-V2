"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Briefcase, MapPin, Clock, Users, CheckCircle, Send, Loader2, Coffee, Music, Star, Heart } from "lucide-react"

const careerImages = [
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/CKa0Micxd5oB0rFCKaWf2Ao8hTnsHTSn6BE5xzT5uIZg.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/CKa0QfazXZpDsVTCKaWHe32DEC7zVYQQaz95FoRgh8iQ.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/hlXSL3WIRwXs8Fhlm2d5C4GNHiei7S9Gs12Nj5eUZ5Q.jpg",
]

const openPositions = [
  { title: "Barista", type: "Full-time", location: "Jakarta Timur", description: "Craft exceptional coffee and provide warm service to every guest. Experience with espresso machines required." },
  { title: "Server / Waitstaff", type: "Full-time", location: "Jakarta Timur", description: "Deliver memorable dining experiences with attentive service. Evening shifts available." },
  { title: "Kitchen Staff", type: "Full-time", location: "Jakarta Timur", description: "Join our kitchen team preparing high-quality dishes. Experience in Indonesian/western cuisine preferred." },
  { title: "Live Sound Engineer", type: "Part-time", location: "Jakarta Timur", description: "Manage live music performances and audio equipment. Technical knowledge of sound systems required." },
]

const perks = [
  { icon: Coffee, title: "Free Coffee & Meals", desc: "Enjoy complimentary drinks and meals during every shift." },
  { icon: Music, title: "Live Music Vibes", desc: "Work in a vibrant atmosphere with live performances nightly." },
  { icon: Star, title: "Career Growth", desc: "Training programs and promotion pathways for dedicated staff." },
  { icon: Heart, title: "Supportive Team", desc: "Join a family-like environment where everyone is valued." },
]

export default function CareerPage() {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", position: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative h-[45vh] md:h-[55vh] overflow-hidden">
        <img src={careerImages[0]} alt="Career at Skyhook" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 section-padding max-w-3xl mx-auto pb-10 md:pb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-10 h-0.5 bg-white mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Join Our Team</h1>
            <p className="text-white/70 text-sm md:text-base max-w-lg">Be part of Jakarta Timur's most exciting rooftop venue.</p>
          </motion.div>
        </div>
      </section>

      {/* Why Work Here */}
      <section className="section-padding max-w-4xl mx-auto py-14 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="w-10 h-0.5 bg-[#313131] mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">Why Work at Skyhook?</h2>
          <p className="text-[rgba(33,33,33,0.6)] text-sm">More than a job — it is an experience</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <p.icon className="w-5 h-5 text-[#313131]" />
              </div>
              <h3 className="font-semibold text-sm text-[#212121] mb-1">{p.title}</h3>
              <p className="text-xs text-[rgba(33,33,33,0.6)]">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Image Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-2 mb-14">
          <img src={careerImages[1]} alt="Team" className="rounded-lg w-full h-40 md:h-56 object-cover" />
          <img src={careerImages[2]} alt="Atmosphere" className="rounded-lg w-full h-40 md:h-56 object-cover" />
        </div>
      </div>

      {/* Open Positions */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="section-padding max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="w-10 h-0.5 bg-[#313131] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">Open Positions</h2>
            <p className="text-[rgba(33,33,33,0.6)] text-sm">Find your role at Skyhook</p>
          </motion.div>
          <div className="space-y-3">
            {openPositions.map((job, i) => (
              <motion.div key={job.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#212121]">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[rgba(33,33,33,0.5)]">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.type}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    </div>
                    <p className="text-sm text-[rgba(33,33,33,0.6)] mt-2">{job.description}</p>
                  </div>
                  <button onClick={() => { setForm({ ...form, position: job.title }); document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" }) }}
                    className="shrink-0 bg-[#313131] hover:bg-black text-white rounded-full px-5 py-2 text-xs font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="section-padding max-w-2xl mx-auto py-14 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <div className="w-10 h-0.5 bg-[#313131] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">Apply Now</h2>
            <p className="text-[rgba(33,33,33,0.6)] text-sm">Send us your application and we will get back to you</p>
          </div>
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white border border-gray-200 rounded-xl p-10 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-[#212121] mb-2">Application Sent!</h3>
              <p className="text-[rgba(33,33,33,0.6)] text-sm mb-6">We will review your application and contact you soon.</p>
              <button onClick={() => { setDone(false); setForm({ full_name: "", email: "", phone: "", position: "", message: "" }) }}
                className="bg-[#313131] hover:bg-black text-white rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
              >
                Submit Another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Full Name *</label>
                  <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    placeholder="Your name" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                </div>
                <div>
                  <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+62 xxx" className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50" />
                </div>
                <div>
                  <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Position *</label>
                  <select required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50"
                  >
                    <option value="">Select position</option>
                    {openPositions.map((j) => (
                      <option key={j.title} value={j.title}>{j.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[rgba(33,33,33,0.5)] text-xs font-medium block mb-1.5">Message / Cover Letter</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about yourself and why you'd like to join..."
                  rows={4} className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#212121] outline-none focus:border-gray-400 bg-gray-50/50 resize-none" />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 p-2.5 rounded-lg">{error}</p>}
              <button type="submit" disabled={submitting}
                className="w-full bg-[#313131] hover:bg-black text-white rounded-full py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Sending..." : "Submit Application"}
              </button>
            </form>
          )}
        </motion.div>
      </section>
    </main>
  )
}
