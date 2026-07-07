import { RadioGroup, RadioGroupItem, Label } from "my-v0-project"

export const TipoUnidad = () => (
  <RadioGroup defaultValue="seca53" className="w-72">
    <span className="text-sm font-medium">Tipo de unidad</span>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="seca53" id="seca53" />
      <Label htmlFor="seca53">Caja seca 53 pies</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="refrigerada" id="refrigerada" />
      <Label htmlFor="refrigerada">Caja refrigerada</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="plataforma" id="plataforma" />
      <Label htmlFor="plataforma">Plataforma / lowboy</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="tolva" id="tolva" />
      <Label htmlFor="tolva">Tolva granelera</Label>
    </div>
  </RadioGroup>
)

export const Estados = () => (
  <RadioGroup defaultValue="nacional" className="w-72">
    <span className="text-sm font-medium">Alcance del servicio</span>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="nacional" id="nacional" />
      <Label htmlFor="nacional">Nacional</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="fronterizo" id="fronterizo" />
      <Label htmlFor="fronterizo">Cruce fronterizo</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="intermodal" id="intermodal" disabled />
      <Label htmlFor="intermodal">Intermodal (no disponible)</Label>
    </div>
  </RadioGroup>
)
