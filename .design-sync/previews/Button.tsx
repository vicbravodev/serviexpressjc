import { Button } from "my-v0-project"

export const Variantes = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Button>Solicita tu cotización</Button>
    <Button variant="secondary">Ver servicios</Button>
    <Button variant="outline">Contactar</Button>
    <Button variant="ghost">Cancelar</Button>
    <Button variant="destructive">Eliminar unidad</Button>
    <Button variant="link">Más información</Button>
  </div>
)

export const Tamanos = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Button size="sm">Cotizar</Button>
    <Button size="default">Cotizar embarque</Button>
    <Button size="lg">Solicita tu cotización</Button>
  </div>
)

export const Estados = () => (
  <div className="flex flex-wrap items-center gap-4">
    <Button>Activo</Button>
    <Button disabled>Deshabilitado</Button>
    <Button variant="outline" disabled>
      Outline deshabilitado
    </Button>
  </div>
)
