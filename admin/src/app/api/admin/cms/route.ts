import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data } = await supabase.from("cms_sections").select("*").order("sort_order")
  return NextResponse.json(data || [])
}
export async function POST(req: NextRequest) {
  const body = await req.json(); const supabase = await createServerSupabase()
  const { error } = await supabase.from("cms_sections").insert(body)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
export async function PUT(req: NextRequest) {
  const { id, ...body } = await req.json(); const supabase = await createServerSupabase()
  const { error } = await supabase.from("cms_sections").update(body).eq("id", id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
