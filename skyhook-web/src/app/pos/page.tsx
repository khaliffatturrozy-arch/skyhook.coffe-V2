"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Plus, Minus, Trash2, Printer, CreditCard, QrCode, User, Loader2, CheckCircle, Users, X } from "lucide-react"
import { PayModal } from "@/components/payment/pay-modal"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

interface MenuItem {
  id: string
  name: string
  slug: string
  price: number
  category_id: string
  category_name?: string
  is_available: boolean
  preparation_time: number
}

interface Category {
  id: string
  name: string
  slug: string
}

interface CartItem {
  menu_item_id: string
  name: string
  price: number
  quantity: number
}

const OUTLET_ID = "a1000000-0000-0000-0000-000000000001"

export default function POSPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCat, setSelectedCat] = useState("All")
  const [showPay, setShowPay] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<{ id: string; total: number } | null>(null)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [showSplit, setShowSplit] = useState(false)
  const [splitCount, setSplitCount] = useState(2)
  const [splitting, setSplitting] = useState(false)
  const [splits, setSplits] = useState<{ label: string; amount: number; id?: string; payment_status?: string }[]>([])

  const supabase = useCallback(() => createClient(), [])

  useEffect(() => {
    async function load() {
      const client = supabase()
      const [menuRes, catRes] = await Promise.all([
        client.from("menu").select("*, categories(name)").eq("is_available", true).order("sort_order"),
        client.from("categories").select("*").order("sort_order"),
      ])
      if (menuRes.data) {
        setMenuItems(
          menuRes.data.map((m: Record<string, unknown>) => ({
            id: m.id as string,
            name: m.name as string,
            slug: m.slug as string,
            price: Number(m.price),
            category_id: m.category_id as string,
            category_name: ((m.categories as Record<string, unknown>)?.name as string) || "",
            is_available: m.is_available as boolean,
            preparation_time: (m.preparation_time as number) || 5,
          }))
        )
      }
      if (catRes.data) setCategories(catRes.data as unknown as Category[])
      setLoading(false)
    }
    load()
  }, [supabase])

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menu_item_id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.menu_item_id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { menu_item_id: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.menu_item_id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const placeOrder = async () => {
    if (cart.length === 0) return
    setPlacing(true)
    setError("")
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outlet_id: OUTLET_ID,
          items: cart.map((i) => ({
            menu_item_id: i.menu_item_id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to place order")
      setPlacedOrder({ id: data.order.id, total: data.order.total })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setPlacing(false)
    }
  }

  const handleSplit = async () => {
    if (!placedOrder) return
    setSplitting(true)
    const total = placedOrder.total
    const perPerson = Math.round((total / splitCount) / 100) * 100
    const remainder = total - perPerson * splitCount
    const splitData = Array.from({ length: splitCount }, (_, i) => ({
      label: `Person ${i + 1}`,
      amount: i === 0 ? perPerson + remainder : perPerson,
    }))
    try {
      const res = await fetch("/api/orders/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: placedOrder.id, splits: splitData }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to split")
      setSplits(data.splits)
      setShowSplit(false)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSplitting(false)
    }
  }

  const handleNewOrder = () => {
    setCart([])
    setPlacedOrder(null)
    setShowPay(false)
    setSplits([])
    setSplitCount(2)
  }

  const catNames = ["All", ...categories.map((c) => c.name)]
  const filteredItems = menuItems.filter((i) => {
    const matchCat = selectedCat === "All" || i.category_name === selectedCat
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-skyhook-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-skyhook-black">
      <div className="flex h-screen">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-skyhook-amber/50"
            />
            <Button variant="secondary" size="sm">
              <User className="w-4 h-4 mr-2" /> Customer
            </Button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto">
            {catNames.map((cat) => (
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
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => addToCart(item)}
                className="glass rounded-xl p-3 text-left hover:bg-white/10 transition-colors group"
              >
                <p className="text-white text-sm font-medium mb-1">{item.name}</p>
                <p className="text-skyhook-amber text-xs font-semibold">IDR {item.price.toLocaleString()}</p>
                <p className="text-white/20 text-[10px] mt-1">{item.category_name || "Menu"}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="w-96 border-l border-white/10 p-4 flex flex-col">
          {placedOrder ? (
            <div className="flex-1 flex flex-col text-center space-y-3 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-white">Order Placed!</h2>
              <p className="text-white/40 text-sm">Order #{placedOrder.id.slice(0, 8).toUpperCase()}</p>

              {splits.length > 0 ? (
                <div className="space-y-2 mt-2">
                  <p className="text-xs text-white/40 font-medium uppercase">Split Bill</p>
                  {splits.map((s, i) => (
                    <div key={s.id || i} className="glass rounded-xl p-3 flex items-center justify-between">
                      <span className="text-white text-sm">{s.label}</span>
                      <div className="text-right">
                        <span className="text-skyhook-amber text-sm font-semibold">IDR {Number(s.amount).toLocaleString()}</span>
                        <span className={`text-[10px] ml-2 ${s.payment_status === "paid" ? "text-emerald-400" : "text-white/30"}`}>
                          {s.payment_status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-skyhook-amber text-lg font-bold">IDR {Number(placedOrder.total).toLocaleString()}</p>
              )}

              <div className="flex flex-col gap-2 w-full pt-2">
                <Button variant="primary" size="lg" className="w-full" onClick={() => setShowPay(true)}>
                  <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                </Button>
                {splits.length === 0 && (
                  <Button variant="secondary" size="lg" className="w-full" onClick={() => setShowSplit(true)}>
                    <Users className="w-4 h-4 mr-2" /> Split Bill
                  </Button>
                )}
                <Link href={`/receipt?order_id=${placedOrder.id}`} target="_blank">
                  <Button variant="ghost" size="sm" className="w-full">
                    <Printer className="w-4 h-4 mr-2" /> Print Receipt
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full" onClick={handleNewOrder}>
                  New Order
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-heading text-lg font-semibold mb-4">Current Order</h2>

              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {cart.length === 0 ? (
                  <p className="text-white/20 text-sm text-center py-10">No items added</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.menu_item_id} className="glass rounded-xl p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-skyhook-amber text-xs">
                          IDR {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.menu_item_id, -1)}
                          className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        </button>
                        <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.menu_item_id, 1)}
                          className="w-7 h-7 rounded-lg glass flex items-center justify-center text-white/60 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {error && (
                <p className="text-red-400 text-sm mb-2 bg-red-500/10 p-2 rounded-xl">{error}</p>
              )}

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

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={placeOrder}
                  disabled={cart.length === 0 || placing}
                >
                  {placing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {placing ? "Placing Order..." : "Place Order"}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="lg" disabled={!placedOrder} onClick={() => setShowPay(true)}>
                    <CreditCard className="w-4 h-4 mr-2" /> Pay
                  </Button>
                  <Button variant="secondary" size="lg" disabled={!placedOrder} onClick={() => setShowPay(true)}>
                    <QrCode className="w-4 h-4 mr-2" /> QRIS
                  </Button>
                </div>

              </div>
            </>
          )}
        </div>
      </div>

      {showSplit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold">Split Bill</h2>
              <button onClick={() => setShowSplit(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/40 text-sm mb-4">
              Split IDR {Number(placedOrder?.total).toLocaleString()} equally
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white text-2xl font-bold w-8 text-center">{splitCount}</span>
              <button
                onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/30 text-xs text-center mb-6">
              {splitCount} people — IDR {Math.round(Number(placedOrder?.total || 0) / splitCount / 100) * 100} each
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSplit}
              disabled={splitting}
            >
              {splitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Users className="w-4 h-4 mr-2" />}
              {splitting ? "Splitting..." : `Split into ${splitCount}`}
            </Button>
          </div>
        </div>
      )}

      {placedOrder && (
        <PayModal
          isOpen={showPay}
          onClose={() => setShowPay(false)}
          total={total}
          orderId={placedOrder.id}
        />
      )}
    </div>
  )
}
