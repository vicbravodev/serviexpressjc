import { getTranslations } from "next-intl/server"
import type { Faq } from "@/content"

/**
 * Bloque de preguntas frecuentes. Todo el contenido queda visible en el HTML
 * servido (sin acordeones colapsados) para que Google lo indexe completo.
 */
export async function FaqBlock({ locale, faqs }: { locale: string; faqs: Faq[] }) {
  const t = await getTranslations({ locale, namespace: "ContentPage" })
  return (
    <section className="mt-16">
      <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">FAQ</span>
      <h2 className="mt-2 text-2xl font-bold md:text-3xl">{t("faqTitle")}</h2>
      <div className="mt-6 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">{faq.q}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
