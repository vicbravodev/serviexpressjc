// Estado de las listas del panel en la URL (page, pageSize, sort, dir, status, q, asignado,
// rango de fechas y filtros por tipo) y su traducción a una consulta paginada de Supabase.
// Compartido server + client.

export const PAGE_SIZES = [25, 50, 100] as const
const DEFAULT_PAGE_SIZE = 25

export type SortDir = "asc" | "desc"

export type ListParams = {
  page: number
  pageSize: number
  sort: string
  dir: SortDir
  /** "todos" o una clave de estatus de la tabla. */
  status: string
  q: string
  /** "todos", "sin" (sin asignar) o el uuid de un miembro del equipo. */
  asignado: string
  /** Rango de "Recibida" en días de Monterrey, YYYY-MM-DD; "" = sin límite. Inclusivo. */
  desde: string
  hasta: string
  /** Filtros por tipo: columna → valor. Solo columnas declaradas como `Facet` de la lista. */
  f: Record<string, string>
}

/** Filtro por tipo: `key` es la columna de la base y también el parámetro de la URL. */
export type Facet = {
  key: string
  label: string
  /** Opción "sin filtro", p. ej. "Cualquier servicio". */
  allLabel: string
  options: Array<{ value: string; label: string }>
}

/** Opciones de un Facet a partir de un mapa clave → etiqueta de meta.ts. */
export const facetOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }))

type RawParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ""

const isDay = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`))

export function parseListParams(
  raw: RawParams,
  opts: { sorts: readonly string[]; statuses: readonly string[]; facets?: readonly Facet[] },
): ListParams {
  const page = Math.max(1, Math.floor(Number(first(raw.page))) || 1)
  const size = Number(first(raw.pageSize))
  const sort = first(raw.sort)
  const status = first(raw.status)
  const asignado = first(raw.asignado)
  let desde = isDay(first(raw.desde)) ? first(raw.desde) : ""
  let hasta = isDay(first(raw.hasta)) ? first(raw.hasta) : ""
  if (desde && hasta && desde > hasta) [desde, hasta] = [hasta, desde]
  const f: Record<string, string> = {}
  for (const facet of opts.facets ?? []) {
    const v = first(raw[facet.key])
    if (facet.options.some((o) => o.value === v)) f[facet.key] = v
  }
  return {
    page,
    pageSize: (PAGE_SIZES as readonly number[]).includes(size) ? size : DEFAULT_PAGE_SIZE,
    sort: opts.sorts.includes(sort) ? sort : "created_at",
    dir: first(raw.dir) === "asc" ? "asc" : "desc",
    status: opts.statuses.includes(status) ? status : "todos",
    q: first(raw.q).trim().slice(0, 80),
    asignado: asignado === "sin" || /^[0-9a-f-]{36}$/i.test(asignado) ? asignado : "todos",
    desde,
    hasta,
    f,
  }
}

const DEFAULTS: ListParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  sort: "created_at",
  dir: "desc",
  status: "todos",
  q: "",
  asignado: "todos",
  desde: "",
  hasta: "",
  f: {},
}

/** ¿Hay algo filtrado además del estatus? (búsqueda, asignado, fechas o tipo) */
export const hasFilters = (p: ListParams) =>
  p.q !== "" || p.asignado !== "todos" || p.desde !== "" || p.hasta !== "" || Object.keys(p.f).length > 0

/** Los mismos parámetros sin búsqueda, asignado, fechas ni tipo (conserva estatus y orden). */
export const clearFilters = (p: ListParams): ListParams => ({
  ...p,
  page: 1,
  q: "",
  asignado: "todos",
  desde: "",
  hasta: "",
  f: {},
})

/** href de la lista con `overrides` aplicados; omite los valores por defecto para URLs cortas. */
export function listHref(basePath: string, params: ListParams, overrides: Partial<ListParams> = {}): string {
  const next = { ...params, ...overrides }
  const sp = new URLSearchParams()
  for (const key of Object.keys(DEFAULTS) as Array<keyof ListParams>) {
    if (key !== "f" && String(next[key]) !== String(DEFAULTS[key])) sp.set(key, String(next[key]))
  }
  for (const [key, value] of Object.entries(next.f)) if (value) sp.set(key, value)
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

/** Subconjunto del query builder de PostgREST que usan las listas. */
type Filterable = {
  eq(column: string, value: string): Filterable
  gte(column: string, value: string): Filterable
  lt(column: string, value: string): Filterable
  is(column: string, value: null): Filterable
  or(filters: string): Filterable
}

/**
 * Filtros de estatus, asignado, fechas, tipo y búsqueda. La búsqueda acepta texto libre (ilike en
 * `textColumns`), teléfono con o sin espacios, y folio (COT-3F2A91 o 3f2a91): el folio
 * son los primeros 6 hex del uuid, así que se busca como rango de ids sin tocar la base.
 */
export function applyListFilters<T>(
  query: T,
  p: Pick<ListParams, "status" | "q" | "asignado" | "desde" | "hasta" | "f">,
  opts: { textColumns: string[]; phoneColumn?: string; statusColumn?: string; withStatus?: boolean },
): T {
  // Cast a la interfaz mínima: los genéricos de supabase-js revientan la inferencia de TS.
  let q = query as unknown as Filterable
  if (opts.withStatus !== false && p.status !== "todos") q = q.eq(opts.statusColumn ?? "status", p.status)
  if (p.asignado === "sin") q = q.is("assigned_to", null)
  else if (p.asignado !== "todos") q = q.eq("assigned_to", p.asignado)
  if (p.desde) q = q.gte("created_at", dayStart(p.desde))
  if (p.hasta) q = q.lt("created_at", dayStart(addDays(p.hasta, 1)))
  // Las columnas de `f` ya vienen validadas contra los Facet de la lista en parseListParams.
  for (const [column, value] of Object.entries(p.f)) q = q.eq(column, value)

  // Quita lo que rompe la sintaxis de `or` de PostgREST.
  const term = p.q.replace(/[,()*%\\:"]/g, " ").replace(/\s+/g, " ").trim()
  if (!term) return q as unknown as T

  const folio = term.match(/^(?:cot|soc|pos)?-?\s*([0-9a-f]{6})$/i)
  if (folio && /^(?:cot|soc|pos)/i.test(term)) return q.or(idRange(folio[1])) as unknown as T

  const parts = opts.textColumns.map((c) => `${c}.ilike.*${term}*`)
  const digits = term.replace(/\D/g, "")
  // ponytail: comodín entre dígitos para ignorar el formato del teléfono; full-text si crece el volumen.
  if (opts.phoneColumn && digits.length >= 4 && /^[\d\s+-]+$/.test(term)) {
    parts.push(`${opts.phoneColumn}.ilike.*${digits.split("").join("*")}*`)
  }
  if (folio) parts.push(idRange(folio[1]))
  return q.or(parts.join(",")) as unknown as T
}

function idRange(hex6: string) {
  const h = hex6.toLowerCase()
  return `and(id.gte.${h}00-0000-0000-0000-000000000000,id.lte.${h}ff-ffff-ffff-ffff-ffffffffffff)`
}

// ---- Fechas en días de Monterrey (UTC-6 fijo desde 2022, igual que el tablero) ----

/** Inicio del día YYYY-MM-DD de Monterrey como instante ISO (UTC). */
const dayStart = (day: string) => new Date(`${day}T00:00:00-06:00`).toISOString()

/** Suma días a YYYY-MM-DD sin pasar por la zona horaria del equipo. */
export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Hoy en Monterrey, YYYY-MM-DD. */
export const todayMty = (now = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Monterrey" }).format(now)

export const DATE_PRESETS = [
  { value: "hoy", label: "Hoy" },
  { value: "ayer", label: "Ayer" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "mes", label: "Este mes" },
] as const

/** Rango [desde, hasta] de un atajo de fecha, relativo a `today`. */
export function presetRange(preset: string, today: string): [string, string] | null {
  switch (preset) {
    case "hoy":
      return [today, today]
    case "ayer":
      return [addDays(today, -1), addDays(today, -1)]
    case "7d":
      return [addDays(today, -6), today]
    case "30d":
      return [addDays(today, -29), today]
    case "mes":
      return [`${today.slice(0, 8)}01`, today]
    default:
      return null
  }
}

/** Índices `.range()` de la página pedida. */
export function pageRange(p: Pick<ListParams, "page" | "pageSize">): [number, number] {
  const from = (p.page - 1) * p.pageSize
  return [from, from + p.pageSize - 1]
}
