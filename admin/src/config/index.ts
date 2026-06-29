export const SKYHOOK_CONFIG = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  ROUTES: {
    admin: {
      dashboard: "/admin/dashboard",
      orders: "/admin/orders",
      menu: "/admin/menu",
      events: "/admin/events",
      inventory: "/admin/inventory",
      analytics: "/admin/analytics",
      outlets: "/admin/outlets",
      staff: "/admin/staff",
      customers: "/admin/customers",
      payments: "/admin/payments",
      waiterCalls: "/admin/waiter-calls",
      cms: "/admin/cms",
      career: "/admin/career",
    },
  },
}
