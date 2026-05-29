import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

const OUTLET_ID = "a1000000-0000-0000-0000-000000000001"

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date")
    const time = req.nextUrl.searchParams.get("time")
    const guests = parseInt(req.nextUrl.searchParams.get("guests") || "2")

    if (!date || !time) {
      return NextResponse.json({ error: "Missing date or time" }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    const { data: reserved } = await supabase
      .from("reservations")
      .select("table_id")
      .eq("date", date)
      .eq("status", "confirmed")

    const reservedIds = reserved?.map((r) => r.table_id) || []

    const { data: tables } = await supabase
      .from("tables")
      .select("*")
      .eq("outlet_id", OUTLET_ID)
      .gte("capacity", guests)
      .order("table_number")

    const available = (tables || []).filter((t) => !reservedIds.includes(t.id))

    return NextResponse.json({ tables: available })
  } catch (error) {
    console.error("Availability check error:", error)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, time, guests, table_id, name, email, phone, notes } = body

    if (!date || !time || !guests) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerSupabase()

    let userId: string | null = null
    const { data: { user } } = await supabase.auth.getUser()
    if (user) userId = user.id

    const { data: reservation, error } = await supabase
      .from("reservations")
      .insert({
        user_id: userId,
        outlet_id: OUTLET_ID,
        table_id: table_id || null,
        date,
        time,
        guests,
        status: "pending",
        notes: notes || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error("Reservation creation error:", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}
