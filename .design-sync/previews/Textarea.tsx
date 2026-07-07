import { Textarea, Label } from "my-v0-project"

export const Basico = () => (
  <div className="grid w-80 gap-2">
    <Label htmlFor="mensaje">Describe tu embarque</Label>
    <Textarea
      id="mensaje"
      placeholder="Ej. Necesito mover 22 toneladas de acero de Monterrey a Houston en caja seca de 53 pies."
    />
  </div>
)

export const ConValor = () => (
  <div className="grid w-80 gap-2">
    <Label htmlFor="observaciones">Observaciones para el operador</Label>
    <Textarea
      id="observaciones"
      defaultValue="Cita de carga a las 07:00 hrs en planta Ternium, Guerrero. Cruce por Laredo. Operador con visa B1 vigente."
      rows={4}
    />
  </div>
)

export const Estados = () => (
  <div className="grid w-80 gap-4">
    <div className="grid gap-2">
      <Label htmlFor="notas-dis">Notas internas</Label>
      <Textarea
        id="notas-dis"
        defaultValue="Embarque confirmado y en tránsito. No editable."
        disabled
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="comentarios-err">Comentarios</Label>
      <Textarea
        id="comentarios-err"
        placeholder="Este campo es obligatorio"
        aria-invalid="true"
      />
      <span className="text-sm text-destructive">
        Agrega al menos una nota antes de continuar.
      </span>
    </div>
  </div>
)
