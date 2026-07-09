import { Circle } from "lucide-react"
import { fmtShort, type StatusMeta } from "@/lib/admin/meta"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

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
    return { titulo: "Recibida desde el formulario del sitio", nota: null }
  }
  if (row.action === "status_change") {
    const de = row.old_value?.status ? statusLabel(row.old_value.status).label : "—"
    const a = row.new_value?.status ? statusLabel(row.new_value.status).label : "—"
    const motivo = row.new_value?.status === "lost" && row.new_value?.lost_reason
    return { titulo: `Cambió estatus de ${de} a ${a}`, nota: motivo ? `Motivo: ${row.new_value?.lost_reason}` : null }
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

export function AuditHistory({
  rows,
  statusLabel,
}: {
  rows: AuditRow[]
  statusLabel: (s: string) => StatusMeta
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial</CardTitle>
        <CardDescription>Registro de auditoría de esta gestión.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>
        ) : (
          <ItemGroup>
            {rows.map((row) => {
              const e = toEntry(row, statusLabel)
              return (
                <Item key={row.id}>
                  <ItemMedia variant="icon">
                    <Circle className="fill-current" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{e.titulo}</ItemTitle>
                    {e.nota ? <ItemDescription>{e.nota}</ItemDescription> : null}
                    <span className="font-mono text-xs text-muted-foreground">
                      {row.actor_email ?? "sitio-web"} · {fmtShort(row.created_at)}
                    </span>
                  </ItemContent>
                </Item>
              )
            })}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
