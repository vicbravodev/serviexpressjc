// Metadatos compartidos (server + client) para el panel admin: estatus, folios y formato.

export type LeadStatus = "new" | "contacted" | "in_progress" | "won" | "lost"
export type ApplicationStatus = "new" | "reviewed" | "contacted" | "hired" | "rejected"

export type StatusMeta = {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  /** Clases extra sobre el Badge (verde para ganado/contratado, contorno azul para proceso). */
  className?: string
}

const BADGE_WON = "border-transparent bg-[oklch(0.52_0.12_155)] text-[oklch(0.99_0.003_155)]"
const BADGE_PROGRESS = "border-primary text-primary bg-transparent"

export const LEAD_STATUS_META: Record<LeadStatus, StatusMeta> = {
  new: { label: "Nuevo", variant: "default" },
  contacted: { label: "Contactado", variant: "secondary" },
  in_progress: { label: "En proceso", variant: "outline", className: BADGE_PROGRESS },
  won: { label: "Ganado", variant: "secondary", className: BADGE_WON },
  lost: { label: "Perdido", variant: "destructive" },
}

export const APPLICATION_STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  new: { label: "Nuevo", variant: "default" },
  reviewed: { label: "Revisado", variant: "secondary" },
  contacted: { label: "Contactado", variant: "outline", className: BADGE_PROGRESS },
  hired: { label: "Contratado", variant: "secondary", className: BADGE_WON },
  rejected: { label: "Rechazado", variant: "destructive" },
}

export const LEAD_STATUSES = Object.keys(LEAD_STATUS_META) as LeadStatus[]
export const APPLICATION_STATUSES = Object.keys(APPLICATION_STATUS_META) as ApplicationStatus[]

export function leadStatusMeta(status: string): StatusMeta {
  return LEAD_STATUS_META[status as LeadStatus] ?? { label: status, variant: "outline" }
}

export function applicationStatusMeta(status: string): StatusMeta {
  return APPLICATION_STATUS_META[status as ApplicationStatus] ?? { label: status, variant: "outline" }
}

// Los formularios públicos persisten claves crudas; etiquetas para el panel.
const SERVICE_LABELS: Record<string, string> = {
  nacional: "Nacional",
  internacional: "Internacional",
}
const UNIT_LABELS: Record<string, string> = {
  dryvan: "Caja seca 53 pies",
  flatbed: "Plataforma",
  oversize: "Sobredimensionada",
}
const URGENCY_LABELS: Record<string, string> = {
  normal: "No urgente",
  urgente: "Urgente",
}
const POSITION_LABELS: Record<string, string> = {
  b1: "Operador B1 (cruce)",
  national: "Operador nacional",
  mechanic: "Técnico de taller",
  admin: "Administrativo",
}
const EXPERIENCE_LABELS: Record<string, string> = {
  lt2: "Menos de 2 años",
  "2to5": "2 a 5 años",
  "5to10": "5 a 10 años",
  gt10: "Más de 10 años",
}

export const serviceLabel = (v: string | null) => (v ? (SERVICE_LABELS[v] ?? v) : "—")
export const unitLabel = (v: string | null) => (v ? (UNIT_LABELS[v] ?? v) : "—")
export const urgencyLabel = (v: string | null) => (v ? (URGENCY_LABELS[v] ?? v) : "—")
export const positionLabel = (v: string | null) => (v ? (POSITION_LABELS[v] ?? v) : "—")
export const experienceLabel = (v: string | null) => (v ? (EXPERIENCE_LABELS[v] ?? v) : "—")

/** Folio corto legible derivado del uuid (ej. COT-3F2A91). */
export function folio(prefix: "COT" | "POS", id: string): string {
  return `${prefix}-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

/** "07 jul · 08:12" en hora de Monterrey. */
export function fmtShort(iso: string): string {
  const d = new Date(iso)
  const fecha = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Monterrey",
  })
    .format(d)
    .replace(".", "")
  const hora = new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Monterrey",
  }).format(d)
  return `${fecha} · ${hora}`
}

/** "12 ene 2025" */
export function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Monterrey",
  })
    .format(new Date(iso))
    .replace(".", "")
}
