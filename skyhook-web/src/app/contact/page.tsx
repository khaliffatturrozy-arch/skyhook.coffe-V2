"use client"

import { motion } from "framer-motion"
import { MessageCircle, Mail, MapPin, Camera, Music2, ArrowUpRight } from "lucide-react"

const logoUrl = "https://brdsg.com/img/200/brsl50twbrtoukb1wa_1/C4bLWTcRuGIL0MnC4bOF7EzFvjAcsTEefj119S6Fhg.png"

const contacts = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+62 817-7493-4980",
    href: "https://wa.me/6281774934980?text=Hallo%20admin%20Skyhook%20Coffee",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: Mail,
    label: "Email",
    value: "ciptaabadifuturistik@gmail.com",
    href: "mailto:ciptaabadifuturistik@gmail.com",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Jl. Pusdiklat Depnaker No.23, Pinang Ranti, Jakarta Timur",
    href: "https://www.google.com/maps/place/Skyhook+Coffee+Rooftop+House+and+Kitchen/@-6.2848856,106.8793007,15z",
    color: "from-rose-400 to-rose-600",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    icon: Camera,
    label: "Instagram",
    value: "@skyhookcoffee",
    href: "https://www.instagram.com/skyhookcoffee/",
    color: "from-fuchsia-400 to-pink-600",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-600",
  },
  {
    icon: Music2,
    label: "TikTok",
    value: "@skyhookcoffee.id",
    href: "https://www.tiktok.com/@skyhookcoffee.id",
    color: "from-violet-400 to-violet-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
]

function Blob({ className, color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill={color || "currentColor"} d="M47.5,-58.2C60.1,-49.5,68.3,-33.2,71.6,-16.8C74.9,-0.5,73.2,16,66.1,29.8C59,43.6,46.5,54.7,32.5,63.2C18.5,71.7,3.1,77.6,-12.2,74.6C-27.4,71.7,-42.6,59.9,-53.6,45.4C-64.6,30.9,-71.5,13.7,-71.3,-3.3C-71.1,-20.4,-63.8,-37.4,-51.6,-46.9C-39.4,-56.4,-22.3,-58.4,-4.9,-52.3C12.5,-46.2,34.9,-66.9,47.5,-58.2Z" transform="translate(100 100)" />
    </svg>
  )
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 flex items-center justify-center">
        <Blob className="absolute -top-32 -right-32 w-96 h-96 text-sky-100/60 pointer-events-none" />
        <Blob className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] text-rose-50/50 pointer-events-none" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <img src={logoUrl} alt="" className="w-14 h-14 mx-auto mb-5 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-bold text-[#212121] mb-3 tracking-tight">
              Say hello
            </h1>
            <p className="text-[rgba(33,33,33,0.6)] text-base md:text-lg max-w-md mx-auto font-light leading-relaxed">
              We&apos;d love to hear from you. Drop a message, swing by, or just say hi on social media.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="relative section-padding max-w-4xl mx-auto pb-20">
        <Blob className="absolute -right-32 top-1/3 w-72 h-72 text-amber-100/40 pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[rgba(33,33,33,0.2)] group-hover:text-[rgba(33,33,33,0.5)] transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-[#212121] mb-0.5">{c.label}</h3>
                <p className="text-xs text-[rgba(33,33,33,0.5)] leading-relaxed">{c.value}</p>
              </motion.a>
            )
          })}
        </div>
      </section>

      {/* Casual CTA */}
      <section className="relative bg-[#212121] py-16">
        <Blob className="absolute -top-20 -right-20 w-72 h-72 text-white/[0.03] pointer-events-none" />
        <Blob className="absolute -bottom-20 -left-20 w-80 h-80 text-white/[0.02] pointer-events-none" />
        <div className="relative z-10 section-padding max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Come hang out</h2>
            <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
              Grab a cup, bring a friend, and make yourself at home. We&apos;ll save you a seat.
            </p>
            <a
              href="https://www.google.com/maps/place/Skyhook+Coffee+Rooftop+House+and+Kitchen/@-6.2848856,106.8793007,15z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#212121] hover:bg-gray-100 rounded-full px-6 py-3 text-sm font-semibold transition-all"
            >
              <MapPin className="w-4 h-4" /> Find us on Maps
            </a>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
