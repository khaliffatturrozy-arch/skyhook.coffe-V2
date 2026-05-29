import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || ""
    const supabase = await createServerSupabase()

    let query = supabase.from("users").select("id, full_name, email, phone, membership_tier, total_orders, total_spent, last_visit, created_at").limit(100)

    const { data: users, error } = await query
    if (error) throw error

    let filtered = users || []
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter((u) => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
    }

    return NextResponse.json({ customers: filtered })
  } catch (error) {
    console.error("Admin customers error:", error)
    return NextResponse.json({ error: "Failed to load customers" }, { status: 500 })
  }
}
