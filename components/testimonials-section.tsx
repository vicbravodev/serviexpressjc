import { Card } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

const testimonials = [
  {
    quote:
      "Confiamos en SERVIEXPRESS JC para nuestras rutas del norte y ahora también para exportación. Siempre puntuales y con excelente seguimiento.",
    company: "Ternium",
    role: "Logística y Abastecimiento",
  },
  {
    quote:
      "El servicio de monitoreo GPS nos da tranquilidad total. Sabemos exactamente dónde está nuestra carga en todo momento.",
    company: "Villacero",
    role: "Cadena de Suministro",
  },
  {
    quote:
      "Profesionalismo y atención personalizada. Han sido clave para el crecimiento de nuestro negocio.",
    company: "Aceros BC",
    role: "Operaciones y Distribución",
  },
]

export function TestimonialsSection() {
  return (
    <section id="clientes" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <Reveal className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Clientes</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">Lo que dicen quienes ya confían</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            Acereras y exportadores que mueven su carga con nosotros.
          </p>
        </Reveal>

        <RevealGroup className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <RevealChild key={t.company} className="h-full">
              <Card className="relative flex h-full flex-col p-8">
                <Quote className="absolute right-6 top-6 h-9 w-9 text-yellow-accent/30" />
                <div className="mb-5 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-accent text-yellow-accent" strokeWidth={1.5} />
                  ))}
                </div>
                <p className="flex-1 leading-relaxed text-foreground/90">"{t.quote}"</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold">{t.company}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
