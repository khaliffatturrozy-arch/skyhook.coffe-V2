"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import type { MenuItem, Category } from "@/types"
import { useCartStore } from "@/store/cart"
import { Search, X, Minus, Plus, ShoppingBag, Clock, ChefHat, Sparkles, Star } from "lucide-react"

const POINTS_PER_1000 = 1

function calcPoints(price: number) {
  return Math.floor(price / 1000) * POINTS_PER_1000
}

const categoryGradients: Record<string, string> = {
  "Signature": "from-amber-700 to-amber-900",
  "Non Coffee": "from-rose-500 to-pink-600",
  "Manual Coffee": "from-amber-800 to-amber-950",
  "BITE": "from-orange-500 to-red-600",
  "MILKY": "from-sky-400 to-blue-500",
  "COFFEE": "from-amber-600 to-amber-800",
  "TEA": "from-emerald-500 to-teal-600",
  "Platter Share": "from-violet-500 to-purple-700",
  "Rice": "from-orange-600 to-amber-700",
  "Croissant": "from-yellow-600 to-amber-700",
  "Pasta & Steak": "from-red-600 to-rose-700",
  "Rice Bowl": "from-lime-500 to-green-600",
  "Snack": "from-orange-400 to-red-500",
  "Cake": "from-pink-400 to-rose-500",
}

const categoryIcons: Record<string, string> = {
  "Signature": "☕",
  "Non Coffee": "🧋",
  "Manual Coffee": "🫘",
  "BITE": "🥐",
  "MILKY": "🥛",
  "COFFEE": "☕",
  "TEA": "🍵",
  "Platter Share": "🥘",
  "Rice": "🍚",
  "Croissant": "🥐",
  "Pasta & Steak": "🍝",
  "Rice Bowl": "🥣",
  "Snack": "🍟",
  "Cake": "🍰",
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { items, addItem, updateQuantity } = useCartStore()

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

  function getQty(id: string) {
    return items.find((i) => i.id === id)?.quantity || 0
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-[rgba(33,33,33,0.4)] text-sm">Loading menu...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white pt-20 pb-24">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#212121] to-black text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/[0.05] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 section-padding max-w-5xl mx-auto py-14 md:py-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
              ☕
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Our Menu</h1>
              <p className="text-white/50 text-sm mt-1">Handcrafted with love, served with passion</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full bg-white/10 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-20 md:top-20 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            <button
              onClick={() => setActiveCategory("All")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === "All"
                  ? "bg-[#212121] text-white shadow-lg"
                  : "bg-gray-100 text-[rgba(33,33,33,0.6)] hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === cat.name
                    ? "bg-[#212121] text-white shadow-lg"
                    : "bg-gray-100 text-[rgba(33,33,33,0.6)] hover:bg-gray-200"
                }`}
              >
                <span>{categoryIcons[cat.name] || "🍽️"}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 lg:px-16 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((item, index) => {
            const catName = categoryNameMap[item.category_id] || ""
            const qty = getQty(item.id)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200"
              >
                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full text-left"
                >
                  <div className={`relative h-28 md:h-32 ${item.image_url ? '' : `bg-gradient-to-br ${categoryGradients[catName] || 'from-gray-600 to-gray-800'}`} flex items-center justify-center overflow-hidden`}>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl md:text-6xl opacity-60">{categoryIcons[catName] || "🍽️"}</span>
                    )}
                    {item.is_featured && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/30 backdrop-blur-md text-white text-[9px] font-bold rounded-full flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-sm font-semibold text-[rgba(33,33,33,0.87)] leading-snug line-clamp-1">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-[rgba(33,33,33,0.45)] mt-1 line-clamp-1">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-[#212121]">
                        IDR {Number(item.price).toLocaleString()}
                      </span>
                      <span className="text-[9px] text-[rgba(33,33,33,0.35)] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {item.preparation_time}m
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      <span className="text-[10px] font-medium text-amber-700">+{calcPoints(Number(item.price))} pts</span>
                    </div>
                  </div>
                </button>
                <div className="px-3 pb-3 md:px-4 md:pb-4">
                  {qty === 0 ? (
                    <button
                      onClick={() => addItem({ id: item.id, name: item.name, price: Number(item.price) })}
                      className="w-full py-2 rounded-xl bg-[#212121] hover:bg-black text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-100 rounded-xl py-1 px-1">
                      <button
                        onClick={() => updateQuantity(item.id, qty - 1)}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center text-[rgba(33,33,33,0.6)] hover:text-black transition-colors shadow-sm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-semibold text-[#212121] min-w-[24px] text-center">{qty}</span>
                      <button
                        onClick={() => {
                          if (qty === 0) addItem({ id: item.id, name: item.name, price: Number(item.price) })
                          else updateQuantity(item.id, qty + 1)
                        }}
                        className="w-8 h-8 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center text-[rgba(33,33,33,0.6)] hover:text-black transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-[rgba(33,33,33,0.4)] text-sm">No items found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]"
              >
                {/* Close */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image */}
                <div className={`relative h-52 ${selectedItem.image_url ? '' : `bg-gradient-to-br ${categoryGradients[categoryNameMap[selectedItem.category_id]] || 'from-gray-600 to-gray-800'}`} flex items-center justify-center overflow-hidden`}>
                  {selectedItem.image_url ? (
                    <img src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl opacity-40">{categoryIcons[categoryNameMap[selectedItem.category_id]] || "🍽️"}</span>
                  )}
                  {selectedItem.is_featured && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 208px)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-[#212121]">{selectedItem.name}</h2>
                      <span className="text-xs text-[rgba(33,33,33,0.4)]">{categoryNameMap[selectedItem.category_id]}</span>
                    </div>
                    <span className="text-xl font-bold text-[#212121] whitespace-nowrap ml-3">
                      IDR {Number(selectedItem.price).toLocaleString()}
                    </span>
                  </div>

                  {selectedItem.description && (
                    <p className="text-sm text-[rgba(33,33,33,0.6)] leading-relaxed mb-4">
                      {selectedItem.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mb-6 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-[rgba(33,33,33,0.45)]">
                      <Clock className="w-3.5 h-3.5" />
                      Prep time: {selectedItem.preparation_time} min
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      Earn +{calcPoints(Number(selectedItem.price))} pts
                    </div>
                    {selectedItem.is_available ? (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                        Available
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-medium text-[rgba(33,33,33,0.6)] mb-3">Quantity</p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          const q = getQty(selectedItem.id)
                          if (q <= 1) { updateQuantity(selectedItem.id, 0); setSelectedItem(null) }
                          else updateQuantity(selectedItem.id, q - 1)
                        }}
                        className="w-12 h-12 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center text-[rgba(33,33,33,0.6)] hover:text-black transition-colors shadow-sm border border-gray-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-2xl font-bold text-[#212121]">{getQty(selectedItem.id)}</span>
                      <button
                        onClick={() => {
                          const q = getQty(selectedItem.id)
                          if (q === 0) addItem({ id: selectedItem.id, name: selectedItem.name, price: Number(selectedItem.price) })
                          else updateQuantity(selectedItem.id, q + 1)
                        }}
                        className="w-12 h-12 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center text-[rgba(33,33,33,0.6)] hover:text-black transition-colors shadow-sm border border-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => {
                      const q = getQty(selectedItem.id)
                      if (q === 0) addItem({ id: selectedItem.id, name: selectedItem.name, price: Number(selectedItem.price) })
                      setSelectedItem(null)
                    }}
                    className="w-full mt-4 py-3.5 rounded-2xl bg-[#212121] hover:bg-black text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {getQty(selectedItem.id) > 0
                      ? `Add ${getQty(selectedItem.id) + 1} to Cart — IDR ${(Number(selectedItem.price) * (getQty(selectedItem.id) + 1)).toLocaleString()}`
                      : `Add to Cart — IDR ${Number(selectedItem.price).toLocaleString()}`
                    }
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
