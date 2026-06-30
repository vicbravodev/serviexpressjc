import { Truck, Shield, MapPin, Clock, Wrench, Users } from "lucide-react"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

const features = [
  {
    icon: Truck,
    title: "Flota moderna y propia",
    description: "Unidades con doble placa y remolques de 53 pies con suspensión de aire.",
  },
  {
    icon: Shield,
    title: "Seguridad 24/7",
    description: "Monitoreo GPS en tiempo real para entregas puntuales y seguras.",
  },
  {
    icon: MapPin,
    title: "Cobertura amplia",
    description: "Servicio nacional e internacional México–USA con múltiples rutas.",
  },
  {
    icon: Clock,
    title: "Entregas puntuales",
    description: "Compromiso con los tiempos de entrega y atención personalizada.",
  },
  {
    icon: Wrench,
    title: "5 talleres propios",
    description: "Mantenimiento en casa y refaccionaria Los César con inventario extenso.",
  },
  {
    icon: Users,
    title: "Operadores certificados",
    description: "Personal altamente capacitado con certificación B1 para el cruce.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Por qué ServiExpress JC
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">Razones para confiarnos tu carga</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            Ventajas concretas, sostenidas con evidencia, no con adjetivos.
          </p>
        </Reveal>

        <RevealGroup className="mx-auto grid max-w-5xl border-t border-border md:grid-cols-2 md:gap-x-12">
          {features.map((feature, index) => (
            <RevealChild
              key={index}
              className="group flex items-start gap-5 border-b border-border py-8"
            >
              <span className="mt-1 font-mono text-xs tabular-nums text-muted-foreground transition-colors group-hover:text-yellow-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <feature.icon
                className="mt-0.5 h-6 w-6 shrink-0 text-primary transition-transform duration-300 group-hover:scale-110"
                strokeWidth={1.5}
              />
              <div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
