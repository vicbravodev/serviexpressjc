import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "my-v0-project"
import {
  FileText,
  MapPin,
  Navigation,
  Package,
  Route,
  Truck,
} from "lucide-react"

export const PaletaOperaciones = () => (
  <div className="p-6">
    <Command className="w-96 rounded-lg border shadow-md">
      <CommandInput placeholder="Buscar embarque, ruta o unidad..." />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Servicios">
          <CommandItem>
            <Truck />
            Carga completa (FTL)
            <CommandShortcut>⌘F</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Package />
            Consolidado (LTL)
            <CommandShortcut>⌘L</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FileText />
            Emitir carta porte
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Rutas">
          <CommandItem>
            <Route />
            Monterrey → Laredo, TX
          </CommandItem>
          <CommandItem>
            <MapPin />
            Saltillo → Guadalajara, Jal.
          </CommandItem>
          <CommandItem>
            <Navigation />
            Querétaro → Ciudad de México
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </div>
)
