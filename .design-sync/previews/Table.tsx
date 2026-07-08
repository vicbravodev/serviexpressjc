import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "my-v0-project"

const embarques = [
  {
    unidad: "TR-142",
    ruta: "Monterrey → Houston",
    carga: "Acero rolado · 18.4 t",
    eta: "15:10 h",
    estatus: "En ruta",
    tono: "default" as const,
  },
  {
    unidad: "TR-087",
    ruta: "Saltillo → Laredo",
    carga: "Autopartes · 12.1 t",
    eta: "11:45 h",
    estatus: "En cruce",
    tono: "secondary" as const,
  },
  {
    unidad: "TR-215",
    ruta: "Apodaca → San Antonio",
    carga: "Electrodomésticos · 9.8 t",
    eta: "18:30 h",
    estatus: "Programado",
    tono: "outline" as const,
  },
  {
    unidad: "TR-039",
    ruta: "Ramos Arizpe → Dallas",
    carga: "Bobina galvanizada · 21.0 t",
    eta: "Retrasado",
    estatus: "Detenido",
    tono: "destructive" as const,
  },
  {
    unidad: "TR-176",
    ruta: "García → Nuevo Laredo",
    carga: "Perfil estructural · 16.7 t",
    eta: "09:05 h",
    estatus: "Entregado",
    tono: "secondary" as const,
  },
]

export const Tablero = () => (
  <Table>
    <TableCaption>Embarques activos · turno matutino</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Unidad</TableHead>
        <TableHead>Ruta</TableHead>
        <TableHead>Carga</TableHead>
        <TableHead>ETA</TableHead>
        <TableHead className="text-right">Estatus</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {embarques.map((e) => (
        <TableRow key={e.unidad}>
          <TableCell className="font-medium">{e.unidad}</TableCell>
          <TableCell>{e.ruta}</TableCell>
          <TableCell className="text-muted-foreground">{e.carga}</TableCell>
          <TableCell>{e.eta}</TableCell>
          <TableCell className="text-right">
            <Badge variant={e.tono}>{e.estatus}</Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
