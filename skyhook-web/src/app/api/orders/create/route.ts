import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

const isDev = process.env.NODE_ENV === "development"
const localDevPaymentMode = process.env.LOCAL_DEV_PAYMENT_MODE === "true"

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID?.() ?? Date.now().toString(36)
  try {
    const body = await req.json()
    const { items, outlet_id, table_id, notes } = body

    if (!items?.length) {
      return NextResponse.json({ error: "Missing required fields: items" }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) {
      if (isDev) {
        console.warn(`[${requestId}] No authenticated user in dev mode — proceeding without user_id`)
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }
    const userId = user?.id ?? null

    const { data: defaultOutlet, error: outletErr } = await supabase.from("outlets").select("id").limit(1).maybeSingle()
    if (outletErr) {
      console.error(`[${requestId}] Outlet query error:`, outletErr)
    }
    const effectiveOutletId = outlet_id || defaultOutlet?.id || "a1000000-0000-0000-0000-000000000001"

    const serviceChargeRate = 0.05
    const taxRate = 0.1
    const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0)
    const serviceCharge = Math.round(subtotal * serviceChargeRate)
    const tax = Math.round(subtotal * taxRate)
    const total = subtotal + serviceCharge + tax

    const isLocalDevPaid = isDev && localDevPaymentMode

    const orderPayload: Record<string, unknown> = {
      outlet_id: effectiveOutletId,
      table_id: table_id || null,
      user_id: userId,
      status: "pending",
      subtotal,
      service_charge: serviceCharge,
      tax,
      total,
      notes: notes || null,
      payment_status: isLocalDevPaid ? "paid" : "unpaid",
      payment_method: isLocalDevPaid ? "local_dev" : null,
    }

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert(orderPayload)
      .select()
      .single()

    if (orderErr) {
      console.error(`[${requestId}] Order insert error:`, orderErr)
      return NextResponse.json({ error: "Failed to create order", detail: orderErr.message }, { status: 500 })
    }

    const orderItems = items.map((i: { menu_item_id: string; name: string; price: number; quantity: number; notes?: string }) => ({
      order_id: order.id,
      menu_item_id: i.menu_item_id,
      menu_item_name: i.name,
      quantity: i.quantity,
      unit_price: i.price,
      subtotal: i.price * i.quantity,
      notes: i.notes || null,
    }))

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems)

    if (itemsErr) {
      console.error(`[${requestId}] Order items insert error:`, itemsErr)
      return NextResponse.json({ error: "Failed to create order items", detail: itemsErr.message }, { status: 500 })
    }

    if (isDev) {
      console.log(`[${requestId}] Order ${order.id} created (user=${userId ?? "anon"}, outlet=${effectiveOutletId}, items=${items.length}, total=${total}, payment=${isLocalDevPaid ? "simulated_paid" : "unpaid"})`)
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error(`[${requestId}] Order creation error:`, error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
