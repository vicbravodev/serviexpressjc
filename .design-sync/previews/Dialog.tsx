import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "my-v0-project"

export const Cotizacion = () => (
  <div className="min-h-96">
    <Dialog open modal={false}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Solicita tu cotización</DialogTitle>
          <DialogDescription>
            Cuéntanos de tu embarque y un asesor te contacta en menos de 2
            horas hábiles.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="origen">Origen</Label>
            <Input id="origen" defaultValue="Monterrey, N.L." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destino">Destino</Label>
            <Input id="destino" defaultValue="Houston, TX" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="carga">Tipo de carga</Label>
            <Input id="carga" defaultValue="Acero · 18.2 ton · caja seca 53'" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Enviar solicitud</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
)
