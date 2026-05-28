"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/utils/cn"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "gold"
  size?: "sm" | "md" | "lg" | "xl"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl overflow-hidden group cursor-pointer",
          {
            "bg-gradient-to-r from-skyhook-amber to-skyhook-orange text-white hover:opacity-90 hover:shadow-lg hover:shadow-skyhook-amber/25 active:scale-[0.98]":
              variant === "primary",
            "glass glass-hover text-white/80 hover:text-white":
              variant === "secondary",
            "bg-transparent text-white/60 hover:text-white hover:bg-white/5":
              variant === "ghost",
            "border border-white/20 text-white/80 hover:text-white hover:border-skyhook-amber/50 hover:bg-white/5":
              variant === "outline",
            "bg-gradient-to-r from-skyhook-gold to-skyhook-amber text-skyhook-black font-semibold hover:shadow-lg hover:shadow-skyhook-gold/25 active:scale-[0.98]":
              variant === "gold",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
            "px-10 py-5 text-xl": size === "xl",
          },
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button }
export type { ButtonProps }
