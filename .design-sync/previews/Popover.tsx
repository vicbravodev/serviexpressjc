import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "my-v0-project"
import { SlidersHorizontal } from "lucide-react"

export const FiltrarEmbarques = () => (
  <div className="flex min-h-80 items-start justify-center p-6">
    <Popover open>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal />
          Filtrar embarques
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              Filtrar embarques
            </h4>
            <p className="text-muted-foreground text-sm">
              Acota el tablero por folio y ruta.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="folio">Folio</Label>
              <Input id="folio" defaultValue="MTY-4471" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ruta">Ruta</Label>
              <Input id="ruta" defaultValue="Monterrey → Laredo, TX" />
            </div>
          </div>
          <Button size="sm" className="w-full">
            Aplicar filtros
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
)
