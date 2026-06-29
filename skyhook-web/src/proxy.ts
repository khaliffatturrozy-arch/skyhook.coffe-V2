import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const ADMIN_ROUTES = ["/admin", "/admin/dashboard", "/admin/orders", "/admin/menu", "/admin/events", "/admin/inventory", "/admin/analytics", "/admin/outlets", "/admin/staff", "/admin/cms", "/admin/customers", "/admin/payments", "/admin/waiter-calls", "/admin/career", "/admin/reservations", "/admin/packages", "/admin/gallery"]
const PROTECTED_ROUTES = [...ADMIN_ROUTES, "/pos", "/pos/dashboard", "/pos/members", "/kds", "/staff", "/waiter", "/profile", "/wallet", "/dashboard", "/achievements"]
const ADMIN_ONLY = ["/admin", "/admin/dashboard", "/admin/orders", "/admin/menu", "/admin/events", "/admin/inventory", "/admin/analytics", "/admin/outlets", "/admin/staff", "/admin/cms", "/admin/customers", "/admin/payments", "/admin/waiter-calls", "/admin/career", "/admin/reservations", "/admin/packages", "/admin/gallery"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))
  if (!isProtected) return NextResponse.next()

  const isAdminRoute = ADMIN_ONLY.some((route) => pathname === route || pathname.startsWith(route + "/"))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    const role = profile?.role
    if (!role || role === "user") {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|auth/callback|auth).*)",
  ],
}
