"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCheck, Loader2, Sparkles, ShoppingBag, Award, Calendar, Info } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { createClient } from "@/lib/supabase"
import Link from "next/link"

type Notification = {
  id: string
  title: string
  body: string | null
  type: string
  is_read: boolean
  created_at: string
}

const typeIcons: Record<string, any> = {
  welcome: Sparkles, order: ShoppingBag, achievement: Award, event: Calendar, points: Award, reservation: Calendar,
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    ;(async () => {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      if (data.notifications) { setNotifications(data.notifications); setUnread(data.unread) }
      setLoading(false)
    })()

    const sub = supabase.channel("notifications").on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => {
      fetch("/api/notifications").then(r => r.json()).then(d => {
        if (d.notifications) { setNotifications(d.notifications); setUnread(d.unread) }
      })
    }).subscribe()

    const handleClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", handleClick)
    return () => { document.removeEventListener("mousedown", handleClick); supabase.removeChannel(sub) }
  }, [])

  async function markAllRead() {
    const ids = notifications.filter(n => !n.is_read).map(n => n.id)
    if (ids.length === 0) return
    await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ ids }) })
    setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    setUnread(0)
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h`
    return `${Math.floor(h / 24)}d`
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 text-white/60 hover:text-white transition-colors relative">
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 z-50"
          >
            <GlassCard className="p-0 overflow-hidden max-h-[400px] flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-skyhook-amber hover:text-skyhook-gold flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              {loading ? (
                <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-skyhook-amber mx-auto" /></div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-white/20 text-xs">No notifications yet</div>
              ) : (
                <div className="overflow-y-auto flex-1">
                  {notifications.slice(0, 20).map((n) => {
                    const Icon = typeIcons[n.type] || Info
                    return (
                      <Link href="/profile" key={n.id} className={`flex items-start gap-3 p-3 hover:bg-white/5 transition-colors ${!n.is_read ? "bg-skyhook-amber/5" : ""}`} onClick={() => setOpen(false)}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.is_read ? "bg-skyhook-amber/20" : "bg-white/5"}`}>
                          <Icon className={`w-4 h-4 ${!n.is_read ? "text-skyhook-amber" : "text-white/30"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!n.is_read ? "text-white font-medium" : "text-white/50"}`}>{n.title}</p>
                          {n.body && <p className="text-[10px] text-white/30 truncate">{n.body}</p>}
                          <p className="text-[10px] text-white/20 mt-0.5">{timeAgo(n.created_at)}</p>
                        </div>
                        {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-skyhook-amber flex-shrink-0 mt-1.5" />}
                      </Link>
                    )
                  })}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
