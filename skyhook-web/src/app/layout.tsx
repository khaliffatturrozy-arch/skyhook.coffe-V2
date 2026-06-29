import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import { AuthRedirectHandler } from "@/components/auth-redirect-handler"

const Navbar = dynamic(() => import("@/components/layout/navbar").then((m) => m.Navbar))
const Footer = dynamic(() => import("@/components/layout/footer").then((m) => m.Footer))
const CartDrawer = dynamic(() => import("@/components/cart/cart-drawer").then((m) => m.CartDrawer))

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-nunito",
})

const faviconUrl = "https://brdsg.com/img/32/brsl50twbrtoukb1wa_1/C41QqkoZG0OFCglC41P1qNGZiZVRYRfm2Ydco2AcSZw.png"

export const metadata: Metadata = {
  title: "Skyhook Coffee House & Kitchen",
  description: "Coffee Shop Rooftop Live Music Terviral Se-Jakarta Timur",
  keywords: ["coffee", "rooftop", "jakarta", "skyhook", "cafe", "live music"],
  openGraph: { title: "Skyhook Coffee House & Kitchen", description: "Coffee Shop Rooftop Live Music Terviral Se-Jakarta Timur", type: "website" },
  icons: { icon: faviconUrl, apple: faviconUrl },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[rgba(33,33,33,0.81)] antialiased">
          <Suspense><AuthRedirectHandler /></Suspense>
          <Navbar />
          {children}
          <Footer />
          <Suspense><CartDrawer /></Suspense>
      </body>
    </html>
  )
}
