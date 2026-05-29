import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartDrawer } from "@/components/cart/cart-drawer"

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
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-[rgba(33,33,33,0.81)] antialiased">
          <Navbar />
          <div className="pb-14 lg:pb-0 flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <CartDrawer />
      </body>
    </html>
  )
}
