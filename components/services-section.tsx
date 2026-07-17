import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { ContentHref } from "@/i18n/routing"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
import { FleetImage } from "@/components/fleet-image"

const zoneIndexes = [0, 1, 2, 3]

/** Cada tag de carga especializada enlaza a su página de servicio. */
const specializedHrefs: ContentHref[] = [
  "/transporte-de-acero",
  "/plataforma",
  "/caja-seca-53",
  "/carga-sobredimensionada",
]

const routeHrefs: ContentHref[] = [
  "/rutas/monterrey-laredo",
  "/rutas/monterrey-houston",
  "/rutas/monterrey-dallas",
  "/rutas/monterrey-cdmx",
]

export function ServicesSection() {
  const t = useTranslations("Services")

  return (
    <section id="servicios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <Reveal className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("kicker")}</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            {t("subtitle")}
          </p>
        </Reveal>

        <RevealGroup className="mb-10 grid gap-8 lg:grid-cols-2">
          {/* Nacional */}
          <RevealChild className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-xl">
              <div className="relative aspect-[16/9] overflow-hidden">
                <FleetImage
                  src="/fleet/transporte-nacional.jpg"
                  alt={t("national.imageAlt")}
                  caption={t("national.imageCaption")}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-accent-bright" /> {t("national.badge")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-2xl font-bold">{t("national.title")}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {t("national.description")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {zoneIndexes.map((i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
                    >
                      {t(`national.zones.${i}`)}
                    </span>
                  ))}
                </div>
                <Button variant="outline" className="mt-6 w-full bg-transparent" asChild>
                  <Link href="/transporte-nacional">
                    {t("national.cta")}
                    <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
            </article>
          </RevealChild>

          {/* Internacional */}
          <RevealChild className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-xl">
              <div className="relative aspect-[16/9] overflow-hidden">
                <FleetImage
                  src="/fleet/cruce-usa.jpg"
                  alt={t("international.imageAlt")}
                  caption={t("international.imageCaption")}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-accent-bright" /> {t("international.badge")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-2xl font-bold">{t("international.title")}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {t("international.description")}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {zoneIndexes.map((i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
                    >
                      {t(`international.zones.${i}`)}
                    </span>
                  ))}
                </div>
                <Button className="mt-6 w-full bg-secondary hover:bg-secondary/90" asChild>
                  <Link href="/transporte-internacional-mexico-usa">
                    {t("international.cta")}
                    <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
            </article>
          </RevealChild>
        </RevealGroup>

        {/* Versatilidad de carga */}
        <Reveal>
          <div className="grid items-stretch overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-2">
            <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[360px]">
              <FleetImage
                src="/fleet/carga-acero.jpg"
                alt={t("specialized.imageAlt")}
                caption={t("specialized.imageCaption")}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {t("specialized.kicker")}
              </span>
              <h3 className="mt-3 text-2xl font-bold">{t("specialized.title")}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t("specialized.description")}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    href={specializedHrefs[i]}
                    className="group/tag flex items-center gap-2 text-sm"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-accent" />
                    <span className="text-foreground underline-offset-4 transition-colors group-hover/tag:text-yellow-accent group-hover/tag:underline">
                      {t(`specialized.tags.${i}`)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Rutas long-tail: enlaces descriptivos a las páginas de ruta */}
        <Reveal className="mt-10">
          <div className="rounded-2xl border border-border bg-card p-7 sm:p-8">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {t("routes.kicker")}
            </span>
            <h3 className="mt-2 text-2xl font-bold">{t("routes.title")}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {routeHrefs.map((href, i) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3.5 text-sm font-medium transition-colors hover:border-yellow-accent/60"
                >
                  <span>{t(`routes.items.${i}`)}</span>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-yellow-accent"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
