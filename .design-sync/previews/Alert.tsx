import { Alert, AlertTitle, AlertDescription } from "my-v0-project"
import { TruckIcon, TriangleAlertIcon } from "lucide-react"

export const Informativa = () => (
  <Alert className="max-w-md">
    <TruckIcon />
    <AlertTitle>Embarque en ruta</AlertTitle>
    <AlertDescription>
      Tu carga Monterrey → Houston cruzó por Laredo, TX a las 09:42 h. ETA
      estimada 15:10 h con monitoreo GPS activo.
    </AlertDescription>
  </Alert>
)

export const Destructiva = () => (
  <Alert variant="destructive" className="max-w-md">
    <TriangleAlertIcon />
    <AlertTitle>Retraso en cruce fronterizo</AlertTitle>
    <AlertDescription>
      El puente Colombia-Solidaridad reporta 3 h de espera. Contacta a la sala
      de control para reasignar la unidad.
    </AlertDescription>
  </Alert>
)

export const SoloTitulo = () => (
  <Alert className="max-w-md">
    <TruckIcon />
    <AlertTitle>Unidad asignada: caja seca 53 pies</AlertTitle>
  </Alert>
)
