import { cn } from "@/utils/cn"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  const variants: Record<string, string> = {
    primary: "bg-[#212121] text-white hover:bg-black",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    ghost: "text-[rgba(33,33,33,0.5)] hover:text-[#212121]",
  }
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-sm rounded-xl",
  }
  return (
    <button className={cn("font-medium transition-all duration-200 disabled:opacity-50", variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  )
}
