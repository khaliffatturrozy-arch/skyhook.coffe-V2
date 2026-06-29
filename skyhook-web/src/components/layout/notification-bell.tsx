"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCheck, Loader2, Sparkles, ShoppingBag, Award, Calendar, Info } from "lucide-react"
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

    const sub = supabase.channel("notifications").on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, (payload) => {
      if (payload.eventType === "INSERT") {
        setNotifications((prev) => [payload.new as Notification, ...prev].slice(0, 20))
        setUnread((prev) => prev + 1)
      }
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
      <button onClick={() => setOpen(!open)} className="p-2 text-[rgba(33,33,33,0.6)] hover:text-black transition-colors relative">
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
            <div className="p-0 overflow-hidden max-h-[400px] flex flex-col bg-white border border-gray-200 rounded-xl shadow-lg">
              <div className="flex items-center justify-between p-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-[#212121]">Notifications</h3>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-[#2196F3] hover:text-[#1976D2] flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              {loading ? (
                <div className="p-6 text-center"><Loader2 className="w-5 h-5 animate-spin text-[#2196F3] mx-auto" /></div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-300 text-xs">No notifications yet</div>
              ) : (
                <div className="overflow-y-auto flex-1">
                  {notifications.slice(0, 20).map((n) => {
                    const Icon = typeIcons[n.type] || Info
                    return (
                      <Link href="/profile" key={n.id} className={`flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors ${!n.is_read ? "bg-blue-50" : ""}`} onClick={() => setOpen(false)}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.is_read ? "bg-blue-100" : "bg-gray-100"}`}>
                          <Icon className={`w-4 h-4 ${!n.is_read ? "text-[#2196F3]" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${!n.is_read ? "text-[#212121] font-medium" : "text-gray-500"}`}>{n.title}</p>
                          {n.body && <p className="text-[10px] text-gray-400 truncate">{n.body}</p>}
                          <p className="text-[10px] text-gray-300 mt-0.5">{timeAgo(n.created_at)}</p>
                        </div>
                        {!n.is_read && <div className="w-1.5 h-1.5 rounded-full bg-[#2196F3] flex-shrink-0 mt-1.5" />}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
