import type { Metadata } from "next"
import "@/styles/globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Skyhook Coffee | Next-Generation Luxury Hospitality",
  description: "A next-generation luxury hospitality technology company. Premium rooftop lifestyle ecosystem powered by AI.",
  keywords: ["skyhook coffee", "rooftop", "luxury", "hospitality", "coffee", "jakarta", "bali"],
  openGraph: {
    title: "Skyhook Coffee | Next-Generation Luxury Hospitality",
    description: "Premium rooftop lifestyle ecosystem powered by AI",
    type: "website",
    locale: "en_US",
    siteName: "Skyhook Coffee",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-skyhook-black">
        <Navbar />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
