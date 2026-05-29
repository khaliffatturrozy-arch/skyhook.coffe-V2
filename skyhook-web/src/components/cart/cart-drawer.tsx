"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Trash2, Minus, Plus, X } from "lucide-react"
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
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#313131]" />
                <h2 className="text-xl font-bold text-[#212121]">Your Order</h2>
                <span className="text-gray-400 text-sm">({items.length})</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-black"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3" style={{ height: "calc(100% - 180px)" }}>
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#212121] font-medium text-sm">{item.name}</span>
                      <button onClick={() => removeItem(item.id)} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#313131] text-sm font-bold">IDR {(item.price * item.quantity).toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"><Minus className="w-3 h-3" /></button>
                        <span className="text-[#212121] text-sm font-bold w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 text-sm">Total</span>
                  <span className="text-[#212121] font-bold text-lg">IDR {total().toLocaleString()}</span>
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
    <button onClick={toggleCart} className="relative p-2 text-[rgba(33,33,33,0.6)] hover:text-black transition-colors">
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#313131] text-white text-[10px] font-bold flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  )
}
