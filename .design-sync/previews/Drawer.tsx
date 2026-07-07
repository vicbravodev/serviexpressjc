import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "my-v0-project"

export const ResumenCotizacion = () => (
  <div className="min-h-96">
    <Drawer open modal={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Resumen de tu cotización</DrawerTitle>
          <DrawerDescription>
            Monterrey, N.L. → Houston, TX · Servicio puerta a puerta
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3 px-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipo de unidad</span>
            <span className="font-medium">Caja seca 53'</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Peso declarado</span>
            <span className="font-medium">18.2 ton</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tiempo estimado</span>
            <span className="font-medium">8 h 30 min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Incluye</span>
            <span className="font-medium">Cruce y monitoreo GPS 24/7</span>
          </div>
        </div>
        <DrawerFooter>
          <Button>Confirmar y agendar</Button>
          <Button variant="outline">Seguir cotizando</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
)
