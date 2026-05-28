"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
}

export function GlassCard({
  className,
  children,
  glow = false,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl shadow-lg shadow-black/20 p-6",
        hover && "hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 transition-all duration-500 cursor-pointer",
        glow && "shadow-[0_0_40px_rgba(200,149,108,0.15),0_0_80px_rgba(200,149,108,0.05)]",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}
