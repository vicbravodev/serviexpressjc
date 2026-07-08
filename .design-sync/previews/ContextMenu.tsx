import * as React from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "my-v0-project"
import { Ban, FileDown, MapPin } from "lucide-react"

// ContextMenu.Root has no `open`/`defaultOpen` prop — open lives in internal
// state toggled by a real right-click. To capture the OPEN state statically,
// dispatch a `contextmenu` event on the trigger once mounted.
export const AccionesEmbarque = () => {
  const triggerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: r.left + r.width / 2,
        clientY: r.top + r.height / 2,
      }),
    )
  }, [])

  return (
    <div className="flex min-h-96 items-start justify-center p-6">
      <ContextMenu modal={false}>
        <ContextMenuTrigger ref={triggerRef} asChild>
          <div className="border-border text-muted-foreground flex h-28 w-80 items-center justify-center rounded-md border border-dashed text-sm">
            Clic derecho sobre el embarque MTY-4471
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-60">
          <ContextMenuLabel>Embarque MTY-4471</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <MapPin />
            Rastrear unidad
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <FileDown />
            Descargar carta porte
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <Ban />
            Cancelar embarque
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
