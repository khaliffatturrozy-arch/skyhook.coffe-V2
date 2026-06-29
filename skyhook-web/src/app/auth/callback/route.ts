import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const ROLE_ROUTES: Record<string, string> = {
  admin: "/admin",
  manager: "/admin",
  kitchen: "/kds",
  chef: "/kds",
  bartender: "/kds",
  server: "/staff",
  host: "/staff",
  cashier: "/pos",
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get("code")
  const next = searchParams.get("next") || searchParams.get("redirect")

  if (!code) {
    const errorUrl = new URL("/auth", origin)
    errorUrl.searchParams.set("error", "No authorization code found. Please try signing in again.")
    return NextResponse.redirect(errorUrl)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const errorUrl = new URL("/auth", origin)
    errorUrl.searchParams.set("error", error.message)
    return NextResponse.redirect(errorUrl)
  }

  if (next) {
    const decoded = decodeURIComponent(next)
    const allowedHosts = [process.env.NEXT_PUBLIC_SITE_URL, "https://skyhook-web-gamma.vercel.app", "http://localhost:3000"].filter(Boolean)
    const isSafe = decoded.startsWith("/") || allowedHosts.some((h) => h && decoded.startsWith(h))
    if (!isSafe) {
      const errorUrl = new URL("/auth", origin)
      errorUrl.searchParams.set("error", "Invalid redirect destination")
      return NextResponse.redirect(errorUrl)
    }
    redirect(decoded)
  }

  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  if (user) {
    const { data: staff } = await supabase
      .from("staff")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle()

    const staffRole = staff?.role as string | undefined
    if (staffRole && ROLE_ROUTES[staffRole]) {
      redirect(ROLE_ROUTES[staffRole])
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    const profileRole = profile?.role
    if (profileRole && profileRole !== "user" && ROLE_ROUTES[profileRole]) {
      redirect(ROLE_ROUTES[profileRole])
    }
  }

  redirect("/profile")
}
