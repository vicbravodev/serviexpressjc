import { Wrench, Users, ShieldCheck, Package } from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
import { FleetImage } from "@/components/fleet-image"

const pillarIcons = [Wrench, Users, ShieldCheck, Package]

export function TalleresSection() {
  const t = useTranslations("Talleres")

  return (
    <section id="talleres" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Proof: a unit kept in show condition by their own shops */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <FleetImage
                src="/fleet/kenworth-clasico.jpg"
                alt={t("imageAlt")}
                caption={t("imageCaption")}
                className="aspect-[4/5] w-full sm:aspect-[16/12]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 font-mono text-[11px] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-accent-bright animate-live-blink" />
                <span className="rounded-md border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  {t("overlay")}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Story + pillars */}
          <div className="order-1 lg:order-2">
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {t("kicker")}
              </span>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">
                {t("titleLead")} <span className="text-primary">{t("titleAccent")}</span>
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                {t("description")}
              </p>
            </Reveal>

            <RevealGroup className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {pillarIcons.map((Icon, i) => (
                <RevealChild
                  key={i}
                  className="group flex flex-col gap-3 bg-card p-6 transition-colors duration-300 hover:bg-muted/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-semibold leading-snug">{t(`pillars.${i}.title`)}</h3>
                  <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {t(`pillars.${i}.caption`)}
                  </p>
                </RevealChild>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  )
}
