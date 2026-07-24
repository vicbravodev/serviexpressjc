import { Briefcase } from "lucide-react"
import { useTranslations } from "next-intl"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuoteSimulator } from "@/components/quote-simulator"
import { ApplyForm } from "@/components/apply-form"
import { TrackedLink } from "@/components/tracked-link"
import { RevealGroup, RevealChild, Pressable } from "@/components/motion-primitives"
import { whatsappUrl } from "@/lib/site"

export function CTASection() {
  const t = useTranslations("CTA")
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <RevealGroup className="mx-auto max-w-3xl space-y-8">
          {/* Cotizador autoservicio — protagonista de la sección */}
          <RevealChild>
            <Card id="cotizacion" className="scroll-mt-28 border-border p-6 shadow-none sm:p-8">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {t("quote.kicker")}
              </span>
              <h3 className="mb-2 mt-2 text-2xl font-bold">{t("quote.title")}</h3>
              <p className="mb-6 text-muted-foreground">{t("quote.description")}</p>
              <QuoteSimulator />
            </Card>
          </RevealChild>

          {/* Postulación de operadores — franja secundaria, formulario horizontal */}
          <RevealChild>
            <Card id="postulate" className="scroll-mt-28 border-border p-6 shadow-none sm:p-8">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase aria-hidden className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    {t("apply.kicker")}
                  </span>
                  <h3 className="text-xl font-bold leading-tight">{t("apply.title")}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t("apply.description")}</p>
                </div>
              </div>
              <ApplyForm />
            </Card>
          </RevealChild>

          {/* Contacto directo */}
          <RevealChild>
            <Card className="surface-steel border border-white/10 p-8 text-center text-white shadow-none">
              <h3 className="mb-3 text-2xl font-bold">{t("whatsapp.title")}</h3>
              <p className="mb-6 text-white/70">{t("whatsapp.description")}</p>
              <Pressable className="inline-flex">
                <Button size="lg" className="h-12 bg-[#25D366] text-white hover:bg-[#20BA5A]" asChild>
                <TrackedLink
                  href={whatsappUrl(t("whatsapp.prefill"))}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="whatsapp_click"
                  params={{ source: "contact_card" }}
                >
                  <svg aria-hidden focusable="false" className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {t("whatsapp.button")}
                </TrackedLink>
                </Button>
              </Pressable>
            </Card>
          </RevealChild>
        </RevealGroup>
      </div>
    </section>
  )
}
