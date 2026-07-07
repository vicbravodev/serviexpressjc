import {
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "my-v0-project"

export const Origen = () => (
  <div className="grid w-72 gap-2">
    <Label htmlFor="origen">Origen</Label>
    <Select defaultValue="mty">
      <SelectTrigger id="origen">
        <SelectValue placeholder="Elige ciudad de origen" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Norte</SelectLabel>
          <SelectItem value="mty">Monterrey, NL</SelectItem>
          <SelectItem value="sal">Saltillo, Coah.</SelectItem>
          <SelectItem value="cdj">Ciudad Juárez, Chih.</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Bajío</SelectLabel>
          <SelectItem value="qro">Querétaro, Qro.</SelectItem>
          <SelectItem value="slp">San Luis Potosí, SLP</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
)

export const SinSeleccion = () => (
  <div className="grid w-72 gap-2">
    <Label htmlFor="destino">Destino</Label>
    <Select>
      <SelectTrigger id="destino">
        <SelectValue placeholder="Elige ciudad de destino" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="hou">Houston, TX</SelectItem>
        <SelectItem value="dal">Dallas, TX</SelectItem>
        <SelectItem value="lar">Laredo, TX</SelectItem>
      </SelectContent>
    </Select>
  </div>
)
