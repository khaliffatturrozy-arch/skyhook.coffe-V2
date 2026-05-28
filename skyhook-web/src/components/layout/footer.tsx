"use client"

import Link from "next/link"
import { ROUTES } from "@/config"
import { Camera, MessageCircle, Music, MapPin, Mail, Phone, Video } from "lucide-react"

const footerLinks = {
  Explore: [
    { label: "Menu", href: ROUTES.menu },
    { label: "Rooftop", href: ROUTES.rooftop },
    { label: "Events", href: ROUTES.events },
    { label: "Community", href: ROUTES.community },
    { label: "Leaderboard", href: ROUTES.leaderboard },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Franchise", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Support: [
    { label: "FAQ", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Accessibility", href: "#" },
  ],
}

const socialLinks = [
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Video, href: "#", label: "YouTube" },
  { icon: Music, href: "#", label: "TikTok" },
]

export function Footer() {
  return (
    <footer className="bg-skyhook-charcoal border-t border-white/5">
      <div className="section-padding py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <Link href={ROUTES.home} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-skyhook-amber to-skyhook-orange flex items-center justify-center">
                <span className="text-skyhook-black font-bold text-lg">S</span>
              </div>
              <span className="font-heading text-xl font-bold tracking-wider">
                <span className="text-white">SKYHOOK</span>
                <span className="text-skyhook-amber">.</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-sm">
              A next-generation luxury hospitality technology company. 
              Premium rooftop lifestyle experiences powered by AI.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-skyhook-amber hover:border-skyhook-amber/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-skyhook-amber text-sm transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-white/30 text-xs">
            <span>&copy; {new Date().getFullYear()} Skyhook Coffee. All rights reserved.</span>
            <span className="hidden md:inline">|</span>
            <span>Powered by AI · Inspired by the night</span>
          </div>
          <div className="flex items-center gap-4 text-white/30 text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Jakarta · Bali · Bandung
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> hello@skyhookcoffee.com
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
