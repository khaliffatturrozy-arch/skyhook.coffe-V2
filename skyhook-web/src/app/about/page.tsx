"use client"

import { motion } from "framer-motion"
import { Coffee, Music, Sun, Utensils, MapPin, Heart, Users, Star } from "lucide-react"

const aboutImages = [
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/CKa0Micxd5oB0rFCKaWf2Ao8hTnsHTSn6BE5xzT5uIZg.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/CKa0QfazXZpDsVTCKaWHe32DEC7zVYQQaz95FoRgh8iQ.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/hlXSL3WIRwXs8Fhlm2d5C4GNHiei7S9Gs12Nj5eUZ5Q.jpg",
  "https://brdsg.com/img/800/brsl50twbrtoukb1wa_1/hlmBJG2G7asfCI3hlm2DRPgH5lBFpzRseEge7Ws8knw.jpg",
]

const highlights = [
  { icon: Coffee, title: "Specialty Coffee", desc: "Handcrafted espresso-based drinks made from premium single-origin beans, roasted to perfection." },
  { icon: Sun, title: "Rooftop Experience", desc: "Enjoy your coffee with a view. Our open-air rooftop provides the perfect backdrop for any occasion." },
  { icon: Music, title: "Live Music", desc: "Jakarta Timur's most viral live music venue. Featuring local talented artists every evening." },
  { icon: Utensils, title: "House Kitchen", desc: "From comfort food to fusion dishes, our kitchen serves a diverse menu crafted with fresh ingredients." },
]

const values = [
  { icon: Heart, title: "Community First", desc: "We believe in creating a space where everyone belongs." },
  { icon: Star, title: "Quality Always", desc: "From bean to cup, we never compromise on quality." },
  { icon: Users, title: "Warm Hospitality", desc: "Every guest is family. We treat you with genuine care." },
  { icon: MapPin, title: "Local Pride", desc: "Proudly serving Jakarta Timur with authentic Indonesian hospitality." },
]

export default function AboutPage() {
  return (
    <main className="bg-white pt-16 md:pt-20">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <img src={aboutImages[0]} alt="Skyhook Coffee" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 section-padding max-w-3xl mx-auto pb-10 md:pb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-10 h-0.5 bg-white mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">About Skyhook Coffee</h1>
            <p className="text-white/70 text-sm md:text-base max-w-lg">Rooftop House and Kitchen — where great coffee, live music, and unforgettable moments meet.</p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding max-w-3xl mx-auto py-14 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="w-10 h-0.5 bg-[#313131] mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-4">Our Story</h2>
          <div className="space-y-4 text-[rgba(33,33,33,0.7)] leading-relaxed text-sm md:text-base">
            <p>Skyhook Coffee Rooftop House and Kitchen was born from a simple vision — to create a space where the energy of Jakarta meets the warmth of exceptional hospitality. Perched above the city, our rooftop venue offers an escape from the ordinary.</p>
            <p>What started as a passion for great coffee grew into a full-fledged dining and entertainment destination. Today, we are proud to be known as <strong>Jakarta Timur's most viral coffee shop and live music venue</strong>, drawing guests from across the city.</p>
            <p>Every detail — from our carefully sourced beans to our curated live music lineup — reflects our commitment to creating moments that matter. Whether you are here for a quiet morning coffee, a business meeting, or a night out with friends, Skyhook is your home.</p>
          </div>
        </motion.div>

        {/* Image Divider */}
        <div className="grid grid-cols-2 gap-2 my-12">
          <img src={aboutImages[1]} alt="Interior" className="rounded-lg w-full h-48 md:h-64 object-cover" />
          <img src={aboutImages[2]} alt="Atmosphere" className="rounded-lg w-full h-48 md:h-64 object-cover" />
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="section-padding max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="w-10 h-0.5 bg-[#313131] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">What We Offer</h2>
            <p className="text-[rgba(33,33,33,0.6)] text-sm">Every corner of Skyhook is designed for experience</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <item.icon className="w-5 h-5 text-[#313131]" />
                </div>
                <h3 className="font-semibold text-[#212121] mb-1.5">{item.title}</h3>
                <p className="text-sm text-[rgba(33,33,33,0.6)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding max-w-3xl mx-auto py-14 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="w-10 h-0.5 bg-[#313131] mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">Why Choose Skyhook?</h2>
          <p className="text-[rgba(33,33,33,0.6)] text-sm">What makes us different</p>
        </motion.div>
        <div className="space-y-5">
          {[
            { label: "Premium Coffee & Drinks", value: "Single-origin beans, expert baristas", pct: "95%" },
            { label: "Live Music Experience", value: "Local talents every night", pct: "90%" },
            { label: "Rooftop Ambiance", value: "Open-air dining with city views", pct: "92%" },
            { label: "Customer Satisfaction", value: "Consistent quality and service", pct: "93%" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-[#212121]">{item.label}</span>
                <span className="text-[rgba(33,33,33,0.5)]">{item.value}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: item.pct }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#313131] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#212121] py-14 md:py-20">
        <div className="section-padding max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="w-10 h-0.5 bg-white/50 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Our Values</h2>
            <p className="text-white/50 text-sm">The principles that guide everything we do</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <v.icon className="w-5 h-5 text-white/80" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{v.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="section-padding max-w-3xl mx-auto py-14 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-10 h-0.5 bg-[#313131] mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-[#212121] mb-4">Visit Us</h2>
          <p className="text-[rgba(33,33,33,0.7)] text-sm md:text-base leading-relaxed mb-2">
            <strong>Skyhook Coffee Rooftop House and Kitchen</strong>
          </p>
          <p className="text-[rgba(33,33,33,0.6)] text-sm mb-1">Jl. Pusdiklat Depnaker No.23, RW.6, Pinang Ranti</p>
          <p className="text-[rgba(33,33,33,0.6)] text-sm mb-1">Kec. Makasar, Kota Jakarta Timur 13560</p>
          <p className="text-[rgba(33,33,33,0.5)] text-sm italic mb-6">Didepan SPBU Kampung Makasar</p>
          <div className="flex items-center justify-center gap-4">
            <a href="https://wa.me/6281774934980?text=Hallo%20admin%20Skyhook%20Coffee" target="_blank" rel="noopener noreferrer"
              className="bg-[#313131] hover:bg-black text-white rounded-full px-6 py-2.5 text-sm font-medium transition-all"
            >
              Contact Us
            </a>
            <a href="https://www.instagram.com/skyhookcoffee/" target="_blank" rel="noopener noreferrer"
              className="border border-gray-300 text-[#212121] hover:bg-gray-50 rounded-full px-6 py-2.5 text-sm font-medium transition-all"
            >
              Follow Us
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
