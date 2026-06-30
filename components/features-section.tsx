import { Truck, Shield, MapPin, Clock, Wrench, Users } from "lucide-react"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

const features = [
  {
    icon: Truck,
    title: "Flota Moderna",
    description: "Vehículos con doble placa y remolques de 53 pies con suspensión de aire",
  },
  {
    icon: Shield,
    title: "Seguridad 24/7",
    description: "Monitoreo GPS en tiempo real para entregas puntuales y seguras",
  },
  {
    icon: MapPin,
    title: "Cobertura Amplia",
    description: "Servicio nacional e internacional México-USA con múltiples rutas",
  },
  {
    icon: Clock,
    title: "Entregas Puntuales",
    description: "Compromiso con tiempos de entrega y atención personalizada",
  },
  {
    icon: Wrench,
    title: "Taller Especializado",
    description: "Refaccionaria Los César con inventario extenso y soporte técnico",
  },
  {
    icon: Users,
    title: "Operadores Certificados",
    description: "Personal altamente capacitado con certificación B1",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">¿Por qué elegir ServiExpress JC?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Ventajas competitivas que nos distinguen en el sector del transporte
          </p>
        </Reveal>

        <RevealGroup className="max-w-5xl mx-auto grid md:grid-cols-2 gap-x-12 border-t border-border">
          {features.map((feature, index) => (
            <RevealChild key={index} className="group flex gap-5 py-8 border-b border-border">
              <feature.icon
                className="w-6 h-6 text-primary shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
