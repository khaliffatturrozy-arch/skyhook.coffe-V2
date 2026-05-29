"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Search, ShoppingBag, Coffee, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase"
import type { MenuItem, Category } from "@/types"
import { useCartStore } from "@/store/cart"

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    const supabase = createClient()
    async function fetchData() {
      const [catRes, menuRes] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("menu").select("*").order("sort_order"),
      ])
      if (catRes.data) setCategories(catRes.data)
      if (menuRes.data) setMenuItems(menuRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const categoryNameMap: Record<string, string> = {}
  categories.forEach((c) => { categoryNameMap[c.id] = c.name })

  const filtered = menuItems.filter((item) => {
    const catMatch = activeCategory === "All" || categoryNameMap[item.category_id] === activeCategory
    const searchMatch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description?.toLowerCase() || "").includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-12 h-12 text-skyhook-amber mx-auto mb-4 animate-pulse" />
          <p className="text-white/40">Loading menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 section-padding">
        <div className="absolute inset-0 cinematic-gradient" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
              Our <span className="text-gradient-gold">Menu</span>
            </h1>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Curated selections for the modern palate. Every item handcrafted to perfection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10">
            <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  activeCategory === "All"
                    ? "bg-skyhook-amber text-black font-semibold"
                    : "glass glass-hover text-white/60 hover:text-white"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeCategory === cat.name
                      ? "bg-skyhook-amber text-black font-semibold"
                      : "glass glass-hover text-white/60 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="group cursor-pointer p-0 overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-skyhook-mocha/50 to-skyhook-charcoal relative overflow-hidden">
                    {item.is_featured && (
                      <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-skyhook-amber text-black text-[10px] font-bold rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Coffee className="w-10 h-10 text-white/10" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-heading text-lg font-semibold text-white">{item.name}</h3>
                      <span className="font-heading text-lg font-bold text-gradient-gold whitespace-nowrap ml-2">
                        IDR {item.price.toLocaleString()}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-white/40 text-sm mb-3 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] text-white/30 uppercase tracking-wider">
                        {categoryNameMap[item.category_id] || "Menu"}
                      </span>
                      <span className="text-white/10">|</span>
                      <span className="text-[11px] text-white/30">{item.preparation_time} min</span>
                    </div>
                    <Button variant="primary" size="sm" className="w-full opacity-0 group-hover:opacity-100 transition-opacity max-sm:opacity-100" onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price) })}>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Order
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg">No items found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
