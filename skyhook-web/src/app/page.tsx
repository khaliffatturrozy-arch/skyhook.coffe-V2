"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { ExperienceSection } from "@/components/landing/experience-section"
import { MenuPreview } from "@/components/landing/menu-preview"
import { RooftopShowcase } from "@/components/landing/rooftop-showcase"
import { EventSlider } from "@/components/landing/event-slider"
import { LeaderboardPreview } from "@/components/landing/leaderboard-preview"
import { MembershipSection } from "@/components/landing/membership-section"
import { AIAssistant } from "@/components/ai/ai-assistant"
import { LocationsSection } from "@/components/landing/locations-section"
import { CTASection } from "@/components/landing/cta-section"

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <ExperienceSection />
      <MenuPreview />
      <RooftopShowcase />
      <EventSlider />
      <LeaderboardPreview />
      <MembershipSection />
      <LocationsSection />
      <CTASection />
      <AIAssistant />
    </div>
  )
}
