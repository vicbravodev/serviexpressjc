import { Kbd, KbdGroup } from "my-v0-project"

export const Atajos = () => (
  <div className="grid gap-3">
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Buscar embarque</span>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Nueva cotización</span>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>N</Kbd>
      </KbdGroup>
    </div>
  </div>
)

export const TeclaUnica = () => (
  <div className="flex items-center gap-2 text-sm">
    <span className="text-muted-foreground">Cerrar panel de control</span>
    <Kbd>Esc</Kbd>
  </div>
)
