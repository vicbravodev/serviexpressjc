import { setRequestLocale } from "next-intl/server"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { CoverageSection } from "@/components/coverage-section"
import { CertificationsSection } from "@/components/certifications-section"
import { TalleresSection } from "@/components/talleres-section"
import { AboutSection } from "@/components/about-section"
import { SocialProofSection } from "@/components/social-proof-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <CoverageSection />
        <CertificationsSection />
        <TalleresSection />
        <AboutSection />
        <SocialProofSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
