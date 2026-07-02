import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Briefcase } from "lucide-react"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
import { useTranslations } from "next-intl"

export function CTASection() {
  const t = useTranslations("CTA")
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <RevealGroup className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Cotización */}
          <RevealChild className="h-full">
          <Card id="cotizacion" className="h-full p-8 border-border">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("quote.kicker")}</span>
            <h3 className="mt-2 text-2xl font-bold mb-2">{t("quote.title")}</h3>
            <p className="text-muted-foreground mb-6">
              {t("quote.description")}
            </p>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-nombre">{t("quote.name")}</Label>
                  <Input id="cot-nombre" name="nombre" autoComplete="name" required placeholder={t("quote.namePh")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-email">{t("quote.email")}</Label>
                  <Input id="cot-email" name="email" type="email" autoComplete="email" required placeholder={t("quote.emailPh")} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-telefono">{t("quote.phone")}</Label>
                  <Input id="cot-telefono" name="telefono" type="tel" autoComplete="tel" placeholder={t("quote.phonePh")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-empresa">{t("quote.company")}</Label>
                  <Input id="cot-empresa" name="empresa" autoComplete="organization" placeholder={t("quote.companyPh")} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cot-origen">{t("quote.origin")}</Label>
                  <Input id="cot-origen" name="origen" placeholder={t("quote.originPh")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cot-destino">{t("quote.destination")}</Label>
                  <Input id="cot-destino" name="destino" placeholder={t("quote.destinationPh")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cot-detalles">{t("quote.details")}</Label>
                <Textarea id="cot-detalles" name="detalles" rows={4} placeholder={t("quote.detailsPh")} />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                {t("quote.submit")}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
          </Card>
          </RevealChild>

          {/* Postúlate */}
          <RevealChild className="h-full">
          <Card id="postulate" className="h-full p-8 border-border">
            <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {t("apply.kicker")}
            </span>
            <div className="mt-2 flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{t("apply.title")}</h3>
                <p className="text-muted-foreground">{t("apply.description")}</p>
              </div>
            </div>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-nombre">{t("apply.name")}</Label>
                  <Input id="post-nombre" name="nombre" autoComplete="name" required placeholder={t("apply.namePh")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-email">{t("apply.email")}</Label>
                  <Input id="post-email" name="email" type="email" autoComplete="email" required placeholder={t("apply.emailPh")} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-telefono">{t("apply.phone")}</Label>
                  <Input id="post-telefono" name="telefono" type="tel" autoComplete="tel" placeholder={t("apply.phonePh")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-puesto">{t("apply.position")}</Label>
                  <Input id="post-puesto" name="puesto" placeholder={t("apply.positionPh")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-experiencia">{t("apply.experience")}</Label>
                <Textarea id="post-experiencia" name="experiencia" rows={4} placeholder={t("apply.experiencePh")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="post-cv">{t("apply.cv")}</Label>
                <Input id="post-cv" name="cv" type="file" accept=".pdf,.doc,.docx" />
              </div>
              <Button type="submit" className="w-full bg-transparent" size="lg" variant="outline">
                {t("apply.submit")}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </form>
          </Card>
          </RevealChild>
        </RevealGroup>

        {/* WhatsApp CTA */}
        <Reveal className="mt-12 text-center">
          <Card className="mx-auto max-w-2xl border border-white/10 surface-steel p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">{t("whatsapp.title")}</h3>
            <p className="mb-6 text-white/70">{t("whatsapp.description")}</p>
            <Button size="lg" className="bg-[#25D366] hover:bg-[#20BA5A] text-white">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {t("whatsapp.button")}
            </Button>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}
