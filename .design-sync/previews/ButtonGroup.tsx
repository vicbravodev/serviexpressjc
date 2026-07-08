import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
  Button,
} from "my-v0-project"
import { MapPinIcon } from "lucide-react"

export const Acciones = () => (
  <ButtonGroup>
    <Button variant="outline">Rastrear</Button>
    <Button variant="outline">Reprogramar</Button>
    <Button variant="outline">Cancelar</Button>
  </ButtonGroup>
)

export const ConSeparador = () => (
  <ButtonGroup>
    <Button variant="outline">Monterrey</Button>
    <ButtonGroupSeparator />
    <Button variant="outline">Houston</Button>
  </ButtonGroup>
)

export const ConTexto = () => (
  <ButtonGroup>
    <ButtonGroupText>
      <MapPinIcon />
      Origen
    </ButtonGroupText>
    <Button variant="outline">Monterrey, N.L.</Button>
  </ButtonGroup>
)

export const Vertical = () => (
  <ButtonGroup orientation="vertical">
    <Button variant="outline">Caja seca 53 pies</Button>
    <Button variant="outline">Refrigerada</Button>
    <Button variant="outline">Plataforma</Button>
  </ButtonGroup>
)
