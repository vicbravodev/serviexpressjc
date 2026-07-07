import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  Label,
} from "my-v0-project"
import { Search, Mail, Weight, Send } from "lucide-react"

export const ConIcono = () => (
  <div className="grid w-80 gap-2">
    <Label htmlFor="buscar">Buscar embarque</Label>
    <InputGroup>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput id="buscar" placeholder="Folio o ciudad de destino" />
    </InputGroup>
  </div>
)

export const ConTexto = () => (
  <div className="grid w-80 gap-2">
    <Label htmlFor="peso-carga">Peso de la carga</Label>
    <InputGroup>
      <InputGroupAddon>
        <Weight />
      </InputGroupAddon>
      <InputGroupInput id="peso-carga" defaultValue="22000" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>kg</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  </div>
)

export const ConBoton = () => (
  <div className="grid w-80 gap-2">
    <Label htmlFor="correo-cot">Recibe tu cotización por correo</Label>
    <InputGroup>
      <InputGroupAddon>
        <Mail />
      </InputGroupAddon>
      <InputGroupInput
        id="correo-cot"
        type="email"
        placeholder="logistica@empresa.com.mx"
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="default" size="sm">
          Enviar
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
)

export const ConTextarea = () => (
  <div className="grid w-80 gap-2">
    <Label htmlFor="detalle">Detalle del embarque</Label>
    <InputGroup>
      <InputGroupTextarea
        id="detalle"
        placeholder="Caja seca de 53 pies, 22 toneladas de acero laminado, salida de Monterrey con destino a Houston."
        rows={3}
      />
      <InputGroupAddon align="block-end">
        <InputGroupText>Operadores con visa B1 disponibles</InputGroupText>
        <InputGroupButton variant="default" size="sm" className="ml-auto">
          <Send />
          Solicitar
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
)
