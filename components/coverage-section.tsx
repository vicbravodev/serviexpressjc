import { Card } from "@/components/ui/card"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

export function CoverageSection() {
  return (
    <section id="cobertura" className="py-24">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Cobertura Nacional e Internacional</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Presencia en las principales zonas de México y Estados Unidos
          </p>
        </Reveal>

        <RevealGroup className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map placeholder */}
          <RevealChild className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img src="/map-of-mexico-and-usa-with-transportation-routes.jpg" alt="Mapa de cobertura" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm font-medium text-foreground">Rutas principales México - Estados Unidos</p>
            </div>
          </RevealChild>

          {/* Coverage details */}
          <RevealChild className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">México</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">Norte</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Monterrey</li>
                    <li>Chihuahua</li>
                    <li>Coahuila</li>
                    <li>Tamaulipas</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Bajío</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Querétaro</li>
                    <li>Guanajuato</li>
                    <li>Aguascalientes</li>
                    <li>San Luis Potosí</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Pacífico</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Baja California</li>
                    <li>Sonora</li>
                    <li>Sinaloa</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Occidente</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Jalisco</li>
                    <li>Michoacán</li>
                    <li>Colima</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-secondary">Estados Unidos</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">Texas</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Houston</li>
                    <li>Dallas</li>
                    <li>San Antonio</li>
                    <li>Austin</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Midwest</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Chicago</li>
                    <li>Detroit</li>
                    <li>Indianapolis</li>
                    <li>Kansas City</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Southeast</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Atlanta</li>
                    <li>Miami</li>
                    <li>Nashville</li>
                    <li>Orlando</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">West</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Los Angeles</li>
                    <li>Phoenix</li>
                    <li>San Diego</li>
                    <li>Seattle</li>
                  </ul>
                </div>
              </div>
            </Card>
          </RevealChild>
        </RevealGroup>
      </div>
    </section>
  )
}
