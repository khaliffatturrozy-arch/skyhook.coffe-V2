"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { ROUTES } from "@/config"
import { ArrowRight } from "lucide-react"

const featuredItems = [
  {
    name: "Skyhook Signature",
    category: "Coffee",
    price: "IDR 68K",
    description: "Espresso, caramel, vanilla, oat milk — our signature blend",
    color: "from-amber-900/30 to-amber-700/20",
  },
  {
    name: "Rooftop Matcha",
    category: "Specialty",
    price: "IDR 75K",
    description: "Premium Japanese matcha, honey, almond milk",
    color: "from-emerald-900/30 to-emerald-700/20",
  },
  {
    name: "VIP Butter Croissant",
    category: "Pastry",
    price: "IDR 45K",
    description: "French-style croissant, truffle butter, gold leaf",
    color: "from-skyhook-gold/20 to-amber-700/20",
  },
  {
    name: "Midnight Affogato",
    category: "Dessert",
    price: "IDR 85K",
    description: "Vanilla gelato, hot espresso, dark chocolate shavings",
    color: "from-purple-900/30 to-purple-700/20",
  },
]

export function MenuPreview() {
  return (
    <section className="relative py-32 section-padding">
      <div className="absolute inset-0 cinematic-gradient" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16"
        >
          <div>
            <span className="text-skyhook-amber text-sm tracking-widest uppercase font-medium mb-2 block">
              Curated Selection
            </span>
            <h2 className="font-heading text-4xl md:text-6xl font-bold">
              Signature <span className="text-gradient-gold">Menu</span>
            </h2>
          </div>
          <Link href={ROUTES.menu} className="mt-4 md:mt-0">
            <Button variant="ghost" className="group">
              View Full Menu
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="group cursor-pointer p-0 overflow-hidden">
                <div className={`h-48 bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="font-heading text-3xl font-bold text-white/80 relative z-10">{item.name}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-skyhook-amber tracking-wider uppercase font-medium">{item.category}</span>
                    <span className="font-heading text-lg font-bold text-gradient-gold">{item.price}</span>
                  </div>
                  <p className="text-white/40 text-sm">{item.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
