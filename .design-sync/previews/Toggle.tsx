import { Toggle } from "my-v0-project"
import { MapPinIcon } from "lucide-react"

export const Variantes = () => (
  <div className="flex items-center gap-4">
    <Toggle>Rastreo GPS</Toggle>
    <Toggle variant="outline">Rastreo GPS</Toggle>
  </div>
)

export const Estados = () => (
  <div className="flex items-center gap-4">
    <Toggle>Inactivo</Toggle>
    <Toggle pressed>Activo</Toggle>
    <Toggle disabled>Deshabilitado</Toggle>
  </div>
)

export const Tamanos = () => (
  <div className="flex items-center gap-4">
    <Toggle variant="outline" size="sm">
      <MapPinIcon />
      Monitoreo
    </Toggle>
    <Toggle variant="outline" size="default">
      <MapPinIcon />
      Monitoreo
    </Toggle>
    <Toggle variant="outline" size="lg">
      <MapPinIcon />
      Monitoreo
    </Toggle>
  </div>
)
