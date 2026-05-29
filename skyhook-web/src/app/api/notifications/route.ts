import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ notifications: [] })

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
    if (error) throw error

    const unread = data?.filter(n => !n.is_read).length || 0
    return NextResponse.json({ notifications: data || [], unread })
  } catch (error) {
    console.error("Notifications error:", error)
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { ids } = await req.json()
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", ids)
      .eq("user_id", user.id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mark read error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
