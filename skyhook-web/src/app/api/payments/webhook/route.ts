import { NextRequest, NextResponse } from "next/server"
import { verifyStripeWebhook } from "@/lib/payments"

export async function POST(req: NextRequest) {
  const stripeSig = req.headers.get("stripe-signature")

  if (stripeSig) {
    const payload = Buffer.from(await req.text())
    const event = verifyStripeWebhook(payload, stripeSig)

    if (!event) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("Stripe payment succeeded:", event.data.object.id)
        break
      case "payment_intent.payment_failed":
        console.error("Stripe payment failed:", event.data.object.id)
        break
    }

    return NextResponse.json({ received: true })
  }

  // Midtrans webhook
  const body = await req.json()
  const orderId = body.order_id
  const status = body.transaction_status

  if (orderId && status) {
    console.log(`Midtrans update: ${orderId} → ${status}`)
    return NextResponse.json({ received: true })
  }

  return NextResponse.json({ error: "Unknown webhook payload" }, { status: 400 })
}
