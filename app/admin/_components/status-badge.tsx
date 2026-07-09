import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Etiquetas y colores semánticos para los status de leads y postulaciones.
// Las llaves cubren ambos flujos (load_requests + job_applications).
const STATUS_META: Record<string, { label: string; className: string }> = {
  new: { label: "Nuevo", className: "bg-primary/12 text-primary" },
  contacted: { label: "Contactado", className: "bg-secondary/15 text-secondary" },
  in_progress: { label: "En progreso", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  reviewed: { label: "Revisado", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  won: { label: "Ganado", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  hired: { label: "Contratado", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  lost: { label: "Perdido", className: "bg-destructive/12 text-destructive" },
  rejected: { label: "Rechazado", className: "bg-destructive/12 text-destructive" },
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = STATUS_META[status] ?? { label: status, className: "bg-muted text-muted-foreground" }
  return (
    <Badge variant="outline" className={cn("border-transparent capitalize", meta.className, className)}>
      {meta.label}
    </Badge>
  )
}
