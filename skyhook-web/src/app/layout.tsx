import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { CartDrawer } from "@/components/cart/cart-drawer"

export const metadata: Metadata = {
  title: "Skyhook Coffee — Premium Rooftop Hospitality Ecosystem",
  description: "A next-generation luxury hospitality technology company. Premium rooftop lifestyle ecosystem powered by AI.",
  keywords: ["coffee", "rooftop", "jakarta", "premium", "skyhook", "cafe", "nightlife"],
  openGraph: { title: "Skyhook Coffee", description: "Premium Rooftop Hospitality Ecosystem", type: "website" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-skyhook-black text-white antialiased">
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
      </body>
    </html>
  )
}
