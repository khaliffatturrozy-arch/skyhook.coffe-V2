import { cn } from "@/utils/cn"

export function GlassCard({ className, children, ...rest }: { className?: string; children: React.ReactNode; [key: string]: any }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5", className)} {...rest}>
      {children}
    </div>
  )
}
