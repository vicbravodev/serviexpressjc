// Metadatos compartidos (server + client) para el panel admin: estatus, folios y formato.

/**
 * Secciones del panel que se pueden dar por persona. Admin las tiene todas (y además
 * Usuarios); un "user" solo las que tenga en `profiles.permissions`. La misma lista
 * vive en el CHECK de la migración 0005.
 */
export const SECTIONS = ["leads", "socios", "postulaciones"] as const
export type Section = (typeof SECTIONS)[number]
export const SECTION_LABELS: Record<Section, string> = {
  leads: "Cotizaciones",
  socios: "Socios comerciales",
  postulaciones: "Postulaciones",
}

export type LeadStatus = "new" | "contacted" | "in_progress" | "won" | "lost"
export type ApplicationStatus = "new" | "reviewed" | "contacted" | "hired" | "rejected"

export type StatusMeta = {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  /** Clases extra sobre el Badge: el color dice en qué punto del flujo va. */
  className?: string
}

// Lo pendiente es lo único que lleva el ámbar; lo cerrado se apaga a gris. Mismo
// estatus, mismo color en las tres entidades (todas las combinaciones pasan AA).
export const BADGE_NEW = "border-transparent bg-[oklch(0.95_0.07_85)] text-[oklch(0.4_0.09_65)]"
const BADGE_REVIEWED = "border-transparent bg-[oklch(0.95_0.006_240)] text-[oklch(0.35_0.015_240)]"
const BADGE_CONTACTED = "border-transparent bg-[oklch(0.94_0.03_264)] text-[oklch(0.4_0.12_264)]"
const BADGE_ACTIVE = "border-transparent bg-primary text-primary-foreground"
const BADGE_WON = "border-transparent bg-[oklch(0.94_0.05_155)] text-[oklch(0.37_0.09_155)]"
const BADGE_CLOSED = "border-transparent bg-muted text-muted-foreground"

export const LEAD_STATUS_META: Record<LeadStatus, StatusMeta> = {
  new: { label: "Nuevo", variant: "outline", className: BADGE_NEW },
  contacted: { label: "Contactado", variant: "outline", className: BADGE_CONTACTED },
  in_progress: { label: "En proceso", variant: "outline", className: BADGE_ACTIVE },
  won: { label: "Ganado", variant: "outline", className: BADGE_WON },
  lost: { label: "Perdido", variant: "outline", className: BADGE_CLOSED },
}

export const APPLICATION_STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  new: { label: "Nuevo", variant: "outline", className: BADGE_NEW },
  reviewed: { label: "Revisado", variant: "outline", className: BADGE_REVIEWED },
  contacted: { label: "Contactado", variant: "outline", className: BADGE_CONTACTED },
  hired: { label: "Contratado", variant: "outline", className: BADGE_WON },
  rejected: { label: "Rechazado", variant: "outline", className: BADGE_CLOSED },
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
export const SERVICE_LABELS: Record<string, string> = {
  nacional: "Nacional",
  internacional: "Internacional",
}
export const UNIT_LABELS: Record<string, string> = {
  dryvan: "Caja seca 53 pies",
  flatbed: "Plataforma",
  oversize: "Sobredimensionada",
}
export const URGENCY_LABELS: Record<string, string> = {
  normal: "No urgente",
  urgente: "Urgente",
}
export const POSITION_LABELS: Record<string, string> = {
  b1: "Operador B1 (cruce)",
  national: "Operador nacional",
  mechanic: "Técnico de taller",
  admin: "Administrativo",
}
export const EXPERIENCE_LABELS: Record<string, string> = {
  lt2: "Menos de 2 años",
  "2to5": "2 a 5 años",
  "5to10": "5 a 10 años",
  gt10: "Más de 10 años",
}
export const PARTNER_UNIT_LABELS: Record<string, string> = {
  tractor: "Tractocamión",
  plataforma: "Plataforma",
  ambos: "Tractocamión + plataforma",
}

export const NO_DATA = "Sin dato"
export const serviceLabel = (v: string | null) => (v ? (SERVICE_LABELS[v] ?? v) : NO_DATA)
export const unitLabel = (v: string | null) => (v ? (UNIT_LABELS[v] ?? v) : NO_DATA)
export const urgencyLabel = (v: string | null) => (v ? (URGENCY_LABELS[v] ?? v) : NO_DATA)
export const positionLabel = (v: string | null) => (v ? (POSITION_LABELS[v] ?? v) : NO_DATA)
export const experienceLabel = (v: string | null) => (v ? (EXPERIENCE_LABELS[v] ?? v) : NO_DATA)
export const partnerUnitLabel = (v: string | null) => (v ? (PARTNER_UNIT_LABELS[v] ?? v) : NO_DATA)

/** Folio corto legible derivado del uuid (ej. COT-3F2A91). */
export function folio(prefix: "COT" | "POS" | "SOC", id: string): string {
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

/** "07 jul, 08:12" en hora de Monterrey. */
export function fmtShort(iso: string): string {
  const d = new Date(iso)
  const fecha = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Monterrey",
  })
    .format(d)
    .replace(".", "")
    .replace("-", " ")
  const hora = new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Monterrey",
  }).format(d)
  return `${fecha}, ${hora}`
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
