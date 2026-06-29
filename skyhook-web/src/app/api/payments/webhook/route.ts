import { NextRequest, NextResponse } from "next/server"
import { verifyStripeWebhook } from "@/lib/payments"
import { createServerSupabase } from "@/lib/supabase-server"

async function handlePaymentSuccess(orderId: string, method: string) {
  const supabase = await createServerSupabase()

  const { data: order } = await supabase.from("orders").select("id, user_id, total").eq("id", orderId).maybeSingle()
  if (!order) return

  await supabase.from("orders").update({ payment_status: "paid", payment_method: method }).eq("id", orderId)

  // add loyalty points (1 pt per Rp 1.000)
  const points = Math.floor(order.total / 1000)
  const { data: user } = await supabase.from("users").select("loyalty_points").eq("id", order.user_id).maybeSingle()
  if (user) {
    await supabase.from("users").update({ loyalty_points: (user.loyalty_points || 0) + points, total_spent: (order.total || 0) }).eq("id", order.user_id)
  }

  if (order.user_id) {
    await supabase.from("notifications").insert({
      user_id: order.user_id,
      title: "Payment Received",
      body: `Your payment of IDR ${order.total.toLocaleString()} has been confirmed. +${points} loyalty points earned!`,
      type: "payment",
    })
  }
}

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
        const orderId = event.data.object.metadata?.order_id
        if (orderId) await handlePaymentSuccess(orderId, "stripe")
        break
      case "payment_intent.payment_failed":
        break
    }

    return NextResponse.json({ received: true })
  }

  // Midtrans webhook
  const body = await req.json()
  const orderId = body.order_id
  const status = body.transaction_status

  if (orderId && ["settlement", "capture"].includes(status)) {
    await handlePaymentSuccess(orderId, "midtrans")
    return NextResponse.json({ received: true })
  }

  if (orderId && status) {
    return NextResponse.json({ received: true })
  }

  return NextResponse.json({ error: "Unknown webhook payload" }, { status: 400 })
}
