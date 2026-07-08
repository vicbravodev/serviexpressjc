import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link as LocaleLink, getPathname } from "@/i18n/navigation"
import type { ContentHref } from "@/i18n/routing"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FleetImage } from "@/components/fleet-image"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { FaqBlock } from "@/components/seo/faq-block"
import { getPageContent, type Section } from "@/content"

function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold md:text-3xl">{section.h2}</h2>
      {section.paragraphs.map((p) => (
        <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
      {section.bullets && (
        <ul className="mt-5 space-y-3">
          {section.bullets.map((b) => (
            <li key={b.slice(0, 40)} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-accent" aria-hidden="true" />
              <span className="leading-relaxed text-foreground">{b}</span>
            </li>
          ))}
        </ul>
      )}
      {section.subsections?.map((sub) => (
        <div key={sub.h3} className="mt-8">
          <h3 className="text-xl font-semibold">{sub.h3}</h3>
          {sub.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="mt-3 leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
      ))}
    </section>
  )
}

/**
 * Template de página de contenido SEO (servicios y rutas). Server component:
 * todo el texto viaja en el HTML inicial. Reusa el lenguaje visual del sitio
 * (banda oscura tipo sala de control + secciones claras).
 */
export async function ContentPage({ href, locale }: { href: ContentHref; locale: string }) {
  const c = getPageContent(href, locale)
  const t = await getTranslations({ locale, namespace: "ContentPage" })
  const quoteHref = `${getPathname({ locale: locale as "es" | "en", href: "/" })}#cotizacion`.replace("//", "/")

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Banda oscura de apertura: garantiza contraste del header transparente */}
        <section className="relative overflow-hidden bg-[oklch(0.12_0.01_240)] pb-16 pt-36">
          <div className="absolute inset-0 bg-blueprint opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" aria-hidden="true" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <Breadcrumbs locale={locale} current={{ label: c.breadcrumb }} />
              <span className="mt-8 inline-block font-mono text-xs uppercase tracking-[0.22em] text-yellow-accent-bright">
                {c.kicker}
              </span>
              <h1 className="mt-3 text-3xl font-bold leading-[1.1] text-white text-balance md:text-5xl">{c.h1}</h1>
              {c.intro.map((p) => (
                <p key={p.slice(0, 40)} className="mt-5 max-w-3xl text-lg leading-relaxed text-white/80">
                  {p}
                </p>
              ))}
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button size="lg" className="group bg-secondary px-7 hover:bg-secondary/90" asChild>
                  <Link href={quoteHref}>
                    {t("ctaButton")}
                    <ArrowRight className="ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5" size={18} />
                  </Link>
                </Button>
                <span className="font-mono text-xs uppercase tracking-wide text-white/60">{t("ctaNote")}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <article className="mx-auto max-w-4xl pb-24">
            <div className="relative mt-12 overflow-hidden rounded-2xl border border-border">
              <FleetImage src={c.image.src} alt={c.image.alt} className="aspect-[16/8] w-full" />
            </div>

            {c.sections.map((section) => (
              <SectionBlock key={section.h2} section={section} />
            ))}

            <FaqBlock locale={locale} faqs={c.faqs} />

            {/* CTA de cierre */}
            <section className="mt-16 overflow-hidden rounded-2xl border border-white/10 surface-steel">
              <div className="px-8 py-10 text-center sm:px-12">
                <h2 className="text-2xl font-bold text-white md:text-3xl">{t("ctaTitle")}</h2>
                <p className="mx-auto mt-3 max-w-xl leading-relaxed text-white/75">{t("ctaDescription")}</p>
                <Button size="lg" className="group mt-6 bg-secondary px-8 hover:bg-secondary/90" asChild>
                  <Link href={quoteHref}>
                    {t("ctaButton")}
                    <ArrowRight className="ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5" size={18} />
                  </Link>
                </Button>
              </div>
            </section>

            {/* Enlaces internos contextuales */}
            <section className="mt-16">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {t("relatedKicker")}
              </span>
              <h2 className="mt-2 text-2xl font-bold">{t("relatedTitle")}</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {c.related.map((r) => (
                  <LocaleLink
                    key={r.href}
                    href={r.href}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-6 py-5 font-medium transition-colors hover:border-yellow-accent/60"
                  >
                    <span>{r.label}</span>
                    <ArrowRight size={16} className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-yellow-accent" />
                  </LocaleLink>
                ))}
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
