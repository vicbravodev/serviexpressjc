import { ShieldCheck, Warehouse, Wrench, Package } from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
import { FleetImage } from "@/components/fleet-image"

const pillarIcons = [ShieldCheck, Warehouse, Wrench, Package]

export function TalleresSection() {
  const t = useTranslations("Talleres")

  return (
    <section id="talleres" className="relative bg-muted/30 lg:min-h-[640px]">
      {/* Foto a sangre: en escritorio ocupa la mitad derecha hasta el borde del viewport */}
      <Reveal className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <FleetImage
          src="/fleet/kenworth-clasico.jpg"
          alt={t("imageAlt")}
          caption={t("imageCaption")}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
        />
      </Reveal>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="lg:w-1/2 lg:pr-14">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold text-balance">
              {t("titleLead")} <span className="text-primary">{t("titleAccent")}</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {t("description")}
            </p>
          </Reveal>

          {/* Pilares como lista con ícono en línea, no como cajas */}
          <RevealGroup as="ul" className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {pillarIcons.map((Icon, i) => (
              <RevealChild key={i} as="li" className="flex gap-3">
                <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
                <div>
                  <h3 className="font-semibold leading-snug">{t(`pillars.${i}.title`)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`pillars.${i}.caption`)}
                  </p>
                </div>
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
