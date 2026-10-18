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
        <Reveal>
          {/* Datos de la sede arriba, mapa a lo ancho abajo (no otro split imagen/texto) */}
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-bold text-balance md:text-5xl">{t("title")}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {t("description")}
              </p>
            </div>

            <div className="lg:col-span-5">
              <ul className="space-y-4">
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
          </div>

          {/* Mapa embebido de la sede */}
          <div className="relative mt-12 aspect-[4/3] overflow-hidden rounded-2xl border border-border md:aspect-[21/9]">
            <iframe
              title={t("mapAlt")}
              src={mapsEmbedUrl(locale)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
