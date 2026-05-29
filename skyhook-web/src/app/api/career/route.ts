import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const body = await req.json()
    const { full_name, email, phone, position, message } = body

    if (!full_name || !email || !position) {
      return NextResponse.json({ error: "Name, email, and position are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("job_applications")
      .insert({ full_name, email, phone, position, message })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ application: data })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ applications: data })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ application: data })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
