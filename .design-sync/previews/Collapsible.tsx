import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "my-v0-project"
import { ChevronsUpDown } from "lucide-react"

export const Detalle = () => (
  <Collapsible defaultOpen className="w-full max-w-sm space-y-2">
    <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
      <div>
        <p className="text-sm font-medium">Embarque MTY → Houston</p>
        <p className="text-xs text-muted-foreground">Folio SE-20418</p>
      </div>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <ChevronsUpDown className="size-4" />
          <span className="sr-only">Ver detalle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent className="space-y-2">
      <div className="rounded-md border px-4 py-2 text-sm text-muted-foreground">
        Salida 06:40 h · Nuevo Laredo 10:15 h
      </div>
      <div className="rounded-md border px-4 py-2 text-sm text-muted-foreground">
        Cruce liberado 11:30 h · ETA 15:10 h
      </div>
      <div className="rounded-md border px-4 py-2 text-sm text-muted-foreground">
        Operador: J. Treviño · Caja seca 53 pies
      </div>
    </CollapsibleContent>
  </Collapsible>
)
