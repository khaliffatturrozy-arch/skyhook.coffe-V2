"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Printer, Loader2, ArrowLeft, CreditCard, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { PayModal } from "@/components/payment/pay-modal"
import { createClient } from "@/lib/supabase"

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
  const orderId = searchParams.get("order_id") || searchParams.get("id")
  const [order, setOrder] = useState<OrderReceipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPay, setShowPay] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided")
      setLoading(false)
      return
    }

    async function fetchOrder() {
      const res = await fetch(`/api/receipt?order_id=${orderId}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setOrder(data.order)
    }

    fetchOrder().catch((e) => setError(e.message)).finally(() => setLoading(false))
  }, [orderId])

  // Poll payment status
  useEffect(() => {
    if (!order || order.payment_status === "paid") return
    const interval = setInterval(async () => {
      const { data } = await createClient().from("orders").select("payment_status").eq("id", order.id).single()
      if (data?.payment_status === "paid") {
        setOrder((prev) => prev ? { ...prev, payment_status: "paid" } : prev)
        clearInterval(interval)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [order])

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#313131]" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Order not found"}</p>
          <Link href="/"><Button variant="primary">Back to Home</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20 print:bg-white print:pt-0">
      <div className="max-w-sm mx-auto p-4 print:p-0">
        <div className="hidden-print flex items-center justify-between mb-6 print:hidden">
          <Link href="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" /> Print
          </Button>
        </div>

        {/* Payment Status Banner */}
        <div className={`hidden-print mb-4 p-4 rounded-2xl text-sm flex items-center gap-3 ${
          order.payment_status === "paid"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}>
          {order.payment_status === "paid" ? (
            <><CheckCircle className="w-5 h-5 shrink-0" /> Payment confirmed</>
          ) : (
            <><Clock className="w-5 h-5 shrink-0" /> Awaiting payment</>
          )}
        </div>

        <div className="bg-white text-black rounded-2xl border border-gray-200 p-6 print:rounded-none print:shadow-none shadow-sm">
          <div className="text-center border-b-2 border-dashed border-gray-200 pb-4 mb-4">
            <h1 className="text-xl font-bold tracking-tight text-[#212121]">SKYHOOK COFFEE</h1>
            <p className="text-xs text-gray-400">Premium Rooftop Experience</p>
            <p className="text-xs text-gray-400 mt-1">Jakarta, Indonesia</p>
          </div>

          <div className="text-xs space-y-1 mb-4 text-gray-500">
            <div className="flex justify-between">
              <span>Order #</span>
              <span className="text-[#212121] font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment</span>
              <span className={`capitalize font-medium ${order.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"}`}>
                {order.payment_status}
              </span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200 pt-4 mb-4">
            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 pb-2 border-b border-gray-100">
              <span className="flex-1">Item</span>
              <span className="w-12 text-right">Qty</span>
              <span className="w-20 text-right">Amount</span>
            </div>
            {(order.order_items || []).map((item) => (
              <div key={item.id} className="flex justify-between text-xs py-1.5">
                <span className="flex-1 text-[#212121]">{item.menu_item_name}</span>
                <span className="w-12 text-right text-gray-400">{item.quantity}</span>
                <span className="w-20 text-right text-[#212121]">IDR {item.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-gray-200 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>IDR {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax (10%)</span>
              <span>IDR {Number(order.tax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200 text-[#212121]">
              <span>Total</span>
              <span>IDR {Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-200">
            <p className="text-xs text-gray-400">Thank you for visiting!</p>
            <p className="text-xs text-gray-300 mt-1">Follow us @skyhookcoffee</p>
          </div>
        </div>

        {/* Pay Button (if unpaid) */}
        {order.payment_status !== "paid" && (
          <div className="hidden-print mt-4">
            <Button variant="primary" className="w-full" size="lg" onClick={() => setShowPay(true)}>
              <CreditCard className="w-4 h-4 mr-2" /> Pay Now — IDR {Number(order.total).toLocaleString()}
            </Button>
          </div>
        )}

        <PayModal isOpen={showPay} onClose={() => setShowPay(false)} total={order.total} orderId={order.id} />
      </div>
    </div>
  )
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#313131]" /></div>}>
      <ReceiptContent />
    </Suspense>
  )
}
