import { Separator } from "my-v0-project"

export const EntreBloques = () => (
  <div className="w-72">
    <div className="space-y-1">
      <h4 className="text-sm font-medium">Servi Express</h4>
      <p className="text-sm text-muted-foreground">
        Transporte de carga México–USA
      </p>
    </div>
    <Separator className="my-4" />
    <div className="space-y-1">
      <h4 className="text-sm font-medium">Cobertura</h4>
      <p className="text-sm text-muted-foreground">
        32 estados y cruce por Laredo, TX
      </p>
    </div>
  </div>
)

export const BarraHerramientas = () => (
  <div className="flex h-6 items-center gap-3 text-sm">
    <span>Rastreo</span>
    <Separator orientation="vertical" />
    <span>Cotizar</span>
    <Separator orientation="vertical" />
    <span>Contacto</span>
  </div>
)
