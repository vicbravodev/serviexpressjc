import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  Input,
  Textarea,
} from "my-v0-project"

export const DatosEmbarque = () => (
  <FieldSet className="w-80">
    <FieldLegend>Datos del embarque</FieldLegend>
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="mercancia">Mercancía</FieldLabel>
        <Input id="mercancia" defaultValue="Rollos de acero laminado" />
        <FieldDescription>
          Describe el tipo de carga para asignar la unidad correcta.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="peso">Peso estimado (ton)</FieldLabel>
        <Input id="peso" type="number" defaultValue="18.2" />
      </Field>
    </FieldGroup>
  </FieldSet>
)

export const ConError = () => (
  <FieldSet className="w-80">
    <FieldLegend>Referencia de recolección</FieldLegend>
    <FieldGroup>
      <Field data-invalid="true">
        <FieldLabel htmlFor="rfc">RFC del cliente</FieldLabel>
        <Input id="rfc" aria-invalid defaultValue="XAXX01" />
        <FieldError errors={[{ message: "El RFC debe tener 12 o 13 caracteres." }]} />
      </Field>
      <FieldSeparator>o</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="notas">Instrucciones para el operador</FieldLabel>
        <Textarea
          id="notas"
          defaultValue="Presentarse en andén 4, planta Ternium Guerrero."
        />
      </Field>
    </FieldGroup>
  </FieldSet>
)

export const Horizontal = () => (
  <FieldGroup className="w-96">
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor="gps">Monitoreo GPS</FieldLabel>
        <FieldDescription>
          Comparte la ubicación de la unidad en tiempo real.
        </FieldDescription>
      </FieldContent>
      <Input id="gps" className="w-16" defaultValue="ON" readOnly />
    </Field>
  </FieldGroup>
)
