import { Quote } from "lucide-react"
import { useTranslations } from "next-intl"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

const clients = [
  { name: "Ternium", logo: "/clients/ternium.png" },
  { name: "Villacero", logo: "/clients/villacero.svg" },
  { name: "OfertAcero", logo: "/clients/ofertacero.png" },
  { name: "Aceros BC", logo: "/clients/aceros-bc.png" },
  { name: "Crown", logo: "/clients/crown.svg" },
]

/* Atribución de cada testimonio; el primero es la cita destacada. */
const testimonialCompanies = ["Ternium", "Villacero", "Aceros BC"]

export function SocialProofSection() {
  const t = useTranslations("SocialProof")

  return (
    <section id="clientes" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <Reveal className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">{t("kicker")}</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
        </Reveal>

        {/* Franja única de logos con hairlines, no tiles sueltos */}
        <Reveal className="mx-auto mb-16 max-w-5xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
            {clients.map((client) => (
              <div key={client.name} className="flex items-center justify-center bg-card px-6 py-8">
                <img
                  src={client.logo}
                  alt={t("logoAlt", { name: client.name })}
                  loading="lazy"
                  decoding="async"
                  className="h-10 max-w-full object-contain grayscale transition-[filter] duration-300 hover:grayscale-0 md:h-12"
                />
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">{t("more")}</p>
        </Reveal>

        {/* Testimonios: cita destacada + dos compactas, composición asimétrica */}
        <RevealGroup className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-5">
          <RevealChild className="lg:col-span-3">
            <figure className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-8 md:p-10">
              <div>
                <Quote aria-hidden className="h-8 w-8 text-yellow-accent" />
                <blockquote className="mt-5 text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                  “{t("items.0.quote")}”
                </blockquote>
              </div>
              <figcaption className="mt-8">
                <p className="font-semibold">{testimonialCompanies[0]}</p>
                <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  {t("items.0.role")}
                </p>
              </figcaption>
            </figure>
          </RevealChild>

          <RevealChild className="lg:col-span-2">
            <div className="flex h-full flex-col justify-center divide-y divide-border">
              {[1, 2].map((i) => (
                <figure key={i} className="py-7 first:pt-0 last:pb-0">
                  <blockquote className="leading-relaxed text-foreground/90">“{t(`items.${i}.quote`)}”</blockquote>
                  <figcaption className="mt-4">
                    <p className="text-sm font-semibold">{testimonialCompanies[i]}</p>
                    <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      {t(`items.${i}.role`)}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </RevealChild>
        </RevealGroup>
      </div>
    </section>
  )
}
