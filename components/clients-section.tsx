import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"

// Placeholder client logos - replace with actual client logos
const clients = [
  { name: "Cliente 1", logo: "/logistics-company-logo.png" },
  { name: "Cliente 2", logo: "/manufacturing-company-logo.png" },
  { name: "Cliente 3", logo: "/abstract-retail-logo.png" },
  { name: "Cliente 4", logo: "/automotive-company-logo.png" },
  { name: "Cliente 5", logo: "/generic-tech-logo.png" },
  { name: "Cliente 6", logo: "/food-company-logo.png" },
]

export function ClientsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Empresas que confían en nosotros</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Trabajamos con las empresas más importantes de México y Estados Unidos
          </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client, index) => (
            <RevealChild
              key={index}
              className="flex items-center justify-center p-6 bg-background rounded-lg transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={client.logo || "/placeholder.svg"}
                alt={`Logotipo de ${client.name}`}
                loading="lazy"
                decoding="async"
                className="max-w-full h-12 md:h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </RevealChild>
          ))}
        </RevealGroup>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Y muchas más empresas que confían en nuestro servicio de transporte
          </p>
        </div>
      </div>
    </section>
  )
}
