import { NextRequest, NextResponse } from "next/server"
import { createMidtransTransaction, createStripePaymentIntent, createQRISTransaction } from "@/lib/payments"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { method, orderId, amount, customer, items } = body

    if (!method || !orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields: method, orderId, amount" }, { status: 400 })
    }

    let result

    switch (method) {
      case "midtrans":
        result = await createMidtransTransaction({
          orderId,
          grossAmount: amount,
          customerDetails: {
            firstName: customer?.name || "Guest",
            email: customer?.email || "guest@skyhook.coffee",
            phone: customer?.phone,
          },
          items: items || [{ name: "Order", price: amount, quantity: 1 }],
        })
        break

      case "stripe":
        result = await createStripePaymentIntent({
          amount: Math.round(amount * 100),
          currency: "idr",
          metadata: { order_id: orderId },
        })
        break

      case "qris":
        result = await createQRISTransaction({
          orderId,
          grossAmount: amount,
          customerName: customer?.name || "Guest",
        })
        break

      default:
        return NextResponse.json({ error: `Unknown payment method: ${method}` }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Payment service unavailable" }, { status: 500 })
  }
}
