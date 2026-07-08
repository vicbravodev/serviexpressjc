import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "my-v0-project"

export const SalaDeControl = () => (
  <ResizablePanelGroup
    direction="horizontal"
    className="h-64 w-full max-w-md rounded-lg border"
  >
    <ResizablePanel defaultSize={45}>
      <div className="flex h-full flex-col gap-1 p-4">
        <p className="text-sm font-medium">Flota activa</p>
        <p className="text-xs text-muted-foreground">TR-142 · En ruta</p>
        <p className="text-xs text-muted-foreground">TR-087 · En cruce</p>
        <p className="text-xs text-muted-foreground">TR-215 · Programado</p>
      </div>
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={55}>
      <div className="flex h-full flex-col gap-1 p-4">
        <p className="text-sm font-medium">Detalle unidad TR-142</p>
        <p className="text-xs text-muted-foreground">
          Monterrey → Houston · caja seca 53 pies
        </p>
        <p className="text-xs text-muted-foreground">
          Último reporte: Nuevo Laredo, Tamps.
        </p>
        <p className="text-xs text-muted-foreground">ETA 15:10 h</p>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
)
