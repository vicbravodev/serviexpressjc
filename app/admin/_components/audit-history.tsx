import { fmtShort, type StatusMeta } from "@/lib/admin/meta"

export type AuditRow = {
  id: string
  created_at: string
  actor_email: string | null
  action: string
  old_value: { status?: string } | null
  new_value: { status?: string; lost_reason?: string | null } | null
  note: string | null
}

type Entry = { titulo: string; nota: string | null }

function toEntry(row: AuditRow, statusLabel: (s: string) => StatusMeta): Entry {
  if (row.action === "create") {
    return { titulo: "Llegó desde el formulario del sitio", nota: null }
  }
  if (row.action === "status_change") {
    const label = (s?: string) => (s ? statusLabel(s).label : "sin estatus")
    const reason = row.new_value?.lost_reason
    return {
      titulo: `Cambió el estatus de ${label(row.old_value?.status)} a ${label(row.new_value?.status)}`,
      nota: reason ? `Motivo: ${reason}` : null,
    }
  }
  if (row.action === "note") {
    const nota = row.note ?? ""
    // Las asignaciones se registran como notas con texto fijo; se leen mejor como el evento mismo.
    if (nota.startsWith("Asignó la gestión a ") || nota === "Quitó la asignación") {
      return { titulo: nota, nota: null }
    }
    return { titulo: "Agregó una nota", nota }
  }
  return { titulo: row.action, nota: row.note }
}

/** Línea de tiempo del registro de auditoría, lo más reciente arriba. */
export function AuditHistory({
  rows,
  statusLabel,
  nameByEmail,
}: {
  rows: AuditRow[]
  statusLabel: (s: string) => StatusMeta
  /** Para mostrar "Mariana Salinas" en vez del correo. */
  nameByEmail: Map<string, string>
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no hay movimientos en esta gestión.</p>
  }
  return (
    <ol className="relative flex flex-col gap-5 border-l pl-5">
      {rows.map((row) => {
        const e = toEntry(row, statusLabel)
        const actor = row.actor_email ? (nameByEmail.get(row.actor_email) ?? row.actor_email) : "Sitio web"
        return (
          <li key={row.id} className="relative flex flex-col gap-1">
            <span aria-hidden className="absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-background bg-muted-foreground/60" />
            <p className="text-sm font-medium">{e.titulo}</p>
            {e.nota ? <p className="max-w-prose text-sm whitespace-pre-line text-muted-foreground">{e.nota}</p> : null}
            <p className="text-xs text-muted-foreground tabular-nums">
              {actor}, {fmtShort(row.created_at)}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
