import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
  try {
    const { order_id, splits } = await req.json()

    if (!order_id || !splits?.length) {
      return NextResponse.json({ error: "Missing required fields: order_id, splits" }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const splitData = splits.map((s: { label: string; amount: number }) => ({
      order_id,
      label: s.label,
      amount: s.amount,
      payment_status: "unpaid",
    }))

    const { data, error } = await supabase.from("split_payments").insert(splitData).select()

    if (error) throw error

    await supabase.from("orders").update({ is_split_bill: true }).eq("id", order_id)

    return NextResponse.json({ splits: data })
  } catch (error) {
    console.error("Split bill error:", error)
    return NextResponse.json({ error: "Failed to split bill" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("order_id")

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 })
    }

    const supabase = await createServerSupabase()
    const { data, error } = await supabase.from("split_payments").select("*").eq("order_id", orderId).order("created_at")

    if (error) throw error

    return NextResponse.json({ splits: data })
  } catch (error) {
    console.error("Split bill fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch splits" }, { status: 500 })
  }
}
