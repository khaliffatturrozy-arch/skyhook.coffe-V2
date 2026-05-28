"use client"

import { cn } from "@/utils/cn"
import { Crown, Star, Diamond, Award, Medal, User } from "lucide-react"
import type { MembershipTier } from "@/types"

const tierConfig: Record<MembershipTier, { icon: typeof Crown; color: string; bg: string }> = {
  "Skyhook Royalty": { icon: Crown, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  "VIP Elite": { icon: Diamond, color: "text-gray-300", bg: "bg-gray-300/10" },
  "Platinum": { icon: Star, color: "text-blue-200", bg: "bg-blue-200/10" },
  "Gold": { icon: Award, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  "Silver": { icon: Medal, color: "text-gray-400", bg: "bg-gray-400/10" },
  "Member": { icon: User, color: "text-amber-600", bg: "bg-amber-600/10" },
}

interface MembershipBadgeProps {
  tier: MembershipTier
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function MembershipBadge({ tier, size = "md", showLabel = true }: MembershipBadgeProps) {
  const config = tierConfig[tier]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium",
        config.bg,
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
          "px-4 py-1.5 text-base": size === "lg",
        },
      )}
    >
      <Icon className={cn(
        config.color,
        { "w-3 h-3": size === "sm", "w-4 h-4": size === "md", "w-5 h-5": size === "lg" },
      )} />
      {showLabel && <span className={config.color}>{tier}</span>}
    </div>
  )
}
