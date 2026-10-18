import type { ReactNode } from "react"
import { fmtShort, initials, type StatusMeta } from "@/lib/admin/meta"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Celdas compartidas por las cuatro listas para que se lean igual en todas.

export function Primary({ title, sub }: { title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="font-medium">{title}</span>
      {sub ? <span className="text-muted-foreground tabular-nums">{sub}</span> : null}
    </div>
  )
}

export function Received({ iso, folio }: { iso: string; folio: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="tabular-nums">{fmtShort(iso)}</span>
      <span className="font-mono text-xs text-muted-foreground">{folio}</span>
    </div>
  )
}

export function StatusBadge({ meta }: { meta: StatusMeta }) {
  return (
    <Badge variant={meta.variant} className={meta.className}>
      {meta.label}
    </Badge>
  )
}

export function Assignee({ name }: { name: string | null }) {
  if (!name) return <span className="text-muted-foreground">Sin asignar</span>
  return (
    <span className="flex items-center gap-2" title={name}>
      <Avatar className="size-6 text-[10px]">
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>
      {/* En pantallas medianas solo van las iniciales; el nombre sigue para lectores de pantalla. */}
      <span className="sr-only truncate xl:not-sr-only">{name}</span>
    </span>
  )
}

/** Fila apilada para móvil: título y estatus arriba, detalle y metadatos abajo. */
export function MobileRow({
  title,
  status,
  detail,
  meta,
}: {
  title: ReactNode
  status?: ReactNode
  detail?: ReactNode
  meta?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0 truncate font-medium">{title}</span>
        {status}
      </div>
      {detail ? <div className="text-muted-foreground">{detail}</div> : null}
      {meta ? <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground tabular-nums">{meta}</div> : null}
    </div>
  )
}
