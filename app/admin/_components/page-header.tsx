import type { ReactNode } from "react"

/** Encabezado de página del panel: título, una línea de contexto y acciones a la derecha. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-none items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/** Contenedor de página: mismo ancho y márgenes en todas las vistas del panel. */
export function PageBody({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div className={`mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 ${narrow ? "max-w-[1100px]" : "max-w-[1400px]"}`}>
      {children}
    </div>
  )
}
