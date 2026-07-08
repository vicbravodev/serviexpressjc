import { Label, Input, Checkbox } from "my-v0-project"

export const ConInput = () => (
  <div className="grid w-72 gap-2">
    <Label htmlFor="contacto">Nombre de contacto</Label>
    <Input id="contacto" placeholder="Ing. Laura Treviño" />
  </div>
)

export const ConControl = () => (
  <div className="flex items-center gap-2">
    <Checkbox id="terminos" defaultChecked />
    <Label htmlFor="terminos">Acepto ser contactado por WhatsApp</Label>
  </div>
)

export const Deshabilitado = () => (
  <div className="grid w-72 gap-2" data-disabled="true">
    <Label htmlFor="folio-lock">Folio (asignado automáticamente)</Label>
    <Input id="folio-lock" defaultValue="SEJC-2026-0481" disabled />
  </div>
)
