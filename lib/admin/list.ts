// Estado de las listas del panel en la URL (page, pageSize, sort, dir, status, q, asignado)
// y su traducción a una consulta paginada de Supabase. Compartido server + client.

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
}

type RawParams = Record<string, string | string[] | undefined>

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ""

export function parseListParams(
  raw: RawParams,
  opts: { sorts: readonly string[]; statuses: readonly string[] },
): ListParams {
  const page = Math.max(1, Math.floor(Number(first(raw.page))) || 1)
  const size = Number(first(raw.pageSize))
  const sort = first(raw.sort)
  const status = first(raw.status)
  const asignado = first(raw.asignado)
  return {
    page,
    pageSize: (PAGE_SIZES as readonly number[]).includes(size) ? size : DEFAULT_PAGE_SIZE,
    sort: opts.sorts.includes(sort) ? sort : "created_at",
    dir: first(raw.dir) === "asc" ? "asc" : "desc",
    status: opts.statuses.includes(status) ? status : "todos",
    q: first(raw.q).trim().slice(0, 80),
    asignado: asignado === "sin" || /^[0-9a-f-]{36}$/i.test(asignado) ? asignado : "todos",
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
}

/** href de la lista con `overrides` aplicados; omite los valores por defecto para URLs cortas. */
export function listHref(basePath: string, params: ListParams, overrides: Partial<ListParams> = {}): string {
  const next = { ...params, ...overrides }
  const sp = new URLSearchParams()
  for (const key of Object.keys(DEFAULTS) as Array<keyof ListParams>) {
    if (String(next[key]) !== String(DEFAULTS[key])) sp.set(key, String(next[key]))
  }
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

/** Subconjunto del query builder de PostgREST que usan las listas. */
type Filterable = {
  eq(column: string, value: string): Filterable
  is(column: string, value: null): Filterable
  or(filters: string): Filterable
}

/**
 * Filtros de estatus, asignado y búsqueda. La búsqueda acepta texto libre (ilike en
 * `textColumns`), teléfono con o sin espacios, y folio (COT-3F2A91 o 3f2a91): el folio
 * son los primeros 6 hex del uuid, así que se busca como rango de ids sin tocar la base.
 */
export function applyListFilters<T>(
  query: T,
  p: Pick<ListParams, "status" | "q" | "asignado">,
  opts: { textColumns: string[]; phoneColumn?: string; statusColumn?: string; withStatus?: boolean },
): T {
  // Cast a la interfaz mínima: los genéricos de supabase-js revientan la inferencia de TS.
  let q = query as unknown as Filterable
  if (opts.withStatus !== false && p.status !== "todos") q = q.eq(opts.statusColumn ?? "status", p.status)
  if (p.asignado === "sin") q = q.is("assigned_to", null)
  else if (p.asignado !== "todos") q = q.eq("assigned_to", p.asignado)

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

/** Índices `.range()` de la página pedida. */
export function pageRange(p: Pick<ListParams, "page" | "pageSize">): [number, number] {
  const from = (p.page - 1) * p.pageSize
  return [from, from + p.pageSize - 1]
}
