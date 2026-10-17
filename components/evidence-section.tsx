import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

const FACTS = 5

/**
 * Franja de evidencia: los hechos verificables que antes vivían repartidos entre
 * Stats y Certificaciones. Lista tipográfica sobre el lienzo claro, sin placa oscura
 * ni números de vitrina. `years` llega del servidor para no desfasar la hidratación.
 */
export function EvidenceSection({ years }: { years: number }) {
  const t = useTranslations("Evidence")

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-4">
          <h2 className="text-2xl font-bold text-balance md:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground text-pretty">{t("subtitle")}</p>
        </Reveal>

        <RevealGroup as="dl" className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
          <RevealChild className="border-t border-foreground/15 pt-4">
            <dt className="text-lg font-semibold leading-snug">{t("yearsTitle", { years })}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t("yearsDescription")}</dd>
          </RevealChild>
          {Array.from({ length: FACTS }, (_, i) => (
            <RevealChild key={i} className="border-t border-foreground/15 pt-4">
              <dt className="text-lg font-semibold leading-snug">{t(`items.${i}.title`)}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(`items.${i}.description`)}</dd>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
