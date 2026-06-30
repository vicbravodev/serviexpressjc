import { Card } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

export function TestimonialsSection() {
  return (
    <section id="clientes" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            La confianza de nuestros clientes es nuestro mayor logro
          </p>
        </Reveal>

        <RevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <RevealChild className="h-full">
          <Card className="h-full p-8 relative">
            <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
            <div className="mb-4">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" strokeWidth={1.5} />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                "Confiamos en SERVIEXPRESS JC para nuestras rutas del norte y ahora también para exportación. Siempre
                puntuales y con excelente seguimiento."
              </p>
            </div>
            <div>
              <p className="font-semibold">Cliente Nacional</p>
              <p className="text-sm text-muted-foreground">Sector Logística</p>
            </div>
          </Card>
          </RevealChild>

          <RevealChild className="h-full">
          <Card className="h-full p-8 relative">
            <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
            <div className="mb-4">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" strokeWidth={1.5} />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                "El servicio de monitoreo GPS nos da tranquilidad total. Sabemos exactamente dónde está nuestra carga en
                todo momento."
              </p>
            </div>
            <div>
              <p className="font-semibold">Empresa Exportadora</p>
              <p className="text-sm text-muted-foreground">Comercio Internacional</p>
            </div>
          </Card>
          </RevealChild>

          <RevealChild className="h-full">
          <Card className="h-full p-8 relative">
            <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
            <div className="mb-4">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" strokeWidth={1.5} />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                "Profesionalismo y atención personalizada. Han sido clave para el crecimiento de nuestro negocio."
              </p>
            </div>
            <div>
              <p className="font-semibold">Distribuidor Regional</p>
              <p className="text-sm text-muted-foreground">Distribución</p>
            </div>
          </Card>
          </RevealChild>
        </RevealGroup>
      </div>
    </section>
  )
}
