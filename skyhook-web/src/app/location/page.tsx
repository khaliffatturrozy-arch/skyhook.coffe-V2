"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Coffee, Navigation, ArrowUpRight, Sparkles } from "lucide-react"

const logoUrl = "https://brdsg.com/img/200/brsl50twbrtoukb1wa_1/C4bLWTcRuGIL0MnC4bOF7EzFvjAcsTEefj119S6Fhg.png"
const mapsSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2m1!3m1!2sSkyhook+Coffee+Rooftop+House+and+Kitchen!5e0!3m2!1sen!2sid!4v1"

const address = "Jl. Pusdiklat Depnaker No.23, RW.6, Pinang Ranti, Kec. Makasar, Kota Jakarta Timur 13560"

function Blob({ className, color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill={color || "currentColor"} d="M47.5,-58.2C60.1,-49.5,68.3,-33.2,71.6,-16.8C74.9,-0.5,73.2,16,66.1,29.8C59,43.6,46.5,54.7,32.5,63.2C18.5,71.7,3.1,77.6,-12.2,74.6C-27.4,71.7,-42.6,59.9,-53.6,45.4C-64.6,30.9,-71.5,13.7,-71.3,-3.3C-71.1,-20.4,-63.8,-37.4,-51.6,-46.9C-39.4,-56.4,-22.3,-58.4,-4.9,-52.3C12.5,-46.2,34.9,-66.9,47.5,-58.2Z" transform="translate(100 100)" />
    </svg>
  )
}

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 flex items-center justify-center">
        <Blob className="absolute -top-32 -right-32 w-96 h-96 text-emerald-100/60 pointer-events-none" />
        <Blob className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] text-sky-50/50 pointer-events-none" />
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <img src={logoUrl} alt="" className="w-14 h-14 mx-auto mb-5 opacity-80" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">Our Location</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#212121] mb-3 tracking-tight">
              Find us here
            </h1>
            <p className="text-[rgba(33,33,33,0.6)] text-base md:text-lg max-w-md mx-auto font-light leading-relaxed">
              We&apos;re in the heart of Jakarta Timur — come visit us at Skyhook Coffee.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Cards */}
      <section className="relative section-padding max-w-5xl mx-auto pb-20">
        <Blob className="absolute -right-32 top-1/3 w-72 h-72 text-amber-100/40 pointer-events-none" />

        <div className="grid md:grid-cols-2 gap-6">

          {/* Card 1: Maps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-[0.06] pointer-events-none" />
            <div className="relative z-10 p-5 pb-3">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-sm text-[#212121]">Google Maps</h2>
              </div>
            </div>
            <div className="relative w-full h-[320px] md:h-[400px]">
              <iframe
                src={mapsSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Skyhook Coffee Location"
              />
            </div>
            <div className="p-5 pt-3">
              <a
                href="https://www.google.com/maps/place/Skyhook+Coffee+Rooftop+House+and+Kitchen/@-6.2848856,106.8793007,15z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Open in Google Maps <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Invitation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <Blob className="absolute -bottom-16 -right-16 w-48 h-48 text-emerald-100/40 pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-[0.04] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-5 w-fit">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">Visit Us</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">
                Come on over
              </h2>
              <p className="text-sm text-[rgba(33,33,33,0.5)] mb-6 leading-relaxed">
                Grab a seat, sip something good, and soak in the vibes. Whether you&apos;re catching up with friends,
                getting work done, or just need a moment — we&apos;re ready for you.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#212121]">Address</p>
                    <p className="text-xs text-[rgba(33,33,33,0.5)] leading-relaxed">{address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#212121]">Hours</p>
                    <p className="text-xs text-[rgba(33,33,33,0.5)]">Mon–Sun: 10:00 – 22:00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Coffee className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#212121]">Rooftop</p>
                    <p className="text-xs text-[rgba(33,33,33,0.5)]">Available — reserve your spot</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.google.com/maps/dir//Skyhook+Coffee+Rooftop+House+and+Kitchen/@-6.2848856,106.8793007,15z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#212121] hover:bg-black text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                >
                  <Navigation className="w-4 h-4" /> Get Directions
                </a>
                <a
                  href="/reservasi"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-[#212121] rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                >
                  Reserve a Table
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

    </main>
  )
}
