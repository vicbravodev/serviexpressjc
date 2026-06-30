import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Globe, ArrowRight } from "lucide-react"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Nuestros Servicios</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Soluciones integrales de transporte adaptadas a tus necesidades
          </p>
        </Reveal>

        <RevealGroup className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Transporte Nacional */}
          <RevealChild className="h-full">
          <Card className="h-full p-8 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-xl">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Transporte Nacional</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Servicios de transporte local, regional y de larga distancia a través de México. Cobertura completa en
              todas las zonas del país.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <div>
                  <span className="font-semibold">Zona Norte:</span> Coahuila, Chihuahua, Durango, Tamaulipas, Monterrey
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <div>
                  <span className="font-semibold">Zona Pacífico:</span> Baja California, Sinaloa, Sonora
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <div>
                  <span className="font-semibold">Zona Bajío:</span> Aguascalientes, Guanajuato, Querétaro, San Luis
                  Potosí
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <div>
                  <span className="font-semibold">Zona Occidente:</span> Jalisco, Michoacán, Colima
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Más información
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Card>
          </RevealChild>

          {/* Transporte Internacional */}
          <RevealChild className="h-full">
          <Card className="h-full p-8 border-primary/20 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-xl">
            <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Transporte Internacional</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Servicios transfronterizos México-USA con servicio puerta a puerta. Cruce por Laredo, TX con operadores
              certificados B1.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                <div>
                  <span className="font-semibold">Texas:</span> Austin, Dallas, Houston, San Antonio
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                <div>
                  <span className="font-semibold">Midwest:</span> Chicago, Detroit, Indianapolis, Kansas City
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                <div>
                  <span className="font-semibold">Southeast:</span> Atlanta, Miami, Nashville, Orlando
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                <div>
                  <span className="font-semibold">West:</span> Los Angeles, Phoenix, San Diego, Seattle
                </div>
              </div>
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/90">
              Solicitar cotización
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Card>
          </RevealChild>
        </RevealGroup>

        {/* Características del Equipo */}
        <Reveal>
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="text-2xl font-bold mb-6 text-center">Características de Nuestro Equipo</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">53'</div>
              <div className="text-sm text-muted-foreground">Remolques de carga seca</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">GPS</div>
              <div className="text-sm text-muted-foreground">Rastreo en tiempo real</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">B1</div>
              <div className="text-sm text-muted-foreground">Operadores certificados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2X</div>
              <div className="text-sm text-muted-foreground">Vehículos doble placa</div>
            </div>
          </div>
        </Card>
        </Reveal>
      </div>
    </section>
  )
}
