import Link from "next/link"
import { ArrowRight, Handshake } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { FleetImage } from "@/components/fleet-image"
import { yearsInService } from "@/lib/site"

export function PartnerHero() {
  const t = useTranslations("Partners.hero")

  return (
    <section className="relative overflow-hidden bg-[oklch(0.12_0.01_240)] pb-20 pt-32 sm:pt-40">
      <div className="bg-blueprint absolute inset-0 opacity-[0.18]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-background" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <Handshake aria-hidden className="h-4 w-4 text-yellow-accent-bright" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/90">{t("kicker")}</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-[1.1] text-balance text-white md:text-5xl">
              {t("titleLead")} <span className="text-yellow-accent-bright">{t("titleAccent")}</span>
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/75 text-pretty">{t("subtitle")}</p>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="group h-14 bg-secondary px-8 text-lg hover:bg-secondary/90" asChild>
                <Link href="#solicitud">
                  {t("cta")}
                  <ArrowRight
                    className="ml-2 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                    size={20}
                  />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/70">
                {t("statYears", { years: yearsInService() })}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-white/70">
                {t("statWorkshops")}
              </span>
            </div>
          </div>

          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 lg:block">
            <FleetImage
              src="/fleet/kenworth-clasico.jpg"
              alt="Tractocamión de la flota de JC Serviexpress"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
