import { Card } from "@/components/ui/card"
import { Clock, Truck, Award } from "lucide-react"
import { RevealGroup, RevealChild } from "@/components/motion-primitives"

const stats = [
  {
    icon: Award,
    value: "10+",
    label: "Años de experiencia",
    suffix: "",
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Monitoreo GPS",
    suffix: "",
  },
  {
    icon: Truck,
    value: "100",
    label: "Flota propia",
    suffix: "%",
  },
  {
    icon: Award,
    value: "B1",
    label: "Operadores certificados",
    suffix: "",
  },
]

export function StatsSection() {
  return (
    <section className="relative -mt-20 pb-20 z-20">
      <div className="container mx-auto px-4">
        <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <RevealChild key={index}>
              <Card className="h-full p-6 md:p-8 text-center transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-xl bg-background/95 backdrop-blur-sm">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <div className="text-3xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <p className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</p>
              </Card>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
