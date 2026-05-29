import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"
import { createMidtransTransaction, createStripePaymentIntent } from "@/lib/payments"

export async function POST(req: NextRequest) {
  try {
    const { event_id, quantity = 1, payment_method = "midtrans" } = await req.json()
    if (!event_id || quantity < 1) {
      return NextResponse.json({ error: "Missing event_id or invalid quantity" }, { status: 400 })
    }

    const supabase = await createServerSupabase()
    const { data: event, error: evErr } = await supabase.from("events").select("*").eq("id", event_id).single()
    if (evErr || !event) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    if (event.capacity && event.tickets_sold + quantity > event.capacity) {
      return NextResponse.json({ error: "Not enough tickets available" }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    const total = Number(event.price || 0) * quantity
    const orderId = `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    const { data: ticket, error: tErr } = await supabase.from("event_tickets").insert({
      event_id, user_id: user?.id || null, quantity, total_paid: total, created_at: new Date().toISOString(),
    }).select().single()
    if (tErr) throw tErr

    await supabase.from("events").update({ tickets_sold: (event.tickets_sold || 0) + quantity }).eq("id", event_id)

    let paymentResult: any = {}

    if (payment_method === "midtrans") {
      paymentResult = await createMidtransTransaction({
        orderId, grossAmount: total,
        customerDetails: { firstName: user?.email || "Guest", email: user?.email || "guest@skyhook.com" },
        items: [{ name: `${event.title} x${quantity}`, price: total, quantity: 1 }],
      })
    } else if (payment_method === "stripe") {
      paymentResult = await createStripePaymentIntent({ amount: Math.round(total * 100), currency: "idr", metadata: { ticket_id: ticket.id, event_id } })
    }

    return NextResponse.json({ ticket, orderId, total, payment: paymentResult })
  } catch (error) {
    console.error("Ticket purchase error:", error)
    return NextResponse.json({ error: "Failed to process ticket purchase" }, { status: 500 })
  }
}
