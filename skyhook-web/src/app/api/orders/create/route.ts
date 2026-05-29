import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, outlet_id, table_id, notes } = body

    if (!items?.length || !outlet_id) {
      return NextResponse.json({ error: "Missing required fields: items, outlet_id" }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0)
    const tax = Math.round(subtotal * 0.1)
    const total = subtotal + tax

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        outlet_id,
        table_id: table_id || null,
        status: "pending",
        subtotal,
        tax,
        total,
        notes: notes || null,
      })
      .select()
      .single()

    if (orderErr) throw orderErr

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

    if (itemsErr) throw itemsErr

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
