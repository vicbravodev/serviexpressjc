import { Card } from "@/components/ui/card"
import { Target, Eye } from "lucide-react"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

export function AboutSection() {
  return (
    <section id="quienes-somos" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Quiénes Somos</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              ServiExpress JC es una empresa de transporte con más de una década de experiencia en el sector de
              transporte de carga nacional e internacional.
            </p>
          </Reveal>

          <RevealGroup className="grid md:grid-cols-2 gap-8 mb-12">
            <RevealChild className="h-full">
            <Card className="h-full p-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Nuestra Misión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Garantizar un servicio de calidad que cubra las necesidades de nuestros clientes, coordinando y
                monitoreando el traslado con el mejor personal.
              </p>
            </Card>
            </RevealChild>

            <RevealChild className="h-full">
            <Card className="h-full p-8">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Nuestra Visión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser reconocidos como una de las empresas de transporte más competitivas en México y EE.UU.,
                incrementando nuestro valor año con año.
              </p>
            </Card>
            </RevealChild>
          </RevealGroup>

          <Reveal>
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Nuestros Valores</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Calidad en el servicio",
                "Innovación tecnológica",
                "Seguridad 24/7",
                "Entregas puntuales",
                "Atención personalizada",
                "Compromiso con el cliente",
              ].map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
