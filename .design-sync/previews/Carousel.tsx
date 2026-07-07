import {
  Badge,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "my-v0-project"

const rutas = [
  { origen: "Monterrey", destino: "Houston, TX", tiempo: "8 h", tipo: "Directo" },
  { origen: "Saltillo", destino: "Laredo, TX", tiempo: "4 h", tipo: "Cruce" },
  { origen: "Apodaca", destino: "Dallas, TX", tiempo: "11 h", tipo: "Directo" },
  { origen: "García", destino: "San Antonio, TX", tiempo: "6 h", tipo: "Cruce" },
]

export const Rutas = () => (
  <Carousel className="w-full max-w-xs">
    <CarouselContent>
      {rutas.map((r) => (
        <CarouselItem key={r.destino}>
          <Card>
            <CardContent className="flex flex-col gap-2 p-6">
              <Badge variant="secondary" className="w-fit">
                {r.tipo}
              </Badge>
              <p className="text-lg font-semibold">
                {r.origen} → {r.destino}
              </p>
              <p className="text-sm text-muted-foreground">
                Tránsito estimado {r.tiempo} · salida diaria
              </p>
            </CardContent>
          </Card>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
)
