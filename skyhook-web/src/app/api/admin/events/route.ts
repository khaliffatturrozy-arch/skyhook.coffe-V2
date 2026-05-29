import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const b = await req.json()
    const { data, error } = await supabase.from("events").insert({
      title: b.title, description: b.description, date: b.date, time: b.time,
      venue: b.venue, type: b.type, price: Number(b.price || 0), capacity: Number(b.capacity || 0),
      image_url: b.image_url || null, status: b.status || "active",
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const b = await req.json()
    if (!b.id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const { data, error } = await supabase.from("events").update({
      title: b.title, description: b.description, date: b.date, time: b.time,
      venue: b.venue, type: b.type, price: Number(b.price || 0), capacity: Number(b.capacity || 0),
      image_url: b.image_url || null, status: b.status || "active",
    }).eq("id", b.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const supabase = await createServerSupabase()
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
