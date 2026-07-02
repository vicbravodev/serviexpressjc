import { Card } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

const companies = ["Ternium", "Villacero", "Aceros BC"]

export function TestimonialsSection() {
  const t = useTranslations("Testimonials")

  return (
    <section id="clientes" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <Reveal className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("kicker")}</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            {t("subtitle")}
          </p>
        </Reveal>

        <RevealGroup className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company, i) => (
            <RevealChild key={company} className="h-full">
              <Card className="relative flex h-full flex-col p-8">
                <Quote className="absolute right-6 top-6 h-9 w-9 text-yellow-accent/30" />
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-accent text-yellow-accent" strokeWidth={1.5} />
                  ))}
                </div>
                <p className="flex-1 leading-relaxed text-foreground/90">"{t(`items.${i}.quote`)}"</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold">{company}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {t(`items.${i}.role`)}
                  </p>
                </div>
              </Card>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
