"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Search, Plus, Minus, Trash2, Printer, CreditCard, QrCode, User } from "lucide-react"

const menuItems = [
  { name: "Skyhook Signature", price: 68000, category: "Coffee" },
  { name: "Rooftop Matcha", price: 75000, category: "Specialty" },
  { name: "Gold Cappuccino", price: 78000, category: "Coffee" },
  { name: "Butter Croissant", price: 45000, category: "Pastry" },
  { name: "Midnight Affogato", price: 85000, category: "Dessert" },
  { name: "Truffle Fries", price: 55000, category: "Pastry" },
  { name: "Sunset Latte", price: 62000, category: "Coffee" },
  { name: "Tropical Cold Brew", price: 55000, category: "Beverage" },
  { name: "Smoked Old Fashioned", price: 135000, category: "Signature" },
  { name: "Dark Chocolate Mousse", price: 65000, category: "Dessert" },
]

const categories = ["All", "Coffee", "Specialty", "Pastry", "Dessert", "Signature", "Beverage"]

interface CartItem {
  name: string
  price: number
  quantity: number
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCat, setSelectedCat] = useState("All")

  const addToCart = (item: { name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name)
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQty = (name: string, delta: number) => {
    setCart(prev => prev.map(i =>
      i.name === name ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter(i => i.quantity > 0))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredItems = selectedCat === "All"
    ? menuItems
    : menuItems.filter(i => i.category === selectedCat)

  return (
    <div className="min-h-screen bg-skyhook-black">
      <div className="flex h-screen">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <input
              placeholder="Search menu..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50"
            />
            <Button variant="secondary" size="sm">
              <User className="w-4 h-4 mr-2" /> Customer
            </Button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  selectedCat === cat ? "bg-skyhook-amber text-black" : "glass text-white/60 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredItems.map((item, i) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => addToCart(item)}
                className="glass rounded-xl p-3 text-left hover:bg-white/10 transition-colors group"
              >
                <p className="text-white text-sm font-medium mb-1">{item.name}</p>
                <p className="text-skyhook-amber text-xs font-semibold">IDR {item.price.toLocaleString()}</p>
                <p className="text-white/20 text-[10px] mt-1">{item.category}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="w-96 border-l border-white/10 p-4 flex flex-col">
          <h2 className="font-heading text-lg font-semibold mb-4">Current Order</h2>
          
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {cart.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-10">No items added</p>
            ) : (
              cart.map(item => (
                <div key={item.name} className="glass rounded-xl p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    <p className="text-skyhook-amber text-xs">IDR {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.name, -1)} className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white">
                      {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.name, 1)} className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Subtotal</span>
              <span className="text-white">IDR {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Tax (10%)</span>
              <span className="text-white">IDR {Math.round(total * 0.1).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-3">
              <span className="text-white">Total</span>
              <span className="text-gradient-gold">IDR {Math.round(total * 1.1).toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="primary" size="lg">
                <CreditCard className="w-4 h-4 mr-2" /> Pay
              </Button>
              <Button variant="secondary" size="lg">
                <QrCode className="w-4 h-4 mr-2" /> QRIS
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="w-full">
              <Printer className="w-4 h-4 mr-2" /> Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
