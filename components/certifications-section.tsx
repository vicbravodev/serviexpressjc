import { Shield, Award, FileCheck, Truck } from "lucide-react"
import { Reveal } from "@/components/motion-primitives"

const certifications = [
  {
    icon: Shield,
    title: "Certificación B1",
    description: "Operadores certificados con licencia federal tipo B1 para transporte de carga",
  },
  {
    icon: Award,
    title: "Doble Placa",
    description: "Vehículos con doble placa México-USA para cruce fronterizo sin complicaciones",
  },
  {
    icon: FileCheck,
    title: "Seguros Completos",
    description: "Cobertura total de seguro de carga para proteger tu mercancía",
  },
  {
    icon: Truck,
    title: "Flota Certificada",
    description: "Unidades con verificación vigente y mantenimiento preventivo constante",
  },
]

export function CertificationsSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Certificaciones y Garantías</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Cumplimos con todos los estándares de calidad y seguridad del sector
          </p>
        </Reveal>

        <Reveal className="max-w-6xl mx-auto rounded-2xl border border-border bg-border overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
          {certifications.map((cert, index) => (
            <div key={index} className="group bg-card p-8 flex flex-col items-start gap-4 transition-colors duration-300 hover:bg-muted/40">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <cert.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold leading-snug">{cert.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{cert.description}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
