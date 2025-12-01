import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingAbout } from "@/components/landing/landing-about"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background scroll-smooth">
      <LandingHeader />
      <main id="home" className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingAbout />
      </main>
      <LandingFooter />
    </div>
  )
}
