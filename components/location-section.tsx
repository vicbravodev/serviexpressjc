import { MapPin, Phone, Mail, Navigation } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { TrackedLink } from "@/components/tracked-link"
import { Reveal } from "@/components/motion-primitives"
import {
  CONTACT_EMAIL,
  contactPhone,
  mapsDirectionsUrl,
  mapsEmbedUrl,
} from "@/lib/site"

export function LocationSection() {
  const t = useTranslations("Location")
  const locale = useLocale()
  const phone = contactPhone(locale)

  return (
    <section id="ubicacion" className="scroll-mt-28 py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mx-auto grid max-w-6xl items-stretch gap-8 lg:grid-cols-2">
          {/* Mapa embebido de la sede */}
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 lg:order-1 lg:aspect-auto">
            <iframe
              title={t("mapAlt")}
              src={mapsEmbedUrl(locale)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
            <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[11px] text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-accent-bright animate-live-blink" />
              <span className="rounded-md border border-white/15 bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                {t("cityCaption")}
              </span>
            </div>
          </div>

          {/* Datos de la sede */}
          <div className="order-1 flex flex-col justify-center lg:order-2">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {t("kicker")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-balance md:text-5xl">{t("title")}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {t("description")}
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" strokeWidth={1.5} />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {t("addressLine1")}
                  <br />
                  {t("addressLine2")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-primary" strokeWidth={1.5} />
                <a
                  href={`tel:${phone.tel}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {phone.display}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-primary" strokeWidth={1.5} />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <Button size="lg" className="h-12" asChild>
                <TrackedLink
                  href={mapsDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="directions_click"
                  params={{ source: "location_section" }}
                >
                  <Navigation aria-hidden className="mr-2 h-5 w-5" strokeWidth={1.5} />
                  {t("directions")}
                </TrackedLink>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
