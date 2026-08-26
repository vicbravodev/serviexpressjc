import {
  Banknote,
  Fuel,
  HandCoins,
  KeyRound,
  LifeBuoy,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Warehouse,
  Wrench,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/card"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

const ICONS = [LifeBuoy, Sparkles, Warehouse, Fuel, Wrench, Banknote, KeyRound, MapPinned, ShieldCheck, HandCoins]

export function PartnerBenefitsSection() {
  const t = useTranslations("Partners.benefits")
  const tReq = useTranslations("Partners.requirements")
  const items = t.raw("items") as Array<{ title: string; description: string }>
  const reqItems = tReq.raw("items") as string[]

  return (
    <section id="beneficios" className="py-20">
      <div className="container mx-auto px-4">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("kicker")}</span>
          <h2 className="mb-3 mt-2 text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </Reveal>

        <RevealGroup className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <RevealChild key={item.title}>
                <Card className="h-full border-border p-6 shadow-none">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon aria-hidden className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1.5 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              </RevealChild>
            )
          })}
        </RevealGroup>

        <Reveal className="mx-auto mt-10 max-w-6xl">
          <Card className="surface-steel border border-white/10 p-6 text-white shadow-none sm:p-8">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-white/60">{tReq("kicker")}</span>
            <h3 className="mb-3 mt-2 text-xl font-bold">{tReq("title")}</h3>
            <ul className="space-y-2">
              {reqItems.map((req) => (
                <li key={req} className="flex items-start gap-2 text-white/80">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-accent-bright" />
                  {req}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
