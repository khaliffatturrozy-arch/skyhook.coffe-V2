"use client"

import { motion, AnimatePresence } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Trash2, Minus, Plus, X, Loader2 } from "lucide-react"
import { useCartStore } from "@/store/cart"

export function CartDrawer() {
  const { items, open, setOpen, removeItem, updateQuantity, clearCart, total } = useCartStore()

  async function handleCheckout() {
    const res = await fetch("/api/orders/create", {
      method: "POST",
      body: JSON.stringify({
        items: items.map((i) => ({ menu_item_id: i.id, quantity: i.quantity, price: i.price, notes: i.notes })),
      }),
    })
    const data = await res.json()
    if (data.order) {
      window.location.href = `/receipt?id=${data.order.id}`
      clearCart()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#0a0a0f] border-l border-white/5"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-skyhook-amber" />
                <h2 className="font-heading text-xl font-bold text-white">Your Order</h2>
                <span className="text-white/30 text-sm">({items.length})</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3" style={{ height: "calc(100% - 180px)" }}>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/20 text-sm">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <GlassCard key={item.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{item.name}</span>
                      <button onClick={() => removeItem(item.id)} className="p-1 text-white/20 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-skyhook-amber text-sm font-bold">IDR {(item.price * item.quantity).toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-lg glass flex items-center justify-center text-white/40"><Minus className="w-3 h-3" /></button>
                        <span className="text-white text-sm font-bold w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-lg glass flex items-center justify-center text-white/40"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-[#0a0a0f]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Total</span>
                  <span className="text-white font-bold text-lg">IDR {total().toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={clearCart}>Clear</Button>
                  <Button variant="primary" className="flex-1" onClick={handleCheckout}>Place Order</Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function CartBadge() {
  const { items, toggleCart } = useCartStore()
  const count = items.reduce((s, i) => s + i.quantity, 0)
  return (
    <button onClick={toggleCart} className="relative p-2 text-white/40 hover:text-skyhook-amber transition-colors">
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-skyhook-amber text-black text-[10px] font-bold flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  )
}
