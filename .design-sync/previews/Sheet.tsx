import {
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "my-v0-project"

export const DetalleEmbarque = () => (
  <div className="min-h-96">
    <Sheet open modal={false}>
      <SheetContent side="right">
        <SheetHeader>
          <div className="flex items-center justify-between gap-2">
            <SheetTitle>Embarque #MTY-4821</SheetTitle>
            <Badge>En ruta</Badge>
          </div>
          <SheetDescription>
            Monterrey, N.L. → Houston, TX · Cruce por Colombia, N.L.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Unidad</span>
            <span className="font-medium">Caja seca 53' · Doble placa</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Operador</span>
            <span className="font-medium">J. Ramírez · Cert. B1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Carga</span>
            <span className="font-medium">Acero · 18.2 ton</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Último reporte</span>
            <span className="font-medium">Nuevo Laredo, Tamps.</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ETA</span>
            <span className="font-medium">Hoy · 15:10 h</span>
          </div>
        </div>
        <SheetFooter>
          <Button>Ver rastreo GPS</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
)

export const PanelIzquierdo = () => (
  <div className="min-h-96">
    <Sheet open modal={false}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filtrar embarques</SheetTitle>
          <SheetDescription>
            Ajusta la vista de tu tablero de control de flota.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">En ruta</span>
            <Badge>12</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">En cruce</span>
            <Badge variant="secondary">4</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entregados hoy</span>
            <Badge variant="outline">27</Badge>
          </div>
        </div>
        <SheetFooter>
          <Button className="w-full">Aplicar filtros</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
)
