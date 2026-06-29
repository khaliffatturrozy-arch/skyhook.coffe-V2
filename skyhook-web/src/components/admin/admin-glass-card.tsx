"use client"

import { motion } from "framer-motion"

interface AdminGlassCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  noPadding?: boolean
}

export function AdminGlassCard({ children, className = "", delay = 0, noPadding = false }: AdminGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05, duration: 0.4 }}
      className={`relative group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-3xl" />
      <div className={`relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-3xl border border-white/10 ${noPadding ? "" : "p-5"} transition-all duration-300 hover:border-white/20`}>
        {children}
      </div>
    </motion.div>
  )
}

export function AdminGlassTable({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] rounded-3xl border border-white/10 overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function AdminSectionHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h1>
        {description && <p className="text-white/40 text-sm mt-1">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}

export function AdminSearchBar({ value, onChange, placeholder = "Search..." }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all"
      />
    </div>
  )
}
