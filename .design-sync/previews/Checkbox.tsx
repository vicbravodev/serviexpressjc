import { Checkbox, Label } from "my-v0-project"

export const Basico = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="aviso" />
    <Label htmlFor="aviso">Acepto el aviso de privacidad</Label>
  </div>
)

export const Estados = () => (
  <div className="grid gap-3">
    <div className="flex items-center gap-2">
      <Checkbox id="sin" />
      <Label htmlFor="sin">Sin marcar</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="marcado" defaultChecked />
      <Label htmlFor="marcado">Requiere maniobra de carga</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="dis" disabled />
      <Label htmlFor="dis">Servicio no disponible en esta ruta</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="dis-mar" disabled defaultChecked />
      <Label htmlFor="dis-mar">Seguro de carga incluido</Label>
    </div>
  </div>
)

export const ListaServicios = () => (
  <div className="grid gap-3">
    <span className="text-sm font-medium">Servicios adicionales</span>
    <div className="flex items-center gap-2">
      <Checkbox id="rastreo" defaultChecked />
      <Label htmlFor="rastreo">Rastreo GPS en tiempo real</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="cruce" defaultChecked />
      <Label htmlFor="cruce">Cruce fronterizo por Laredo</Label>
    </div>
    <div className="flex items-center gap-2">
      <Checkbox id="custodia" />
      <Label htmlFor="custodia">Custodia armada</Label>
    </div>
  </div>
)
