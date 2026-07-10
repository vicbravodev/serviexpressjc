import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
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
