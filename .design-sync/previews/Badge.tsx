import { Badge } from "my-v0-project"
import { CheckIcon } from "lucide-react"

export const Variantes = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge>En ruta</Badge>
    <Badge variant="secondary">En patio</Badge>
    <Badge variant="destructive">Retrasado</Badge>
    <Badge variant="outline">Programado</Badge>
  </div>
)

export const ConIcono = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge>
      <CheckIcon />
      Entregado
    </Badge>
    <Badge variant="secondary">Caja seca 53 pies</Badge>
    <Badge variant="outline">GPS activo</Badge>
  </div>
)

export const Estatus = () => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge variant="secondary">MTY → Laredo</Badge>
    <Badge>Cruce B1</Badge>
    <Badge variant="destructive">Sobrepeso</Badge>
  </div>
)
