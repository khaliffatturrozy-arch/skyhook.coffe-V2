"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

const logoUrl = "https://brdsg.com/img/200/brsl50twbrtoukb1wa_1/C4bLWTcRuGIL0MnC4bOF7EzFvjAcsTEefj119S6Fhg.png"

function WAIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  )
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IGIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function TTIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

const contacts = [
  {
    icon: WAIcon,
    label: "WhatsApp",
    value: "+62 817-7493-4980",
    href: "https://wa.me/6281774934980?text=Hallo%20admin%20Skyhook%20Coffee",
    gradient: "from-emerald-400 to-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blob: "text-emerald-100/50",
  },
  {
    icon: EmailIcon,
    label: "Email",
    value: "ciptaabadifuturistik@gmail.com",
    href: "mailto:ciptaabadifuturistik@gmail.com",
    gradient: "from-blue-400 to-blue-600",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    blob: "text-blue-100/50",
  },
  {
    icon: MapIcon,
    label: "Location",
    value: "Jl. Pusdiklat Depnaker No.23, Jakarta Timur",
    href: "https://www.google.com/maps/place/Skyhook+Coffee+Rooftop+House+and+Kitchen/@-6.2848856,106.8793007,15z",
    gradient: "from-rose-400 to-rose-600",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    blob: "text-rose-100/50",
  },
  {
    icon: IGIcon,
    label: "Instagram",
    value: "@skyhookcoffee",
    href: "https://www.instagram.com/skyhookcoffee/",
    gradient: "from-fuchsia-400 to-pink-600",
    badge: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
    blob: "text-fuchsia-100/50",
  },
  {
    icon: TTIcon,
    label: "TikTok",
    value: "@skyhookcoffee.id",
    href: "https://www.tiktok.com/@skyhookcoffee.id",
    gradient: "from-violet-400 to-violet-600",
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    blob: "text-violet-100/50",
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
      <section className="relative section-padding max-w-5xl mx-auto pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
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
                className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${c.gradient} opacity-[0.06] group-hover:opacity-[0.1] transition-opacity`} />
                <Blob className={`absolute -bottom-12 -left-12 w-32 h-32 ${c.blob} pointer-events-none`} />
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#212121] mb-0.5">{c.label}</h3>
                    <p className="text-[10px] text-[rgba(33,33,33,0.4)] leading-tight line-clamp-2">{c.value}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${c.badge.replace('text-', 'text-').split(' ').slice(0,2).join(' ')}`}>
                    Reach out <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
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
              <MapIcon className="w-4 h-4" /> Find us on Maps
            </a>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
