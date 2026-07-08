import { Switch, Label } from "my-v0-project"

export const Basico = () => (
  <div className="flex items-center gap-2">
    <Switch id="notif" defaultChecked />
    <Label htmlFor="notif">Notificarme por WhatsApp</Label>
  </div>
)

export const Estados = () => (
  <div className="grid gap-4">
    <div className="flex items-center gap-2">
      <Switch id="off" />
      <Label htmlFor="off">Rastreo GPS desactivado</Label>
    </div>
    <div className="flex items-center gap-2">
      <Switch id="on" defaultChecked />
      <Label htmlFor="on">Rastreo GPS activado</Label>
    </div>
    <div className="flex items-center gap-2">
      <Switch id="dis-off" disabled />
      <Label htmlFor="dis-off">Custodia armada (no disponible)</Label>
    </div>
    <div className="flex items-center gap-2">
      <Switch id="dis-on" disabled defaultChecked />
      <Label htmlFor="dis-on">Seguro de carga (incluido)</Label>
    </div>
  </div>
)

export const Preferencias = () => (
  <div className="grid w-80 gap-4">
    <span className="text-sm font-medium">Preferencias de embarque</span>
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor="cita">Cita programada de carga</Label>
      <Switch id="cita" defaultChecked />
    </div>
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor="cruce-auto">Cruce fronterizo automático</Label>
      <Switch id="cruce-auto" defaultChecked />
    </div>
    <div className="flex items-center justify-between gap-2">
      <Label htmlFor="factura">Facturación electrónica al cierre</Label>
      <Switch id="factura" />
    </div>
  </div>
)
