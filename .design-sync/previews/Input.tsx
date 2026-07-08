import { Input, Label } from "my-v0-project"

export const Basico = () => (
  <div className="grid w-72 gap-2">
    <Label htmlFor="empresa">Nombre de la empresa</Label>
    <Input id="empresa" placeholder="Aceros del Norte, S.A. de C.V." />
  </div>
)

export const Tipos = () => (
  <div className="grid w-72 gap-4">
    <div className="grid gap-2">
      <Label htmlFor="correo">Correo corporativo</Label>
      <Input id="correo" type="email" placeholder="logistica@empresa.com.mx" />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="tel">Teléfono</Label>
      <Input id="tel" type="tel" placeholder="+52 81 1524 8593" />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="peso">Peso aproximado (kg)</Label>
      <Input id="peso" type="number" placeholder="22000" />
    </div>
  </div>
)

export const ConValor = () => (
  <div className="grid w-72 gap-2">
    <Label htmlFor="ruta">Ruta del embarque</Label>
    <Input id="ruta" defaultValue="Monterrey, NL → Houston, TX" />
  </div>
)

export const Estados = () => (
  <div className="grid w-72 gap-4">
    <div className="grid gap-2">
      <Label htmlFor="folio">Folio asignado</Label>
      <Input id="folio" defaultValue="SEJC-2026-0481" disabled />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="rfc">RFC</Label>
      <Input id="rfc" defaultValue="XAXX010" aria-invalid="true" />
      <span className="text-sm text-destructive">RFC incompleto o inválido.</span>
    </div>
  </div>
)
