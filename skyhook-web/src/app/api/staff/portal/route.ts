import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const [staffRes, tasksRes, shiftsRes] = await Promise.all([
    supabase.from("staff").select("*, users(email), outlets(name)").limit(20),
    supabase.from("staff_tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("staff_shifts").select("*, staff(role)").order("clock_in", { ascending: false }).limit(20),
  ])

  return NextResponse.json({
    currentUser: user,
    staff: staffRes.data || [],
    tasks: tasksRes.data || [],
    shifts: shiftsRes.data || [],
  })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { action, staff_id, outlet_id, task_id, status } = await req.json()

    if (action === "clock-in") {
      const { data, error } = await supabase.from("staff_shifts").insert({ staff_id, outlet_id, clock_in: new Date().toISOString() }).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data)
    }

    if (action === "clock-out") {
      const { data, error } = await supabase.from("staff_shifts").update({ clock_out: new Date().toISOString(), status: "completed" }).eq("staff_id", staff_id).is("clock_out", null).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data)
    }

    if (action === "update-task") {
      const { data, error } = await supabase.from("staff_tasks").update({ status }).eq("id", task_id).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }
}
