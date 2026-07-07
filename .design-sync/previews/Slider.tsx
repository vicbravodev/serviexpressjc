import { Slider, Label } from "my-v0-project"

export const Basico = () => (
  <div className="grid w-80 gap-3">
    <Label htmlFor="peso-slider">Peso aproximado de la carga (toneladas)</Label>
    <Slider id="peso-slider" defaultValue={[22]} min={0} max={40} step={1} />
    <span className="text-sm text-muted-foreground">Hasta 40 toneladas por unidad</span>
  </div>
)

export const Rango = () => (
  <div className="grid w-80 gap-3">
    <Label>Ventana de entrega estimada (días)</Label>
    <Slider defaultValue={[2, 5]} min={1} max={10} step={1} />
    <span className="text-sm text-muted-foreground">Entre 2 y 5 días de tránsito</span>
  </div>
)

export const Estados = () => (
  <div className="grid w-80 gap-6">
    <div className="grid gap-3">
      <Label>Unidades disponibles</Label>
      <Slider defaultValue={[8]} min={0} max={12} step={1} />
    </div>
    <div className="grid gap-3">
      <Label className="text-muted-foreground">Capacidad reservada (bloqueada)</Label>
      <Slider defaultValue={[30]} min={0} max={40} disabled />
    </div>
  </div>
)
