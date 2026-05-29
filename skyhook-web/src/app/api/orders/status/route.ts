import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function PATCH(req: NextRequest) {
  try {
    const { order_id, status } = await req.json()

    if (!order_id || !status) {
      return NextResponse.json({ error: "Missing required fields: order_id, status" }, { status: 400 })
    }

    const validStatuses = ["pending", "preparing", "ready", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", order_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Order status update error:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
