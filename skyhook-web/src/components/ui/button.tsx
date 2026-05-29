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
          "relative inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer",
          {
            "bg-[#313131] text-white hover:bg-black active:scale-[0.98]":
              variant === "primary",
            "bg-gray-100 text-[rgba(33,33,33,0.81)] hover:bg-gray-200":
              variant === "secondary",
            "bg-transparent text-[rgba(33,33,33,0.6)] hover:text-black":
              variant === "ghost",
            "border border-gray-300 text-[rgba(33,33,33,0.81)] hover:text-black hover:border-gray-400":
              variant === "outline",
            "bg-[#1B5E20] text-white hover:bg-[#145518] active:scale-[0.98]":
              variant === "gold",
          },
          {
            "px-4 py-2 text-sm rounded-full": size === "sm",
            "px-6 py-3 text-base rounded-full": size === "md",
            "px-8 py-4 text-lg rounded-full": size === "lg",
            "px-10 py-5 text-xl rounded-full": size === "xl",
          },
          "disabled:opacity-50 disabled:cursor-not-allowed",
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
