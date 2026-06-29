import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase()
  if (req.nextUrl.searchParams.get("categories")) {
    const { data } = await supabase.from("categories").select("*").order("sort_order")
    return NextResponse.json(data || [])
  }
  const { data } = await supabase.from("menu").select("*, category:categories(name)").order("sort_order")
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = await createServerSupabase()
  const { error } = await supabase.from("menu").insert(body)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}

export async function PUT(req: NextRequest) {
  const { id, ...body } = await req.json()
  const supabase = await createServerSupabase()
  const { error } = await supabase.from("menu").update(body).eq("id", id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id")
  const supabase = await createServerSupabase()
  const { error } = await supabase.from("menu").delete().eq("id", id)
  return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ success: true })
}
