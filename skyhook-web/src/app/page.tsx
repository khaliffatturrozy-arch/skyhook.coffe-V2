import { HeroSection } from "@/components/landing/hero-section"
import { MenuPreview } from "@/components/landing/menu-preview"
import { EventSlider } from "@/components/landing/event-slider"
import { ExperienceSection } from "@/components/landing/experience-section"
import { RooftopShowcase } from "@/components/landing/rooftop-showcase"
import { MembershipSection } from "@/components/landing/membership-section"
import { LeaderboardPreview } from "@/components/landing/leaderboard-preview"
import { LocationsSection } from "@/components/landing/locations-section"
import { CTASection } from "@/components/landing/cta-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <MenuPreview />
      <EventSlider />
      <ExperienceSection />
      <RooftopShowcase />
      <MembershipSection />
      <LeaderboardPreview />
      <LocationsSection />
      <CTASection />
    </>
  )
}
