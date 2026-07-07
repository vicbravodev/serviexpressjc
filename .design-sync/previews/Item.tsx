import {
  Badge,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "my-v0-project"
import { Snowflake, Container, ShieldCheck } from "lucide-react"

export const Servicios = () => (
  <ItemGroup className="w-full max-w-md">
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Container />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Caja seca 53 pies</ItemTitle>
        <ItemDescription>
          Carga general paletizada con cruce a Texas por Nuevo Laredo.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="secondary">Disponible</Badge>
      </ItemActions>
    </Item>
    <ItemSeparator />
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Snowflake />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Refrigerado</ItemTitle>
        <ItemDescription>
          Cadena de frío controlada de -18 °C a 4 °C con registro de
          temperatura.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Cotizar
        </Button>
      </ItemActions>
    </Item>
    <ItemSeparator />
    <Item variant="outline">
      <ItemMedia variant="icon">
        <ShieldCheck />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Custodia armada</ItemTitle>
        <ItemDescription>
          Escolta certificada para rutas de alto valor en el noreste.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Cotizar
        </Button>
      </ItemActions>
    </Item>
  </ItemGroup>
)
