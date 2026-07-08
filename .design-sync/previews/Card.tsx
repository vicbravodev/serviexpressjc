import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "my-v0-project"

export const Servicio = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <CardTitle>Transporte internacional</CardTitle>
      <CardDescription>
        Servicio puerta a puerta México–USA con cruce por Laredo, TX.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Unidades con doble placa y operadores certificados B1. Monitoreo GPS
        las 24 horas desde nuestra sala de control.
      </p>
    </CardContent>
    <CardFooter>
      <Button className="w-full">Cotizar embarque</Button>
    </CardFooter>
  </Card>
)

export const ConEstado = () => (
  <Card className="max-w-sm">
    <CardHeader>
      <div className="flex items-center justify-between gap-2">
        <CardTitle>Embarque MTY → Houston</CardTitle>
        <Badge>En ruta</Badge>
      </div>
      <CardDescription>Caja seca 53 pies · 18.2 ton · Acero</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">
        Salida 06:40 h · ETA 15:10 h · Último reporte: Nuevo Laredo, Tamps.
      </p>
    </CardContent>
  </Card>
)
