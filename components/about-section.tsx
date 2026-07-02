import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
import { FleetImage } from "@/components/fleet-image"
import { yearsInService } from "@/lib/site"

export function AboutSection() {
  const t = useTranslations("About")

  return (
    <section id="quienes-somos" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("kicker")}</span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">{t("title")}</h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {t("subtitle", { years: yearsInService() })}
            </p>
          </Reveal>

          {/* Flota real en la terminal: prueba de "flota propia" */}
          <Reveal className="mb-12">
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <FleetImage
                src="/fleet/flota-patio.jpg"
                alt={t("fleetAlt")}
                caption={t("fleetCaption")}
                className="aspect-[16/9] w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-white/80">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-accent-bright animate-live-blink" />
                  {t("fleetChip")}
                </span>
                <span aria-hidden className="text-white/30">|</span>
                <span>{t("fleetLocation")}</span>
              </div>
            </div>
          </Reveal>

          {/* Misión y visión destiladas: prosa directa, sin plantilla corporativa */}
          <RevealGroup className="grid gap-10 md:grid-cols-2 md:gap-14">
            <RevealChild>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {t("storyLabel1")}
              </span>
              <p className="mt-3 leading-relaxed text-foreground/90">{t("story1")}</p>
            </RevealChild>
            <RevealChild>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {t("storyLabel2")}
              </span>
              <p className="mt-3 leading-relaxed text-foreground/90">{t("story2")}</p>
            </RevealChild>
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
