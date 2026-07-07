import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "my-v0-project"
import { Ban, Copy, Eye, FileDown, MapPin, MoreHorizontal } from "lucide-react"

export const AccionesEmbarque = () => (
  <div className="flex min-h-96 items-start justify-center p-6">
    <DropdownMenu open modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Embarque MTY-4471
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuLabel>Embarque MTY-4471</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Eye />
            Ver embarque
            <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileDown />
            Descargar carta porte
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MapPin />
            Rastrear unidad
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy />
            Duplicar orden
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Ban />
          Cancelar embarque
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)
