"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Sun, Building2, Gift, Users, Music, Coffee, Wifi, MapPin, Star, Sparkles, PackageOpen } from "lucide-react"

const fadeUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } }

function GlassCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group perspective-[1000px]"
    >
      <div className="transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/20">
        <div className={`relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-br opacity-60" />
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </motion.div>
  )
}

function GlassIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
      {children}
    </div>
  )
}

function PackageCard({ title, price, capacity, includes, gradient, icon, delay = 0 }: {
  title: string; price?: string; capacity: string; includes: string[]; gradient: string; icon: React.ReactNode; delay?: number
}) {
  return (
    <GlassCard delay={delay}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60`} />
      <div className="relative z-10 p-6 md:p-8 text-white">
        <Blob className="absolute -top-20 -right-20 w-48 h-48 text-white/10" />
        <Blob className="absolute -bottom-20 -left-20 w-40 h-40 text-white/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <h3 className="text-lg font-bold drop-shadow-sm">{title}</h3>
          </div>
          {price && (
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-sm font-semibold mb-4 shadow-lg">
              {price}
            </div>
          )}
          <div className="text-xs text-white/80 mb-1">Kapasitas: {capacity}</div>
          <ul className="space-y-1.5 mt-3">
            {includes.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                <Star className="w-3 h-3 fill-white/60 text-white/60 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  )
}

function Blob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M44.2,-70.6C57.6,-64.7,68.8,-52.6,76.3,-38.7C83.8,-24.8,87.6,-9,86.7,6.5C85.7,22,80,37.2,70.1,49.6C60.2,62,46.1,71.6,30.7,77.5C15.3,83.4,-1.4,85.6,-17.4,81.8C-33.4,78,-48.7,68.2,-60.5,55.3C-72.3,42.4,-80.5,26.4,-83.2,9.5C-85.9,-7.5,-83,-25.4,-73.7,-39.4C-64.5,-53.4,-48.8,-63.5,-33.4,-69.2C-18.1,-74.9,-3.1,-76.2,11.4,-73.2C25.9,-70.2,30.8,-76.5,44.2,-70.6Z" transform="translate(100 100)" />
    </svg>
  )
}

export default function VenueInfoPage() {
  return (
    <main className="min-h-screen pt-20 pb-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#212121] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
        <Blob className="absolute -top-40 -right-40 w-96 h-96 text-amber-500/10" />
        <Blob className="absolute -bottom-40 -left-40 w-80 h-80 text-rose-500/10" />
        <div className="relative z-10 section-padding max-w-5xl mx-auto py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Venue &amp; Info</h1>
                <p className="text-white/50 text-sm mt-1">Skyhook Coffee Rooftop House &amp; Kitchen</p>
              </div>
            </div>
            <p className="text-white/60 max-w-2xl mt-4 leading-relaxed">
              Rooftop cafe dan event venue di Jakarta Timur dengan konsep tropical rooftop,
              city view, sunset view, live music, dan area yang cocok untuk berbagai acara.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Venue Spaces */}
      <section className="section-padding max-w-5xl mx-auto py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-[#212121] mb-10 flex items-center gap-3">
          <Building2 className="w-6 h-6" /> Venue Spaces
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 opacity-60" />
            <div className="relative z-10 p-6 md:p-8 text-white">
              <Blob className="absolute -top-16 -right-16 w-48 h-48 text-white/10" />
              <Blob className="absolute -bottom-16 -left-16 w-36 h-36 text-white/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <GlassIcon><Sun className="w-5 h-5" /></GlassIcon>
                  <h3 className="text-xl font-bold drop-shadow-sm">Outdoor Rooftop</h3>
                </div>
                <p className="text-white/80 text-sm mb-4">Area rooftop utama dengan konsep outdoor dan pemandangan kota.</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Kapasitas", value: "150 orang" },
                    { label: "Meja", value: "31 meja" },
                    { label: "Panggung", value: "2 stage" },
                    { label: "View", value: "City + LRT" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-lg">
                      <div className="text-[10px] text-white/70 uppercase">{s.label}</div>
                      <div className="text-sm font-semibold mt-0.5">{s.value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs text-white/70 uppercase mb-2">Cocok Untuk</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Birthday", "Gathering", "Live Music", "Community", "Corporate", "Wedding After Party"].map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-medium shadow-lg">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={0.1}>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 opacity-60" />
            <div className="relative z-10 p-6 md:p-8 text-white">
              <Blob className="absolute -top-16 -right-16 w-48 h-48 text-white/10" />
              <Blob className="absolute -bottom-16 -left-16 w-36 h-36 text-white/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <GlassIcon><Building2 className="w-5 h-5" /></GlassIcon>
                  <h3 className="text-xl font-bold drop-shadow-sm">Indoor Room</h3>
                </div>
                <p className="text-white/80 text-sm mb-4">Area indoor nyaman untuk acara yang lebih privat.</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Kapasitas", value: "30 orang" },
                    { label: "Meja", value: "8 meja" },
                    { label: "Smart TV", value: '42"' },
                    { label: "Speaker", value: "Tersedia" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-lg">
                      <div className="text-[10px] text-white/70 uppercase">{s.label}</div>
                      <div className="text-sm font-semibold mt-0.5">{s.value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-xs text-white/70 uppercase mb-2">Cocok Untuk</div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Meeting", "Workshop", "Seminar", "Private Gathering", "Business Discussion"].map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-medium shadow-lg">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding max-w-5xl mx-auto py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-[#212121] mb-10 flex items-center gap-3">
          <Coffee className="w-6 h-6" /> Fasilitas
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Sun className="w-5 h-5" />, label: "Sunset View", gradient: "from-amber-400 to-orange-500" },
            { icon: <Music className="w-5 h-5" />, label: "Live Music", gradient: "from-rose-400 to-pink-500" },
            { icon: <Wifi className="w-5 h-5" />, label: "Free WiFi", gradient: "from-blue-400 to-cyan-500" },
            { icon: <MapPin className="w-5 h-5" />, label: "Area Parkir", gradient: "from-emerald-400 to-teal-500" },
            { icon: <Building2 className="w-5 h-5" />, label: "Mushola", gradient: "from-teal-400 to-emerald-500" },
            { icon: <Coffee className="w-5 h-5" />, label: "Coffee Break", gradient: "from-amber-600 to-amber-800" },
            { icon: <Star className="w-5 h-5" />, label: "Photobox", gradient: "from-purple-400 to-violet-500" },
            { icon: <PackageOpen className="w-5 h-5" />, label: "QR Menu", gradient: "from-gray-500 to-gray-700" },
          ].map((f, i) => (
            <GlassCard key={f.label} delay={i * 0.05}>
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-60`} />
              <div className="relative z-10 p-5 text-white text-center">
                <div className="w-12 h-12 mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <div className="text-sm font-semibold drop-shadow-sm">{f.label}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Birthday Packages */}
      <section className="section-padding max-w-5xl mx-auto py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-[#212121] mb-10 flex items-center gap-3">
          <Gift className="w-6 h-6" /> Birthday Package
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-5">
          <PackageCard title="Small Package" price="Rp 1.700.000" capacity="15 Pax" gradient="from-pink-500 via-rose-500 to-red-500" icon={<Gift className="w-5 h-5" />}
            includes={["1 Birthday Cake", "15 Pasta Aglio e Olio / Nasi Goreng Hongkong", "15 Flavour Tea", "15 Ice Cream", "5 Potato & Sausage", "Dekorasi Balon"]} />
          <PackageCard title="Medium Package" price="Rp 3.500.000" capacity="25 Pax" gradient="from-rose-500 via-red-500 to-orange-500" icon={<Gift className="w-5 h-5" />}
            includes={["1 Birthday Cake", "25 Pasta Carbonara / Nasi Goreng Hongkong", "25 Chicken Wings & Potato", "25 Flavour Tea", "25 Ice Cream", "Dekorasi Balon"]} />
          <PackageCard title="Big Package" price="Custom" capacity="Custom" gradient="from-purple-500 via-violet-500 to-indigo-500" icon={<Sparkles className="w-5 h-5" />}
            includes={["Live Music", "Buffet Menu", "Custom Menu", "Dekorasi Balon", "Pengaturan acara sesuai permintaan"]} />
        </div>
      </section>

      {/* Meeting Package */}
      <section className="section-padding max-w-5xl mx-auto py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-[#212121] mb-10 flex items-center gap-3">
          <Users className="w-6 h-6" /> Meeting Package
        </motion.h2>
        <div className="max-w-md">
          <PackageCard title="Meeting Package" price="Rp 1.500.000" capacity="15 Pax" gradient="from-blue-500 via-cyan-500 to-teal-500" icon={<Users className="w-5 h-5" />}
            includes={["Dimsum", "Singkong Keju", "Traditional Snack", "Mix Fruit", "Coffee Break", "Infused Water", "Ice Tea", "Projector", "Screen", "Sound System", "Free WiFi"]} />
        </div>
      </section>

      {/* Gathering Packages */}
      <section className="section-padding max-w-5xl mx-auto py-16">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-[#212121] mb-10 flex items-center gap-3">
          <Sun className="w-6 h-6" /> Gathering Package — In The Sky
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <PackageCard title="In The Sky A" price="Rp 850.000" capacity="10 Pax" gradient="from-amber-400 to-orange-500" icon={<PackageOpen className="w-5 h-5" />}
            includes={["10 Nasi Goreng Seafood", "10 Flavour Tea", "4 Potato & Sausage", "4 Chicken Wings & Potato"]} />
          <PackageCard title="In The Sky B" price="Rp 850.000" capacity="10 Pax" gradient="from-rose-400 to-pink-500" icon={<PackageOpen className="w-5 h-5" />}
            includes={["10 Nasi Goreng Hongkong", "10 Flavour Tea", "4 Beef Sambosa", "4 Chicken Wings & Potato"]} />
          <PackageCard title="In The Sky A" price="Rp 1.500.000" capacity="15 Pax" gradient="from-amber-500 to-orange-600" icon={<PackageOpen className="w-5 h-5" />}
            includes={["15 Nasi Goreng Kampung", "15 Flavour Tea", "5 Beef Croquettes", "4 Dimsum", "3 Potato & Sausage", "15 Ice Cream"]} />
          <PackageCard title="In The Sky B" price="Rp 1.500.000" capacity="15 Pax" gradient="from-rose-500 to-pink-600" icon={<PackageOpen className="w-5 h-5" />}
            includes={["15 Pasta Carbonara", "15 Flavour Tea", "5 Singkong Keju", "4 Chicken Wings & Potato", "3 Potato & Sausage", "15 Ice Cream"]} />
          <PackageCard title="In The Sky A" price="Rp 2.450.000" capacity="25 Pax" gradient="from-amber-600 to-orange-700" icon={<PackageOpen className="w-5 h-5" />}
            includes={["25 Nasi Goreng Kampung", "25 Flavour Tea", "25 Ice Cream", "5 Dimsum", "4 Beef Croquettes"]} />
          <PackageCard title="In The Sky B" price="Rp 2.450.000" capacity="25 Pax" gradient="from-rose-600 to-pink-700" icon={<PackageOpen className="w-5 h-5" />}
            includes={["25 Pasta Carbonara", "25 Flavour Tea", "25 Ice Cream", "5 Dimsum", "4 Singkong Keju", "4 Chicken Wings & Potato"]} />
        </div>
      </section>

      {/* Summary Tables */}
      <section className="bg-gradient-to-br from-[#212121] to-black text-white section-padding py-16">
        <div className="max-w-5xl mx-auto">
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold mb-10 flex items-center gap-3">
            <Star className="w-6 h-6" /> Ringkasan
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeUp}>
              <h3 className="text-lg font-semibold text-white/70 mb-4">Kapasitas Venue</h3>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10">
                    <th className="text-left p-4 font-medium text-white/50">Area</th>
                    <th className="text-left p-4 font-medium text-white/50">Kapasitas</th>
                    <th className="text-left p-4 font-medium text-white/50">Keterangan</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { area: "Outdoor Rooftop", capacity: "150 Orang", note: "City View, LRT View, 2 Stage" },
                      { area: "Indoor Room", capacity: "30 Orang", note: "Meeting Room, Workshop, Seminar" },
                    ].map((r) => (
                      <tr key={r.area} className="border-b border-white/5 last:border-0">
                        <td className="p-4 font-medium">{r.area}</td>
                        <td className="p-4 text-white/70">{r.capacity}</td>
                        <td className="p-4 text-white/50 text-xs">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
            <motion.div {...fadeUp}>
              <h3 className="text-lg font-semibold text-white/70 mb-4">Harga Paket</h3>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10">
                    <th className="text-left p-4 font-medium text-white/50">Paket</th>
                    <th className="text-left p-4 font-medium text-white/50">Kapasitas</th>
                    <th className="text-right p-4 font-medium text-white/50">Harga</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { name: "Small Birthday", cap: "15 Pax", price: "Rp 1.700.000" },
                      { name: "Medium Birthday", cap: "25 Pax", price: "Rp 3.500.000" },
                      { name: "Meeting Package", cap: "15 Pax", price: "Rp 1.500.000" },
                      { name: "In The Sky A (10)", cap: "10 Pax", price: "Rp 850.000" },
                      { name: "In The Sky B (10)", cap: "10 Pax", price: "Rp 850.000" },
                      { name: "In The Sky A (15)", cap: "15 Pax", price: "Rp 1.500.000" },
                      { name: "In The Sky B (15)", cap: "15 Pax", price: "Rp 1.500.000" },
                      { name: "In The Sky A (25)", cap: "25 Pax", price: "Rp 2.450.000" },
                      { name: "In The Sky B (25)", cap: "25 Pax", price: "Rp 2.450.000" },
                    ].map((r) => (
                      <tr key={r.name} className="border-b border-white/5 last:border-0">
                        <td className="p-4 font-medium">{r.name}</td>
                        <td className="p-4 text-white/70">{r.cap}</td>
                        <td className="p-4 text-right text-amber-400 font-semibold">{r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section-padding max-w-3xl mx-auto py-16 text-center">
        <motion.div {...fadeUp}>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-3">Ready to Book?</h2>
          <p className="text-[rgba(33,33,33,0.5)] mb-6 max-w-md mx-auto">Hubungi kami untuk reservasi dan info paket lebih lanjut.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/reservasi" className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-[#212121] font-semibold text-sm transition-all hover:bg-white/20 hover:shadow-xl shadow-lg">
              Reserve Now
            </Link>
            <a href="https://wa.me/6281774934980" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-emerald-500/80 backdrop-blur-xl border border-emerald-400/30 text-white font-semibold text-sm transition-all hover:bg-emerald-500 hover:shadow-xl shadow-lg">
              WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
