import { ToggleGroup, ToggleGroupItem } from "my-v0-project"
import { TruckIcon, PackageIcon, SnowflakeIcon } from "lucide-react"

export const TipoUnidad = () => (
  <ToggleGroup type="single" defaultValue="seca" variant="outline">
    <ToggleGroupItem value="seca">Caja seca</ToggleGroupItem>
    <ToggleGroupItem value="refrigerada">Refrigerada</ToggleGroupItem>
    <ToggleGroupItem value="plataforma">Plataforma</ToggleGroupItem>
  </ToggleGroup>
)

export const ConIconos = () => (
  <ToggleGroup type="single" defaultValue="carga" variant="outline">
    <ToggleGroupItem value="carga" aria-label="Carga general">
      <TruckIcon />
    </ToggleGroupItem>
    <ToggleGroupItem value="paqueteria" aria-label="Paquetería">
      <PackageIcon />
    </ToggleGroupItem>
    <ToggleGroupItem value="refrigerada" aria-label="Refrigerada">
      <SnowflakeIcon />
    </ToggleGroupItem>
  </ToggleGroup>
)

export const Multiple = () => (
  <ToggleGroup type="multiple" defaultValue={["gps", "b1"]} variant="outline">
    <ToggleGroupItem value="gps" className="px-3">
      GPS
    </ToggleGroupItem>
    <ToggleGroupItem value="b1" className="px-3">
      Operador B1
    </ToggleGroupItem>
    <ToggleGroupItem value="doble" className="px-3">
      Doble placa
    </ToggleGroupItem>
  </ToggleGroup>
)
