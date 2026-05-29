"use client"

import { motion } from "framer-motion"
import { TrendingUp, Shield, Users, Coffee, BarChart3, Globe, ArrowRight, Sparkles } from "lucide-react"

const logoUrl = "https://brdsg.com/img/200/brsl50twbrtoukb1wa_1/C4bLWTcRuGIL0MnC4bOF7EzFvjAcsTEefj119S6Fhg.png"

const highlights = [
  { icon: TrendingUp, label: "Revenue Growth", value: "+47%", desc: "Year-over-year growth in 2025" },
  { icon: Users, label: "Monthly Visitors", value: "12.5K+", desc: "Average monthly foot traffic" },
  { icon: Coffee, label: "Orders Served", value: "85K+", desc: "Total orders since opening" },
  { icon: Globe, label: "Online Reach", value: "250K+", desc: "Social media impressions/month" },
]

const reasons = [
  {
    icon: TrendingUp,
    title: "Strong Traction",
    desc: "Consistent growth in revenue, customer base, and brand recognition since day one.",
  },
  {
    icon: Shield,
    title: "Resilient Model",
    desc: "Diversified revenue streams — dine-in, takeaway, catering, and event hosting.",
  },
  {
    icon: Users,
    title: "Loyal Community",
    desc: "A dedicated customer base with high repeat visit rates and strong brand affinity.",
  },
  {
    icon: BarChart3,
    title: "Scalable Vision",
    desc: "Expansion-ready with systems, team, and brand foundation already in place.",
  },
]

const contactEmail = "ciptaabadifuturistik@gmail.com"

function Blob({ className, color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill={color || "currentColor"} d="M47.5,-58.2C60.1,-49.5,68.3,-33.2,71.6,-16.8C74.9,-0.5,73.2,16,66.1,29.8C59,43.6,46.5,54.7,32.5,63.2C18.5,71.7,3.1,77.6,-12.2,74.6C-27.4,71.7,-42.6,59.9,-53.6,45.4C-64.6,30.9,-71.5,13.7,-71.3,-3.3C-71.1,-20.4,-63.8,-37.4,-51.6,-46.9C-39.4,-56.4,-22.3,-58.4,-4.9,-52.3C12.5,-46.2,34.9,-66.9,47.5,-58.2Z" transform="translate(100 100)" />
    </svg>
  )
}

export default function InvestorPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 flex items-center justify-center">
        <Blob className="absolute -top-32 -right-32 w-96 h-96 text-emerald-100/60 pointer-events-none" />
        <Blob className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] text-blue-50/50 pointer-events-none" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <img src={logoUrl} alt="" className="w-14 h-14 mx-auto mb-5 opacity-80" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">Investor Relations</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#212121] mb-4 tracking-tight">
              Invest in the future of <span className="text-emerald-600">hospitality</span>
            </h1>
            <p className="text-[rgba(33,33,33,0.6)] text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
              Skyhook Coffee is more than a cafe — it&apos;s a growing brand with a proven model, a loyal community,
              and a vision for the future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative section-padding max-w-5xl mx-auto pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {highlights.map((h, i) => {
            const Icon = h.icon
            return (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl p-5 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-[#212121]">{h.value}</p>
                <p className="text-xs font-medium text-[rgba(33,33,33,0.5)] mt-0.5">{h.label}</p>
                <p className="text-[10px] text-[rgba(33,33,33,0.35)] mt-1">{h.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Why Invest */}
      <section className="relative bg-gray-50/50 py-20">
        <Blob className="absolute -right-40 top-1/3 w-[26rem] h-[26rem] text-amber-100/40 pointer-events-none" />
        <div className="relative z-10 section-padding max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-3">Why invest in Skyhook?</h2>
            <p className="text-sm text-[rgba(33,33,33,0.5)] max-w-lg mx-auto">
              We&apos;ve built more than a coffee shop — we&apos;ve built a destination.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reasons.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#212121] mb-1">{r.title}</h3>
                      <p className="text-xs text-[rgba(33,33,33,0.5)] leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <Blob className="absolute -left-40 -top-20 w-80 h-80 text-emerald-100/40 pointer-events-none" />
        <Blob className="absolute -right-40 -bottom-20 w-80 h-80 text-blue-50/50 pointer-events-none" />
        <div className="relative z-10 section-padding max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">Get in Touch</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-3">Let&apos;s talk</h2>
            <p className="text-sm text-[rgba(33,33,33,0.5)] mb-8 max-w-md mx-auto">
              Interested in partnership or investment opportunities? Reach out to us directly.
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 bg-[#212121] hover:bg-black text-white rounded-full px-6 py-3 text-sm font-semibold transition-all"
            >
              Email Us <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-xs text-[rgba(33,33,33,0.35)] mt-4">{contactEmail}</p>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
