import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { SITE_URL } from "@/lib/site"
import { PartnerHero } from "@/components/partner-hero"
import { PartnerBenefitsSection } from "@/components/partner-benefits-section"
import { PartnerLeadForm } from "@/components/partner-lead-form"
import { Footer } from "@/components/footer"

type Props = { params: Promise<{ locale: string }> }

// Página de campaña: no forma parte del sistema de contenido genérico ni del
// menú principal (tráfico llega directo por ads/WhatsApp), así que no se
// registra en i18n/routing.ts ni en sitemap.ts, y va noindex a propósito.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Partners" })
  const path = locale === "es" ? "/socios" : `/${locale}/socios`

  return {
    metadataBase: new URL(SITE_URL),
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${SITE_URL}${path}` },
    robots: { index: false, follow: false },
  }
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen">
      <header className="absolute inset-x-0 top-0 z-20 py-6">
        <div className="container mx-auto px-4">
          <Image src="/logo-white-bg.png" alt="ServiExpress JC" width={160} height={56} className="h-11 w-auto" priority />
        </div>
      </header>
      <main>
        <PartnerHero />
        <PartnerBenefitsSection />
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-xl">
              <PartnerLeadForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
