"use client"

import { motion } from "framer-motion"
import { Coffee, Heart, Users, Star, ChevronRight } from "lucide-react"

const teamImages = {
  hero: "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/CP2oV8jReeCTfAICP2GfUN1FPxMCLQKWZtofRYqfoMA.jpg",
  section: "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/C41yLrGkeJAEs51C41omHPLjPwp1h7TMKPUYGZNv5CQ.jpg",
  logo: "https://brdsg.com/img/200/brsl50twbrtoukb1wa_1/C4bLWTcRuGIL0MnC4bOF7EzFvjAcsTEefj119S6Fhg.png",
}

const values = [
  { icon: Heart, label: "Passion", desc: "Every brew, every plate, every smile — made with love." },
  { icon: Star, label: "Excellence", desc: "We hold ourselves to the highest standard in hospitality." },
  { icon: Users, label: "Community", desc: "Built on togetherness, serving the neighborhood we call home." },
  { icon: Coffee, label: "Craft", desc: "Masters of our craft, from bean to brew, kitchen to table." },
]

const backOfficeRoles = [
  { title: "Manager", count: 3, color: "from-emerald-400 to-teal-500" },
  { title: "Finance", count: 2, color: "from-violet-400 to-purple-500" },
  { title: "Marketing", count: 2, color: "from-pink-400 to-rose-500" },
  { title: "Admin", count: 2, color: "from-sky-400 to-blue-500" },
]

const operationalRoles = [
  { title: "Barista", count: 6, color: "from-amber-400 to-orange-500" },
  { title: "Chef", count: 4, color: "from-rose-400 to-pink-500" },
  { title: "Server", count: 8, color: "from-blue-400 to-indigo-500" },
  { title: "Bartender", count: 3, color: "from-cyan-400 to-teal-500" },
]

function Blob({ className, color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill={color || "currentColor"} d="M47.5,-58.2C60.1,-49.5,68.3,-33.2,71.6,-16.8C74.9,-0.5,73.2,16,66.1,29.8C59,43.6,46.5,54.7,32.5,63.2C18.5,71.7,3.1,77.6,-12.2,74.6C-27.4,71.7,-42.6,59.9,-53.6,45.4C-64.6,30.9,-71.5,13.7,-71.3,-3.3C-71.1,-20.4,-63.8,-37.4,-51.6,-46.9C-39.4,-56.4,-22.3,-58.4,-4.9,-52.3C12.5,-46.2,34.9,-66.9,47.5,-58.2Z" transform="translate(100 100)" />
    </svg>
  )
}

export default function SkyTeamPage() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={teamImages.hero} alt="" className="w-full h-full object-cover object-bottom" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
        <Blob className="absolute -top-20 -right-20 w-80 h-80 text-white/5" />
        <Blob className="absolute -bottom-20 -left-20 w-96 h-96 text-white/[0.03]" />
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <img src={teamImages.logo} alt="" className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Our Back Office
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-lg mx-auto font-light">
              The people behind the pour.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="relative section-padding max-w-5xl mx-auto py-20">
        <Blob className="absolute -top-40 -right-40 w-[30rem] h-[30rem] text-amber-100/50 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 mb-6">
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">Skyhook Family</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-4">
            More than a team.
            <br />A family.
          </h2>
          <p className="text-[rgba(33,33,33,0.6)] text-sm md:text-base leading-relaxed">
            Behind every cup of coffee and every plate that leaves our kitchen is a group of passionate individuals
            dedicated to creating moments that matter. Together, we bring the Skyhook experience to life.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="relative bg-gray-50/50 py-20">
        <Blob className="absolute -left-40 top-1/2 -translate-y-1/2 w-[25rem] h-[25rem] text-blue-50/60 pointer-events-none" />
        <div className="relative z-10 section-padding max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-[#212121] mb-1.5">{v.label}</h3>
                  <p className="text-xs text-[rgba(33,33,33,0.5)] leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Our Back Office */}
      <section className="relative py-20">
        <Blob className="absolute -left-40 top-1/2 -translate-y-1/2 w-[28rem] h-[28rem] text-emerald-100/40 pointer-events-none" />
        <div className="section-padding max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
                <Users className="w-3 h-3 text-emerald-600" />
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-widest">Back Office</span>
              </div>
              <h2 className="text-3xl font-bold text-[#212121] mb-4">Behind the scenes</h2>
              <p className="text-sm text-[rgba(33,33,33,0.6)] leading-relaxed mb-6">
                The strategists, organizers, and innovators who keep everything running smoothly
                from behind the curtain. Every great team has a strong foundation.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {backOfficeRoles.map((r) => (
                  <div key={r.title} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center`}>
                      <Users className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#212121]">{r.count}</p>
                      <p className="text-[10px] text-[rgba(33,33,33,0.4)] uppercase tracking-wider">{r.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src={teamImages.hero} alt="" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Operational Team */}
      <section className="relative py-20 bg-gray-50/50">
        <Blob className="absolute -right-40 -bottom-20 w-[28rem] h-[28rem] text-amber-100/40 pointer-events-none" />
        <div className="section-padding max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 md:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src={teamImages.section} alt="" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-1 md:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 mb-4">
                <Coffee className="w-3 h-3 text-amber-600" />
                <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-widest">Operational</span>
              </div>
              <h2 className="text-3xl font-bold text-[#212121] mb-4">Our Operational Team</h2>
              <p className="text-sm text-[rgba(33,33,33,0.6)] leading-relaxed mb-6">
                From early morning prep to late-night service, every role matters. Our kitchen, bar, and service
                teams work in harmony to create an experience that feels like home — elevated.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {operationalRoles.map((r) => (
                  <div key={r.title} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center`}>
                      <Users className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#212121]">{r.count}</p>
                      <p className="text-[10px] text-[rgba(33,33,33,0.4)] uppercase tracking-wider">{r.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#212121] py-16">
        <Blob className="absolute -top-20 -left-20 w-72 h-72 text-white/[0.03] pointer-events-none" />
        <Blob className="absolute -bottom-20 -right-20 w-80 h-80 text-white/[0.02] pointer-events-none" />
        <div className="relative z-10 section-padding max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Want to join us?</h2>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
              We&apos;re always looking for passionate people to join the Skyhook family.
            </p>
            <a
              href="/career"
              className="inline-flex items-center gap-2 bg-white text-[#212121] hover:bg-gray-100 rounded-full px-6 py-3 text-sm font-semibold transition-all"
            >
              View Openings <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

    </main>
  )
}
