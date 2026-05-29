"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { ROUTES } from "@/config"
import { NotificationBell } from "@/components/layout/notification-bell"
import { CartBadge } from "@/components/cart/cart-drawer"

const navLinks = [
  { href: ROUTES.home, label: "Home" },
  { href: "/reservasi", label: "Reservation" },
  { href: "/contact", label: "Contact" },
  { href: "/location", label: "Location" },
  { href: "/about", label: "About Us" },
  { href: "/career", label: "Career" },
  { href: "/investor", label: "Investor" },
  { href: "/skyteam", label: "Our Team" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userAvatar, setUserAvatar] = useState("")
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    (async () => {
      const supabase = (await import("@/lib/supabase")).createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      if (session?.user) {
        const { data } = await supabase.from("users").select("full_name, avatar_url").eq("id", session.user.id).single()
        if (data) { setUserName(data.full_name); setUserAvatar(data.avatar_url || "") }
      }
    })()
  }, [])

  useEffect(() => {
    if (isMobileOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [isMobileOpen])

  const logoUrl = "https://brdsg.com/img/100/brsl50twbrtoukb1wa_1/C41QqkoZG0OFCglC41P1qNGZiZVRYRfm2Ydco2AcSZw.png"

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-white/95 backdrop-blur-md shadow-sm transition-shadow navbar-safe",
        isScrolled && "shadow-md"
      )}>
        <div className="h-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 lg:px-16">
          <Link href={ROUTES.home} className="flex items-center shrink-0">
            <img src={logoUrl} alt="Skyhook Coffee" className="w-7 h-7 md:w-9 md:h-9 object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors group",
                  pathname === link.href
                    ? "text-black"
                    : "text-[rgba(33,33,33,0.7)] hover:text-black"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute bottom-0 left-2 right-2 h-[2px] bg-black transition-transform origin-left",
                  pathname === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )} />
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {isLoggedIn && (
              <div className="flex items-center mr-2">
                <div className="hidden sm:block mr-1">
                  <CartBadge />
                </div>
                <NotificationBell />
              </div>
            )}
            <Link href={isLoggedIn ? "/profile" : "/auth"}>
              <Button variant="primary" size="sm" className="hidden sm:inline-flex bg-[#313131] hover:bg-black text-white border-none rounded-full px-4 gap-2">
                {isLoggedIn && userAvatar ? (
                  <img src={userAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                {isLoggedIn && userName ? userName.split(" ")[0] : "Sign In"}
              </Button>
            </Link>
            <div className="flex items-center lg:hidden ml-1">
              {isLoggedIn && <CartBadge />}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="p-2 text-[rgba(33,33,33,0.6)] hover:text-black transition-colors"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                <img src={logoUrl} alt="Skyhook Coffee" className="w-7 h-7 object-contain" />
                <div className="flex items-center">
                  {isLoggedIn && <CartBadge />}
                  <button onClick={() => setIsMobileOpen(false)} className="p-2 ml-1 text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="px-3 py-4 space-y-1 overflow-y-auto" style={{ height: "calc(100% - 64px)" }}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.href.startsWith("http") ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        onClick={() => setIsMobileOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm font-medium text-[rgba(33,33,33,0.81)] hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                          pathname === link.href
                            ? "text-black bg-gray-100 font-semibold"
                            : "text-[rgba(33,33,33,0.81)] hover:text-black hover:bg-gray-50"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                  {isLoggedIn ? (
                    <>
                      <Link href={ROUTES.profile} onClick={() => setIsMobileOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm font-medium text-[rgba(33,33,33,0.81)] hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link href={ROUTES.achievements} onClick={() => setIsMobileOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm font-medium text-[rgba(33,33,33,0.81)] hover:text-black hover:bg-gray-50 transition-colors"
                      >
                        Achievements
                      </Link>
                    </>
                  ) : null}
                  <Link href={isLoggedIn ? "/profile" : ROUTES.auth} onClick={() => setIsMobileOpen(false)} className="block pt-2">
                    <Button variant="primary" className="w-full bg-[#313131] hover:bg-black text-white border-none rounded-full gap-2">
                      {isLoggedIn && userAvatar ? (
                        <img src={userAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      {isLoggedIn && userName ? userName : "Sign In"}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
