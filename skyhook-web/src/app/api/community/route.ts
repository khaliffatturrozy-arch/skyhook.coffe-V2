import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const [groupsRes, postsRes] = await Promise.all([
      supabase.from("community_groups").select("*").order("member_count", { ascending: false }),
      supabase.from("community_posts").select("*, users(full_name, membership_tier)").order("created_at", { ascending: false }).limit(20),
    ])
    return NextResponse.json({ groups: groupsRes.data || [], posts: postsRes.data || [] })
  } catch (error) {
    console.error("Community fetch error:", error)
    return NextResponse.json({ error: "Failed to load community data" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { group_id, content } = await req.json()
    if (!group_id || !content) {
      return NextResponse.json({ error: "Missing group_id or content" }, { status: 400 })
    }
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: post, error } = await supabase.from("community_posts").insert({
      user_id: user?.id || null,
      group_id,
      content,
    }).select().single()
    if (error) throw error
    return NextResponse.json({ post })
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
