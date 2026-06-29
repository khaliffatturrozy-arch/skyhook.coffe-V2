import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function POST() {
  const supabase = await createServerSupabase()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Only allow if no admin exists yet
  const { data: hasAdmin } = await supabase.rpc("admin_exists")
  if (hasAdmin) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 403 })
  }

  // Get first outlet
  const { data: outlet } = await supabase.from("outlets").select("id").limit(1).maybeSingle()
  if (!outlet) {
    return NextResponse.json({ error: "No outlet found. Create an outlet first." }, { status: 400 })
  }

  const { error } = await supabase.from("staff").insert({
    user_id: session.user.id,
    outlet_id: outlet.id,
    role: "admin",
    is_active: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
