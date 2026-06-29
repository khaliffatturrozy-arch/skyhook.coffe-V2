import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("order_id")
    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*), tables(table_number)")
      .eq("id", orderId)
      .maybeSingle()

    if (error) throw error
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Receipt error:", error)
    return NextResponse.json({ error: "Failed to load receipt" }, { status: 500 })
  }
}
