import { Card } from "@/components/ui/card"
import { Target, Eye } from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
import { FleetImage } from "@/components/fleet-image"

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
              {t("subtitle")}
            </p>
          </Reveal>

          {/* Real fleet at the terminal: proof of "flota propia" */}
          <Reveal className="mb-12">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40">
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
                <span className="text-white/30">|</span>
                <span>{t("fleetLocation")}</span>
              </div>
            </div>
          </Reveal>

          <RevealGroup className="grid md:grid-cols-2 gap-8 mb-12">
            <RevealChild className="h-full">
            <Card className="h-full p-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("missionTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("missionText")}
              </p>
            </Card>
            </RevealChild>

            <RevealChild className="h-full">
            <Card className="h-full p-8">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("visionTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("visionText")}
              </p>
            </Card>
            </RevealChild>
          </RevealGroup>

          <Reveal>
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">{t("valuesTitle")}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{t(`values.${i}`)}</span>
                </div>
              ))}
            </div>
          </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
