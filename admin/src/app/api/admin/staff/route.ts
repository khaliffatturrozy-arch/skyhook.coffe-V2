import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from("staff").select("*, users(email), outlets(name)").order("created_at", { ascending: false })
  return NextResponse.json(data || [])
}
export async function POST(req: NextRequest) {
  const body = await req.json(); const supabase = await createServerSupabase()
  const { error } = await supabase.from("staff").insert(body)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
export async function PUT(req: NextRequest) {
  const { id, ...body } = await req.json(); const supabase = await createServerSupabase()
  const { error } = await supabase.from("staff").update(body).eq("id", id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id"); const supabase = await createServerSupabase()
  const { error } = await supabase.from("staff").delete().eq("id", id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
