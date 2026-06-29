"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/utils/cn"

const colorConfig = {
  amber: { icon: "bg-amber-500/10 text-amber-400", gradient: "from-amber-500/10 via-amber-400/5 to-transparent", border: "border-amber-500/20", badgeUp: "bg-amber-500/10 text-amber-400", badgeDown: "bg-red-500/10 text-red-400" },
  emerald: { icon: "bg-emerald-500/10 text-emerald-400", gradient: "from-emerald-500/10 via-emerald-400/5 to-transparent", border: "border-emerald-500/20", badgeUp: "bg-emerald-500/10 text-emerald-400", badgeDown: "bg-red-500/10 text-red-400" },
  blue: { icon: "bg-blue-500/10 text-blue-400", gradient: "from-blue-500/10 via-blue-400/5 to-transparent", border: "border-blue-500/20", badgeUp: "bg-blue-500/10 text-blue-400", badgeDown: "bg-red-500/10 text-red-400" },
  violet: { icon: "bg-violet-500/10 text-violet-400", gradient: "from-violet-500/10 via-violet-400/5 to-transparent", border: "border-violet-500/20", badgeUp: "bg-violet-500/10 text-violet-400", badgeDown: "bg-red-500/10 text-red-400" },
  rose: { icon: "bg-rose-500/10 text-rose-400", gradient: "from-rose-500/10 via-rose-400/5 to-transparent", border: "border-rose-500/20", badgeUp: "bg-rose-500/10 text-rose-400", badgeDown: "bg-red-500/10 text-red-400" },
  cyan: { icon: "bg-cyan-500/10 text-cyan-400", gradient: "from-cyan-500/10 via-cyan-400/5 to-transparent", border: "border-cyan-500/20", badgeUp: "bg-cyan-500/10 text-cyan-400", badgeDown: "bg-red-500/10 text-red-400" },
}

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ReactNode
  color?: "amber" | "emerald" | "blue" | "violet" | "rose" | "cyan"
  delay?: number
  size?: "sm" | "md" | "lg"
}

export function AdminStatsCard({ title, value, subtitle, change, trend, icon, color = "amber", delay = 0, size = "md" }: StatsCardProps) {
  const cc = colorConfig[color]
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-[20px]" />
      <div className={cn(
        "relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[20px] border border-white/10 transition-all duration-300 hover:border-white/20 overflow-hidden",
        size === "sm" ? "p-4" : size === "lg" ? "p-6" : "p-5",
      )}>
        <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-30 rounded-full blur-3xl pointer-events-none", cc.gradient)} />
        
        <div className="flex items-start justify-between mb-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl border border-white/5", cc.icon)}>
            {icon}
          </div>
          {change && (
            <span className={cn(
              "flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xl",
              trend === "up" ? cc.badgeUp : trend === "down" ? cc.badgeDown : "bg-white/5 text-white/40"
            )}>
              <TrendIcon className="w-3 h-3" />
              {change}
            </span>
          )}
        </div>
        
        <p className={cn(
          "font-bold text-white tracking-tight mb-0.5",
          size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl"
        )}>{value}</p>
        <p className="text-white/40 text-xs font-medium">{title}</p>
        {subtitle && <p className="text-white/20 text-[10px] mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  )
}

export function AdminiOSWidget({ children, className, delay = 0, size = "normal" }: { children: React.ReactNode; className?: string; delay?: number; size?: "normal" | "tall" | "wide" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative group",
        size === "tall" ? "row-span-2" : size === "wide" ? "col-span-2" : "",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-[20px]" />
      <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[20px] border border-white/10 p-5 transition-all duration-300 hover:border-white/20 h-full">
        {children}
      </div>
    </motion.div>
  )
}
