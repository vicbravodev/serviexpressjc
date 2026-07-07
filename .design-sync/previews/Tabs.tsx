import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "my-v0-project"

export const ModalidadesTransporte = () => (
  <div className="flex min-h-72 items-start justify-center p-6">
    <Tabs defaultValue="nacional" className="w-[420px]">
      <TabsList className="w-full">
        <TabsTrigger value="nacional">Nacional</TabsTrigger>
        <TabsTrigger value="internacional">Internacional</TabsTrigger>
        <TabsTrigger value="puerta">Puerta a puerta</TabsTrigger>
      </TabsList>
      <TabsContent value="nacional" className="pt-3">
        <p className="text-sm font-medium">Transporte nacional</p>
        <p className="text-muted-foreground text-sm">
          Carga completa y consolidada entre los principales corredores
          industriales de México, con salidas diarias desde Monterrey.
        </p>
      </TabsContent>
      <TabsContent value="internacional" className="pt-3">
        <p className="text-sm font-medium">Cruce internacional</p>
        <p className="text-muted-foreground text-sm">
          Embarques México–USA con despacho aduanal y transfer en la frontera
          de Nuevo Laredo hacia Texas y el sureste de Estados Unidos.
        </p>
      </TabsContent>
      <TabsContent value="puerta" className="pt-3">
        <p className="text-sm font-medium">Puerta a puerta</p>
        <p className="text-muted-foreground text-sm">
          Recolección en planta y entrega directa en el destino final, con
          rastreo GPS y confirmación de ETA en cada tramo de la ruta.
        </p>
      </TabsContent>
    </Tabs>
  </div>
)

export const PanelSeguimiento = () => (
  <div className="flex min-h-72 items-start justify-center p-6">
    <Tabs defaultValue="ruta" className="w-[420px]">
      <TabsList className="w-full">
        <TabsTrigger value="ruta">Ruta</TabsTrigger>
        <TabsTrigger value="unidad">Unidad</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
      </TabsList>
      <TabsContent value="ruta" className="pt-3">
        <p className="text-sm font-medium">Monterrey → Houston</p>
        <p className="text-muted-foreground text-sm">
          Avance 62% · ETA 15:10 h · último ping en Nuevo Laredo hace 8 min.
        </p>
      </TabsContent>
      <TabsContent value="unidad" className="pt-3">
        <p className="text-sm font-medium">Unidad TR-142</p>
        <p className="text-muted-foreground text-sm">
          Tractocamión con plataforma · operador Luis Treviño · 18.4 t de acero
          rolado.
        </p>
      </TabsContent>
      <TabsContent value="documentos" className="pt-3">
        <p className="text-sm font-medium">Documentación del embarque</p>
        <p className="text-muted-foreground text-sm">
          Carta porte, pedimento y factura comercial validados por el
          despacho aduanal.
        </p>
      </TabsContent>
    </Tabs>
  </div>
)
