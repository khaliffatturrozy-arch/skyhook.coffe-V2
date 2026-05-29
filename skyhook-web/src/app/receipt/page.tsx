"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Printer, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ReceiptItem {
  id: string
  menu_item_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface OrderReceipt {
  id: string
  status: string
  subtotal: number
  tax: number
  total: number
  payment_status: string
  created_at: string
  tables: { table_number: string } | null
  order_items: ReceiptItem[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function ReceiptContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [order, setOrder] = useState<OrderReceipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided")
      setLoading(false)
      return
    }
    fetch(`/api/receipt?order_id=${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setOrder(data.order)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [orderId])

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div className="min-h-screen bg-skyhook-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-skyhook-black flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Order not found"}</p>
          <Link href="/pos"><Button variant="primary">Back to POS</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-skyhook-black print:bg-white">
      <div className="max-w-sm mx-auto p-4 print:p-0">
        <div className="hidden-print flex items-center justify-between mb-6 print:hidden">
          <Link href="/pos">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" /> Print
          </Button>
        </div>

        <div className="bg-white text-black rounded-2xl p-6 print:rounded-none print:shadow-none shadow-lg">
          <div className="text-center border-b-2 border-dashed border-black/10 pb-4 mb-4">
            <h1 className="font-heading text-xl font-bold tracking-tight">SKYHOOK COFFEE</h1>
            <p className="text-xs text-black/50">Premium Rooftop Experience</p>
            <p className="text-xs text-black/50 mt-1">Jakarta, Indonesia</p>
          </div>

          <div className="text-xs space-y-1 mb-4 text-black/60">
            <div className="flex justify-between">
              <span>Order #</span>
              <span className="text-black font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span>Table</span>
              <span>{order.tables?.table_number || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment</span>
              <span className="capitalize">{order.payment_status}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-black/10 pt-4 mb-4">
            <div className="flex justify-between text-xs font-bold text-black/60 mb-2 pb-2 border-b border-black/5">
              <span className="flex-1">Item</span>
              <span className="w-12 text-right">Qty</span>
              <span className="w-20 text-right">Amount</span>
            </div>
            {(order.order_items || []).map((item) => (
              <div key={item.id} className="flex justify-between text-xs py-1.5">
                <span className="flex-1">{item.menu_item_name}</span>
                <span className="w-12 text-right text-black/40">{item.quantity}</span>
                <span className="w-20 text-right">IDR {item.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-black/10 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-black/60">
              <span>Subtotal</span>
              <span>IDR {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-black/60">
              <span>Tax (10%)</span>
              <span>IDR {Number(order.tax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-black/10">
              <span>Total</span>
              <span>IDR {Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-black/10">
            <p className="text-xs text-black/40">Thank you for visiting!</p>
            <p className="text-xs text-black/30 mt-1">Follow us @skyhookcoffee</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-skyhook-black flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-skyhook-amber" /></div>}>
      <ReceiptContent />
    </Suspense>
  )
}
