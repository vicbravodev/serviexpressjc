import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Reveal, RevealGroup, RevealChild } from "@/components/motion-primitives"
import { FleetImage } from "@/components/fleet-image"

const nacionalZones = ["Norte", "Bajío", "Pacífico", "Occidente"]
const internacionalZones = ["Texas", "Midwest", "Southeast", "West"]

export function ServicesSection() {
  return (
    <section id="servicios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <Reveal className="mb-14 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">Servicios</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold text-balance">Lo que movemos, probado en carretera</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            Carga nacional e internacional, con unidades propias y operadores certificados de punta a punta.
          </p>
        </Reveal>

        <RevealGroup className="mb-10 grid gap-8 lg:grid-cols-2">
          {/* Nacional */}
          <RevealChild className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-xl">
              <div className="relative aspect-[16/9] overflow-hidden">
                <FleetImage
                  src="/fleet/carga-acero.jpg"
                  alt="Unidad de ServiExpress JC transportando carga siderúrgica de acero"
                  caption="Carga de acero · nacional"
                  className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-accent-bright" /> Nacional
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-2xl font-bold">Transporte nacional</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Local, regional y larga distancia por todo México. Carga siderúrgica, agrícola, seca y
                  sobredimensionada, monitoreada por GPS de origen a destino.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {nacionalZones.map((z) => (
                    <span
                      key={z}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
                    >
                      {z}
                    </span>
                  ))}
                </div>
                <Button variant="outline" className="mt-6 w-full bg-transparent" asChild>
                  <Link href="#cobertura">
                    Ver cobertura
                    <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
            </article>
          </RevealChild>

          {/* Internacional */}
          <RevealChild className="h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1.5 hover:shadow-xl">
              <div className="relative aspect-[16/9] overflow-hidden">
                <FleetImage
                  src="/fleet/cruce-usa.jpg"
                  alt="Tractor de ServiExpress JC en báscula certificada en Estados Unidos"
                  caption="Cruce México · USA"
                  className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-accent-bright" /> Internacional · MX → USA
                </span>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-2xl font-bold">Transporte internacional</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Servicio transfronterizo puerta a puerta. Cruce por Laredo, TX con operadores certificados B1 y
                  unidades de doble placa.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {internacionalZones.map((z) => (
                    <span
                      key={z}
                      className="rounded-full border border-border bg-muted/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
                    >
                      {z}
                    </span>
                  ))}
                </div>
                <Button className="mt-6 w-full bg-secondary hover:bg-secondary/90" asChild>
                  <Link href="#cotizacion">
                    Solicitar cotización
                    <ArrowRight className="ml-2" size={16} />
                  </Link>
                </Button>
              </div>
            </article>
          </RevealChild>
        </RevealGroup>

        {/* Versatilidad de carga */}
        <Reveal>
          <div className="grid items-stretch overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-2">
            <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[360px]">
              <FleetImage
                src="/fleet/carga-agricola.jpg"
                alt="Unidad de ServiExpress JC cargada con pacas de forraje agrícola"
                caption="Carga agrícola · forraje"
                className="absolute inset-0 h-full w-full object-cover object-[center_78%]"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Carga especializada
              </span>
              <h3 className="mt-3 text-2xl font-bold">Una flota, muchos tipos de carga</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                De varilla y perfiles de acero a pacas de forraje: plataformas, cajas secas de 53 pies y equipo para
                carga sobredimensionada, siempre amarrada y monitoreada.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {["Siderúrgica / acero", "Agrícola y forraje", "Carga seca (53')", "Sobredimensionada"].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-accent" />
                    <span className="text-foreground">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
