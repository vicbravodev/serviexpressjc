import { getTranslations, setRequestLocale } from "next-intl/server"
import { localeParam } from "@/i18n/routing"
import { JsonLd } from "@/components/seo/json-ld"
import { localBusinessSchema } from "@/lib/schema"
import { yearsInService } from "@/lib/site"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { EvidenceSection } from "@/components/evidence-section"
import { ServicesSection } from "@/components/services-section"
import { CoverageLazy } from "@/components/coverage-lazy"
import { TalleresSection } from "@/components/talleres-section"
import { AboutSection } from "@/components/about-section"
import { CTASection } from "@/components/cta-section"
import { LocationSection } from "@/components/location-section"
import { Footer } from "@/components/footer"

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await localeParam(params)
  setRequestLocale(locale)
  const tMeta = await getTranslations({ locale, namespace: "Metadata" })
  const years = yearsInService()
  return (
    <div className="min-h-screen">
      <JsonLd data={localBusinessSchema(tMeta("description", { years }))} />
      <Header />
      <main>
        <HeroSection />
        <EvidenceSection years={years} />
        <ServicesSection />
        <CoverageLazy />
        <TalleresSection />
        <AboutSection />
        <CTASection />
        <LocationSection />
      </main>
      <Footer />
    </div>
  )
}
