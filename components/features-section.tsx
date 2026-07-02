import { Truck, Shield, MapPin, Clock, Wrench, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

const featureIcons = [Truck, Shield, MapPin, Clock, Wrench, Users]

export function FeaturesSection() {
  const t = useTranslations("Features")

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {t("kicker")}
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            {t("subtitle")}
          </p>
        </Reveal>

        <RevealGroup className="mx-auto grid max-w-5xl border-t border-border md:grid-cols-2 md:gap-x-12">
          {featureIcons.map((Icon, index) => (
            <RevealChild key={index} className="group flex items-start gap-5 border-b border-border py-8">
              <span className="mt-1 font-mono text-xs tabular-nums text-muted-foreground transition-colors group-hover:text-yellow-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon
                className="mt-0.5 h-6 w-6 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t(`items.${index}.title`)}</h3>
                <p className="leading-relaxed text-muted-foreground">{t(`items.${index}.description`)}</p>
              </div>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
