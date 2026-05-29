import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from("waiter_calls")
      .select("*")
      .in("status", ["pending", "acknowledged"])
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ calls: data })
  } catch (error) {
    console.error("Waiter calls fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { table_id, table_number, outlet_id, notes } = body

    if (!table_number) {
      return NextResponse.json({ error: "Missing required field: table_number" }, { status: 400 })
    }

    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from("waiter_calls")
      .insert({
        table_id: table_id || null,
        table_number,
        outlet_id: outlet_id || null,
        status: "pending",
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ call: data })
  } catch (error) {
    console.error("Waiter call creation error:", error)
    return NextResponse.json({ error: "Failed to create call" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { call_id, status } = body

    if (!call_id || !status) {
      return NextResponse.json({ error: "Missing required fields: call_id, status" }, { status: 400 })
    }

    const updates: Record<string, string> = { status }
    if (status === "acknowledged") updates.acknowledged_at = new Date().toISOString()
    if (status === "resolved") updates.resolved_at = new Date().toISOString()

    const supabase = await createServerSupabase()
    const { error } = await supabase.from("waiter_calls").update(updates).eq("id", call_id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Waiter call update error:", error)
    return NextResponse.json({ error: "Failed to update call" }, { status: 500 })
  }
}
