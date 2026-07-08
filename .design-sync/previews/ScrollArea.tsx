import { ScrollArea } from "my-v0-project"

const destinos = [
  "Monterrey, N.L.",
  "Saltillo, Coah.",
  "Ramos Arizpe, Coah.",
  "Apodaca, N.L.",
  "García, N.L.",
  "Nuevo Laredo, Tamps.",
  "Reynosa, Tamps.",
  "Matamoros, Tamps.",
  "Laredo, TX",
  "San Antonio, TX",
  "Houston, TX",
  "Dallas, TX",
  "Fort Worth, TX",
  "El Paso, TX",
  "Querétaro, Qro.",
  "San Luis Potosí, S.L.P.",
  "Aguascalientes, Ags.",
  "Guadalajara, Jal.",
]

export const Destinos = () => (
  <ScrollArea className="h-48 w-full max-w-xs rounded-md border">
    <div className="p-4">
      <p className="mb-3 text-sm font-medium">Rutas con salida diaria</p>
      {destinos.map((d) => (
        <div
          key={d}
          className="border-b py-2 text-sm text-muted-foreground last:border-0"
        >
          {d}
        </div>
      ))}
    </div>
  </ScrollArea>
)
