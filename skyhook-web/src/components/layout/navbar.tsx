"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Search } from "lucide-react"
import { ROUTES } from "@/config"
import { NotificationBell } from "@/components/layout/notification-bell"
import { CartBadge } from "@/components/cart/cart-drawer"

const navLinks = [
  { href: ROUTES.home, label: "Home" },
  { href: ROUTES.menu, label: "Menu" },
  { href: ROUTES.rooftop, label: "Rooftop" },
  { href: ROUTES.events, label: "Events" },
  { href: ROUTES.leaderboard, label: "Leaderboard" },
  { href: ROUTES.community, label: "Community" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-skyhook-black/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent",
      )}
    >
      <nav className="flex items-center justify-between section-padding h-20">
        <Link href={ROUTES.home} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-skyhook-amber to-skyhook-orange flex items-center justify-center">
            <span className="text-skyhook-black font-bold text-lg">S</span>
          </div>
          <span className="font-heading text-xl font-bold tracking-wider hidden sm:block">
            <span className="text-white">SKYHOOK</span>
            <span className="text-skyhook-amber">.</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg",
                pathname === link.href
                  ? "text-skyhook-amber"
                  : "text-white/60 hover:text-white",
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-skyhook-amber to-skyhook-orange rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-white/60 hover:text-white transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <CartBadge />
          <NotificationBell />
          <Link href={ROUTES.auth}>
            <Button variant="primary" size="sm" className="hidden sm:inline-flex">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-white/60 hover:text-white transition-colors lg:hidden"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-skyhook-charcoal/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="section-padding py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-skyhook-amber/10 text-skyhook-amber"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href={ROUTES.profile} onClick={() => setIsMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                <User className="w-4 h-4 inline mr-2" />Profile
              </Link>
              <Link href={ROUTES.achievements} onClick={() => setIsMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                Achievements
              </Link>
              <Link href={ROUTES.auth} onClick={() => setIsMobileOpen(false)}>
                <Button variant="primary" className="w-full mt-4">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
